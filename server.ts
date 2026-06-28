import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Initialize Gemini SDK if API Key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } catch (e) {
    console.error("Failed to initialize Gemini AI client:", e);
  }
} else {
  console.log("No GEMINI_API_KEY found. Falling back to keyword-based local intelligence.");
}

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Simple server-side persistence for leads and share tokens
interface ServerLead {
  id: string;
  context: {
    useCase: string;
    companyType: string;
    teamSize: string;
    urgency: string;
    integrations: string;
    budget: string;
    otherRequirements?: string;
  };
  messages: any[];
}

interface ServerShareToken {
  id: string;
  leadId: string;
  role: string;
  roleLabel: string;
  visibleFields: string[];
}

const leadsDatabase: Record<string, ServerLead> = {
  "default-lead": {
    id: "default-lead",
    context: {
      useCase: "",
      companyType: "",
      teamSize: "",
      urgency: "",
      integrations: "",
      budget: "",
    },
    messages: []
  }
};

const shareTokensDatabase: Record<string, ServerShareToken> = {};

// Keywords response pool (as described in README)
const keywordResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ["healthcare", "clinic", "hospital", "doctor", "medical", "patient", "hipaa"],
    response: "Interesting! Healthcare workflows are complex and often require strict HIPAA compliance, data residency audits, and EHR integrations like Epic or Cerner. How large is your team, and is this an urgent requirement?"
  },
  {
    keywords: ["urgent", "timeline", "asap", "weeks", "month", "rush"],
    response: "Got it — a tight timeline! Moving quickly is key. Do you have an approved budget bracket for this rollout (e.g., $10K-$50K or $50K-$100K) to help us allocate resources?"
  },
  {
    keywords: ["epic", "ehr", "emr", "integration", "fhir", "api"],
    response: "Integrating with EHR systems like Epic is highly requested. It requires careful API permission scopes and secure tokens to avoid clinical data leakage. Are there other platforms your systems must hook into?"
  },
  {
    keywords: ["budget", "cost", "pricing", "$50k", "$10k", "$100k"],
    response: "Thanks for clarifying the budget parameters. That helps us scope the solutions engineering path. Are there any specific security or data residency requirements we should prepare for?"
  },
  {
    keywords: ["team", "people", "users", "seats", "staff"],
    response: "Excellent. Understanding the team scale helps us plan user roles and permission layers. Is this main use case focused on customer support, or internal compliance automation?"
  },
];

const fallbackResponses = [
  "That sounds like a compelling project! To help our specialist team prepare a custom architecture blueprint, could you tell me a little about your core technical integrations or budget considerations?",
  "I've noted that context. To make sure we route you to the absolute best Solutions Engineer, could you tell me who will be using this solution and how soon you need to go live?",
  "Got it. Our AI COO agent is compiling these requirements into a secure account brief. What integrations or database systems are critical for your team?"
];

// POST /api/aicoo/chat
app.post("/api/aicoo/chat", async (req, res) => {
  try {
    const { message, history = [], leadId = "default-lead" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Save message to lead history in server database
    if (!leadsDatabase[leadId]) {
      leadsDatabase[leadId] = {
        id: leadId,
        context: { useCase: "", companyType: "", teamSize: "", urgency: "", integrations: "", budget: "" },
        messages: []
      };
    }
    leadsDatabase[leadId].messages.push({ sender: 'user', text: message, timestamp: new Date().toISOString() });

    let botResponseText = "";

    if (ai) {
      // Use Gemini to generate smart conversational qualification
      try {
        const chatHistoryPrompt = history.map((h: any) => `${h.sender === 'user' ? 'Prospect' : 'AI COO'}: ${h.text}`).join("\n");
        const prompt = `
You are 'AI COO Agent', an advanced inbound sales coordinator for DealBridge AI. 
DealBridge AI helps qualify prospects and route them to specialists securely.
Your objective is to have a warm, professional, and consultative conversation.
Help extract these six key fields: useCase, companyType, teamSize, urgency, integrations, budget.

Current Prospect Message: "${message}"

Previous Conversation History:
${chatHistoryPrompt}

Instructions:
1. Respond to the prospect's message in a highly professional, polite, and encouraging tone.
2. Answer any direct questions they have about DealBridge or integrations, but keep it concise.
3. Gently nudge or follow up on any missing qualification fields (e.g., budget, team size, timeline) without sounding robotic.
4. Keep the response brief (max 3-4 sentences) so it feels like a real chat.
5. Return ONLY the plain text response. No JSON, no markdown headings, just normal text paragraphs.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        botResponseText = response.text || "";
      } catch (geminiError) {
        console.error("Gemini query failed, falling back to keywords:", geminiError);
      }
    }

    // Fallback if Gemini not available or failed
    if (!botResponseText) {
      const lowerMsg = message.toLowerCase();
      const matched = keywordResponses.find(kr => kr.keywords.some(k => lowerMsg.includes(k)));
      if (matched) {
        botResponseText = matched.response;
      } else {
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        botResponseText = fallbackResponses[randomIndex];
      }
    }

    // Save bot response to history
    leadsDatabase[leadId].messages.push({ sender: 'agent', text: botResponseText, timestamp: new Date().toISOString() });

    res.json({
      reply: botResponseText,
      leadId
    });
  } catch (error: any) {
    console.error("Error in /api/aicoo/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// POST /api/aicoo/accumulate (Save context)
app.post("/api/aicoo/accumulate", (req, res) => {
  try {
    const { leadId = "default-lead", data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Lead context data is required" });
    }

    if (!leadsDatabase[leadId]) {
      leadsDatabase[leadId] = {
        id: leadId,
        context: { useCase: "", companyType: "", teamSize: "", urgency: "", integrations: "", budget: "" },
        messages: []
      };
    }

    // Merge context fields
    leadsDatabase[leadId].context = {
      ...leadsDatabase[leadId].context,
      ...data
    };

    res.json({
      success: true,
      leadId,
      storedContext: leadsDatabase[leadId].context
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to accumulate context" });
  }
});

// POST /api/aicoo/share/create (Generate scoped access token)
app.post("/api/aicoo/share/create", (req, res) => {
  try {
    const { leadId = "default-lead", role, roleLabel, visibleFields } = req.body;
    if (!role || !visibleFields) {
      return res.status(400).json({ error: "Role and visibleFields are required" });
    }

    const tokenId = `token_${Math.random().toString(36).substring(2, 11)}`;
    shareTokensDatabase[tokenId] = {
      id: tokenId,
      leadId,
      role,
      roleLabel,
      visibleFields
    };

    res.json({
      success: true,
      tokenId,
      role,
      roleLabel,
      visibleFields
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create share link" });
  }
});

// GET /api/share/:tokenId (Resolve scoped share link with exact leakage prevention)
app.get("/api/share/:tokenId", (req, res) => {
  try {
    const { tokenId } = req.params;
    const token = shareTokensDatabase[tokenId];
    if (!token) {
      return res.status(404).json({ error: "Invalid, expired, or unauthorized share token" });
    }

    const lead = leadsDatabase[token.leadId];
    if (!lead) {
      return res.status(404).json({ error: "Lead context not found" });
    }

    // LEAKAGE PREVENTION: Filter out any non-authorized fields
    const allFields = ["useCase", "companyType", "teamSize", "urgency", "integrations", "budget"];
    const filteredContext: Record<string, string> = {};

    allFields.forEach(field => {
      if (token.visibleFields.includes(field)) {
        filteredContext[field] = lead.context[field as keyof typeof lead.context] || "Not provided";
      } else {
        filteredContext[field] = "[REDACTED - ACCESS RESTRICTED]";
      }
    });

    res.json({
      success: true,
      role: token.role,
      roleLabel: token.roleLabel,
      visibleFields: token.visibleFields,
      context: filteredContext
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to resolve share token" });
  }
});

// GET /api/leads/:leadId
app.get("/api/leads/:leadId", (req, res) => {
  const lead = leadsDatabase[req.params.leadId];
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }
  res.json(lead);
});

// Serve frontend assets and hook Vite in dev mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
