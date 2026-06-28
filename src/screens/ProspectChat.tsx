import { useState, useRef, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Send, Cpu, CheckCircle2, ShieldAlert, ArrowRight, User, Terminal, Play, Sparkles } from "lucide-react";
import { LeadContext, Message } from "../types";
import { extractDataFromMessage } from "../lib/dataExtractor";

interface ProspectChatProps {
  leadContext: LeadContext;
  onUpdateContext: (ctx: Partial<LeadContext>) => void;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onNextStage: () => void;
}

export default function ProspectChat({
  leadContext,
  onUpdateContext,
  messages,
  onAddMessage,
  onNextStage,
}: ProspectChatProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial welcome message from AI COO
  useEffect(() => {
    if (messages.length === 0) {
      onAddMessage({
        id: "welcome-msg",
        sender: "agent",
        text: "Hi! I'm your AI COO. Tell me about your use case and I'll qualify your needs and route you to the right specialist.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }, []);

  // Run automatic demo simulation
  const handleRunDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    
    // Clear previous chat & context to start clean demo
    onUpdateContext({
      useCase: "",
      companyType: "",
      teamSize: "",
      urgency: "",
      integrations: "",
      budget: "",
    });
    
    // Set demo messages
    const demoStartTime = new Date();
    const formatTime = (offsetSec: number) => {
      const d = new Date(demoStartTime.getTime() + offsetSec * 1000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    onAddMessage({
      id: "demo-welcome",
      sender: "agent",
      text: "Hi! I'm your AI COO. Tell me about your use case and I'll qualify your needs and route you to the right specialist.",
      timestamp: formatTime(0),
    });

    // Step 1: User types "We need an AI voice-and-chat workflow for a healthcare clinic"
    await new Promise((r) => setTimeout(r, 1500));
    const msg1: Message = {
      id: "demo-user-1",
      sender: "user",
      text: "We need an AI voice-and-chat workflow for a healthcare clinic",
      timestamp: formatTime(2),
    };
    onAddMessage(msg1);
    
    // Extract & fill context for Step 1
    onUpdateContext({
      useCase: "Healthcare Voice/Chat",
      companyType: "Clinic",
    });

    // Step 2: AI COO replies contextually
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsTyping(false);
    onAddMessage({
      id: "demo-agent-1",
      sender: "agent",
      text: "Healthcare is one of our strongest verticals — we have specialists in clinical voice workflows and HIPAA-compliant deployments. What type of facility are you working with?",
      timestamp: formatTime(4),
    });

    // Step 3: User replies with team size, integrations, urgency, and budget info
    await new Promise((r) => setTimeout(r, 2500));
    const msg2: Message = {
      id: "demo-user-2",
      sender: "user",
      text: "About 15–20 people on the team, with Epic EHR integration on a High — 6 week pilot, budget is around $50K-100K / year",
      timestamp: formatTime(6),
    };
    onAddMessage(msg2);

    // Extract & fill remaining context
    onUpdateContext({
      teamSize: "15–20 people",
      urgency: "High — 6 week pilot",
      integrations: "EHR — Epic",
      budget: "$50K–100K / year",
    });

    // Step 4: AI COO finishes with final qualification nudge
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsTyping(false);
    onAddMessage({
      id: "demo-agent-2",
      sender: "agent",
      text: "Good to know the team size — that helps us scope licensing and onboarding. Are most of those users technical, or primarily business-side?",
      timestamp: formatTime(8),
    });

    setIsDemoRunning(false);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText("");

    // Create & add user message
    const userMsg: Message = {
      id: `msg_${Math.random().toString(36).substring(2, 9)}`,
      sender: "user",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAddMessage(userMsg);

    // Perform real-time data extraction instantly on the frontend
    const extracted = extractDataFromMessage(userMessageText, leadContext);
    if (Object.keys(extracted).length > 0) {
      onUpdateContext(extracted);
      // Add a small system message indicating context extraction
      setTimeout(() => {
        const fields = Object.keys(extracted).join(", ");
        onAddMessage({
          id: `sys_${Math.random().toString(36).substring(2, 9)}`,
          sender: "system",
          text: `[SYSTEM] Scoped context extraction complete. Registered parameters: [${fields}]`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 600);
    }

    // Call server to persist the context and get a response from Gemini / local backup
    setIsTyping(true);
    try {
      // 1. Accumulate context so the server database is in sync
      if (Object.keys(extracted).length > 0) {
        await fetch("/api/aicoo/accumulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: extracted })
        });
      }

      // 2. Fetch conversational reply
      const response = await fetch("/api/aicoo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          history: messages.slice(-8) // Send recent history for context
        })
      });

      if (!response.ok) throw new Error("API Route failure");
      const result = await response.json();

      onAddMessage({
        id: `msg_${Math.random().toString(36).substring(2, 9)}`,
        sender: "agent",
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error("Backend request failed, executing client-side intelligent fallback response:", err);
      // Client-side fail-safe if server or API key acts up
      setTimeout(() => {
        onAddMessage({
          id: `msg_${Math.random().toString(36).substring(2, 9)}`,
          sender: "agent",
          text: "I have recorded those parameters securely in our temporary session. Let's make sure we capture all aspects. Could you elaborate on your budget scale or timeline urgency?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to check how many fields have been extracted
  const totalFields = 6;
  const extractedCount = [
    leadContext.useCase,
    leadContext.companyType,
    leadContext.teamSize,
    leadContext.urgency,
    leadContext.integrations,
    leadContext.budget,
  ].filter(Boolean).length;

  const confidencePercentage = Math.round((extractedCount / totalFields) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] w-full max-w-7xl mx-auto px-4 font-sans text-[#e0e6ff] relative">
      
      {/* LEFT: Qualification Chat Interface */}
      <div className="flex-1 bg-[#1a1f3a]/40 border border-[#00d4ff]/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
        
        {/* Chat Header */}
        <div className="p-4 bg-[#1a1f3a]/70 border-b border-[#00d4ff]/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff]">
              <Cpu className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider text-white uppercase">AI COO</h2>
              <p className="text-[10px] text-[#a8aec8]">Qualifying your use case in real time</p>
            </div>
          </div>
          
          {/* Interactive Run Demo and Live badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunDemo}
              disabled={isDemoRunning}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider font-bold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer ${
                isDemoRunning
                  ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-[#00d4ff]/15 border-[#00d4ff]/35 text-[#00d4ff] hover:bg-[#00d4ff]/25"
              }`}
              id="btn-run-demo"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>RUN DEMO</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-[#00d4ff]/5 border border-[#00d4ff]/20 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-400">Live</span>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const isSystem = msg.sender === "system";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
              >
                {/* Sender Name tag */}
                <span className="text-[10px] font-mono text-[#a8aec8] px-1">
                  {isUser ? "You" : isSystem ? "System" : "AI COO"}
                </span>

                <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start space-x-2 w-full`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#1a1f3a] border border-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] shrink-0 text-xs font-bold">
                      {isSystem ? <Terminal className="w-3.5 h-3.5 text-[#00d4ff]" /> : "C"}
                    </div>
                  )}
                  
                  <div className="max-w-[80%]">
                    <div
                      className={`p-3.5 rounded-xl text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#161b33] border border-[#00d4ff]/20 text-white"
                          : isSystem
                          ? "bg-slate-900/60 text-cyan-400 font-mono border border-cyan-500/20"
                          : "bg-[#1a1f3a]/80 text-[#e0e6ff] border border-slate-700/40"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[8px] text-[#a8aec8] mt-1 block px-1 ${isUser ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] shrink-0 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] font-mono text-[#a8aec8] px-1">AI COO</span>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#1a1f3a] border border-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] text-xs font-bold">
                  C
                </div>
                <div className="bg-[#1a1f3a]/60 p-3 rounded-xl border border-slate-700/60 flex space-x-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0e27]/70 border-t border-[#00d4ff]/10 flex items-center relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your use case..."
            className="w-full bg-[#10142b] border border-[#00d4ff]/20 focus:border-[#00d4ff]/60 focus:ring-1 focus:ring-[#00d4ff]/30 outline-none text-[#e0e6ff] placeholder-[#a8aec8]/40 rounded-xl pl-4 pr-12 py-3.5 text-xs md:text-sm font-sans transition-all duration-200"
            id="chat-input-text"
          />
          <button
            type="submit"
            className="absolute right-7 top-[21px] p-2 hover:bg-[#00d4ff]/20 text-[#00d4ff] rounded-lg transition-all duration-200 cursor-pointer"
            id="chat-btn-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* RIGHT: Real-time Context Extraction Panel */}
      <div className="w-full lg:w-[380px] flex flex-col gap-5">
        
        {/* Scoped Parameters Display - Extracted Context */}
        <div className="flex-1 bg-[#121630] border border-[#00d4ff]/15 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#00d4ff] uppercase">EXTRACTED CONTEXT</h3>
              <p className="text-[10px] text-[#a8aec8] font-mono">Auto-populated as conversation flows</p>
            </div>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              
              {/* Field 1: Use Case */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Use Case</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.useCase ? "border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.useCase ? "text-[#00d4ff]" : "text-slate-600"}`}>
                    {leadContext.useCase || "—"}
                  </span>
                </div>
              </div>

              {/* Field 2: Company Type */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Company Type</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.companyType ? "border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.companyType ? "text-[#00d4ff]" : "text-slate-600"}`}>
                    {leadContext.companyType || "—"}
                  </span>
                </div>
              </div>

              {/* Field 3: Team Size */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Team Size</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.teamSize ? "border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.teamSize ? "text-[#00d4ff]" : "text-slate-600"}`}>
                    {leadContext.teamSize || "—"}
                  </span>
                </div>
              </div>

              {/* Field 4: Urgency */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Urgency</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.urgency ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.urgency ? "text-amber-400" : "text-slate-600"}`}>
                    {leadContext.urgency || "—"}
                  </span>
                </div>
              </div>

              {/* Field 5: Integration Needs */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Integration Needs</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.integrations ? "border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.integrations ? "text-[#00d4ff]" : "text-slate-600"}`}>
                    {leadContext.integrations || "—"}
                  </span>
                </div>
              </div>

              {/* Field 6: Budget */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a8aec8]">Budget</span>
                <div className={`w-full bg-[#0a0e27]/85 rounded-xl border px-3.5 py-3 transition-all duration-300 flex items-center justify-between ${
                  leadContext.budget ? "border-purple-500/30 bg-purple-500/5 shadow-[0_0_10px_rgba(168,85,247,0.05)]" : "border-slate-800"
                }`}>
                  <span className={`text-xs font-medium font-mono ${leadContext.budget ? "text-purple-300" : "text-slate-600"}`}>
                    {leadContext.budget || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#00d4ff]/10">
            {/* Context Confidence Meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#a8aec8] uppercase">Context confidence</span>
                <span className="text-[11px] font-mono font-bold text-[#00d4ff]">
                  {confidencePercentage}%
                </span>
              </div>
              <div className="w-full bg-[#0a0e27] h-1.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercentage}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-[#00d4ff]"
                />
              </div>
            </div>

            {/* CTA action button */}
            <button
              onClick={onNextStage}
              disabled={extractedCount === 0}
              className={`w-full py-4 rounded-xl font-mono text-xs tracking-wider font-bold uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                extractedCount > 0
                  ? "bg-[#00d4ff] text-[#0a0e27] hover:bg-[#00e1ff] shadow-[0_0_20px_rgba(0,212,255,0.25)] cursor-pointer"
                  : "bg-slate-800/40 text-slate-500 border border-slate-700/30 cursor-not-allowed"
              }`}
              id="chat-btn-next"
            >
              <span>Generate Account Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

