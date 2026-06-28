import { LeadContext } from "../types";

/**
 * Real-time data extraction based on prospect input keywords.
 * This simulates advanced natural language entity extraction.
 */
export function extractDataFromMessage(message: string, currentContext: LeadContext): Partial<LeadContext> {
  const text = message.toLowerCase();
  const extracted: Partial<LeadContext> = {};

  // 1. Use Case Extraction
  if (text.includes("healthcare") || text.includes("medical") || text.includes("patient") || text.includes("clinic")) {
    extracted.useCase = "Healthcare Voice/Chat Workflow";
  } else if (text.includes("support") || text.includes("customer") || text.includes("ticket") || text.includes("helpdesk")) {
    extracted.useCase = "Customer Support Automation";
  } else if (text.includes("voice") || text.includes("call") || text.includes("phone") || text.includes("telephony")) {
    extracted.useCase = "AI Telephony Voice Assistant";
  } else if (text.includes("compliance") || text.includes("audit") || text.includes("regulatory") || text.includes("security")) {
    extracted.useCase = "Compliance Audit Automation";
  } else if (text.includes("sales") || text.includes("inbound") || text.includes("leads") || text.includes("funnel")) {
    extracted.useCase = "Lead Qualification & Routing";
  }

  // 2. Company Type
  if (text.includes("clinic") || text.includes("hospital") || text.includes("healthcare organization")) {
    extracted.companyType = "Healthcare Clinic";
  } else if (text.includes("saas") || text.includes("software") || text.includes("tech")) {
    extracted.companyType = "SaaS Platform";
  } else if (text.includes("enterprise") || text.includes("corporate")) {
    extracted.companyType = "Enterprise";
  } else if (text.includes("startup") || text.includes("small business")) {
    extracted.companyType = "Tech Startup";
  } else if (text.includes("finance") || text.includes("bank") || text.includes("fintech")) {
    extracted.companyType = "Financial Services";
  }

  // 3. Team Size
  const teamMatches = text.match(/(\d+)\s*(people|users|members|seats|staff|employees)/i);
  if (teamMatches) {
    extracted.teamSize = `${teamMatches[1]} people`;
  } else if (text.includes("small team") || text.includes("under 10")) {
    extracted.teamSize = "Under 10 people";
  } else if (text.includes("mid size") || text.includes("around 50") || text.includes("50 people")) {
    extracted.teamSize = "50 people";
  } else if (text.includes("large") || text.includes("100+") || text.includes("hundreds")) {
    extracted.teamSize = "100+ seats";
  } else if (text.includes("20 people") || text.includes("20 users") || text.includes("20 seats")) {
    extracted.teamSize = "20 people";
  }

  // 4. Urgency
  if (text.includes("urgent") || text.includes("asap") || text.includes("immediately") || text.includes("critical") || text.includes("weeks")) {
    extracted.urgency = "High — weeks";
  } else if (text.includes("month") || text.includes("next month") || text.includes("soon")) {
    extracted.urgency = "Medium — 1 month";
  } else if (text.includes("quarter") || text.includes("flexible") || text.includes("later")) {
    extracted.urgency = "Low — 3 months";
  }

  // 5. Integrations
  if (text.includes("epic") || text.includes("ehr") || text.includes("emr") || text.includes("cerner")) {
    extracted.integrations = "EHR (Epic)";
  } else if (text.includes("salesforce") || text.includes("crm") || text.includes("hubspot")) {
    extracted.integrations = "Salesforce CRM";
  } else if (text.includes("slack") || text.includes("teams") || text.includes("discord")) {
    extracted.integrations = "Slack / MS Teams";
  } else if (text.includes("stripe") || text.includes("billing") || text.includes("payment")) {
    extracted.integrations = "Stripe Payments";
  } else if (text.includes("zendesk") || text.includes("intercom")) {
    extracted.integrations = "Zendesk API";
  }

  // 6. Budget
  const budgetMatches = text.match(/\$?(\d+k)/gi);
  if (budgetMatches) {
    extracted.budget = budgetMatches[0].toUpperCase();
    if (text.includes("100k")) {
      extracted.budget = "$100K+";
    } else if (text.includes("50k")) {
      extracted.budget = "$50K-100K";
    }
  } else if (text.includes("$50k") || text.includes("50,000") || text.includes("50k")) {
    extracted.budget = "$50K-100K";
  } else if (text.includes("$10k") || text.includes("10,000") || text.includes("10k")) {
    extracted.budget = "$10K-50K";
  } else if (text.includes("low budget") || text.includes("trial") || text.includes("free")) {
    extracted.budget = "Under $10K";
  } else if (text.includes("enterprise budget") || text.includes("flexible budget") || text.includes("large budget")) {
    extracted.budget = "$100K+";
  }

  // Only return fields that have actually changed or are new
  const result: Partial<LeadContext> = {};
  for (const key in extracted) {
    const k = key as keyof LeadContext;
    if (extracted[k] && extracted[k] !== currentContext[k]) {
      result[k] = extracted[k];
    }
  }

  return result;
}
