import { useState } from "react";
import { motion } from "motion/react";
import { Search, TrendingUp, Users, CheckCircle, Clock, ChevronRight, Activity } from "lucide-react";
import { LeadContext } from "../types";

interface DashboardLead {
  id: string;
  score: number;
  company: string;
  useCase: string;
  industry: string;
  status: "New" | "Qualified" | "Routing" | "Handoff" | "Confirmed";
  time: string;
  context: LeadContext;
}

const INITIAL_DASHBOARD_LEADS: DashboardLead[] = [
  {
    id: "dash-lead-1",
    score: 58,
    company: "Clinic",
    useCase: "Healthcare Voice/Chat",
    industry: "Healthcare",
    status: "Qualified",
    time: "Just now",
    context: {
      useCase: "Healthcare Voice/Chat",
      companyType: "Clinic",
      teamSize: "",
      urgency: "",
      integrations: "",
      budget: ""
    }
  },
  {
    id: "dash-lead-2",
    score: 92,
    company: "Aethel Health Clinic",
    useCase: "AI voice-and-chat for patient intake",
    industry: "Healthcare",
    status: "Confirmed",
    time: "2 hours ago",
    context: {
      useCase: "AI voice-and-chat for patient intake",
      companyType: "Healthcare Clinic",
      teamSize: "20 - 45 Employees",
      urgency: "High — 3 weeks",
      integrations: "EHR: EPIC (v2)",
      budget: "$50K-100K"
    }
  },
  {
    id: "dash-lead-3",
    score: 78,
    company: "NovaPay Fintech",
    useCase: "Automated KYC and onboarding assistant",
    industry: "Finance",
    status: "Routing",
    time: "5 hours ago",
    context: {
      useCase: "Automated KYC and onboarding assistant",
      companyType: "Financial Services",
      teamSize: "50 people",
      urgency: "Medium — 1 month",
      integrations: "Slack / MS Teams",
      budget: "$100K+"
    }
  },
  {
    id: "dash-lead-4",
    score: 61,
    company: "EduReach Academy",
    useCase: "AI tutor chatbot for K-12 students",
    industry: "EdTech",
    status: "Qualified",
    time: "1 day ago",
    context: {
      useCase: "AI tutor chatbot for K-12 students",
      companyType: "SaaS Platform",
      teamSize: "Under 10 people",
      urgency: "Low — 3 months",
      integrations: "Stripe Payments",
      budget: "Under $10K"
    }
  },
  {
    id: "dash-lead-5",
    score: 85,
    company: "SwiftLogistics",
    useCase: "Inbound dispatcher routing automation",
    industry: "Logistics",
    status: "Handoff",
    time: "2 days ago",
    context: {
      useCase: "Inbound dispatcher routing automation",
      companyType: "Enterprise",
      teamSize: "100+ seats",
      urgency: "High — weeks",
      integrations: "Salesforce CRM",
      budget: "$100K+"
    }
  },
  {
    id: "dash-lead-6",
    score: 72,
    company: "Apex Legal",
    useCase: "Secure compliance document extractor",
    industry: "Legal",
    status: "Confirmed",
    time: "3 days ago",
    context: {
      useCase: "Secure compliance document extractor",
      companyType: "Enterprise",
      teamSize: "50 people",
      urgency: "Medium — 1 month",
      integrations: "Zendesk API",
      budget: "$50K-100K"
    }
  },
  {
    id: "dash-lead-7",
    score: 45,
    company: "GreenStore E-Commerce",
    useCase: "Product recommendation bot",
    industry: "Retail",
    status: "New",
    time: "4 days ago",
    context: {
      useCase: "Product recommendation bot",
      companyType: "Tech Startup",
      teamSize: "Under 10 people",
      urgency: "Flexible",
      integrations: "Stripe Payments",
      budget: "Under $10K"
    }
  }
];

interface DashboardProps {
  onSelectLead: (context: LeadContext) => void;
  onStartNewLead: () => void;
}

export default function Dashboard({ onSelectLead, onStartNewLead }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | "New" | "Qualified" | "Routing" | "Handoff" | "Confirmed">("All");

  const filteredLeads = INITIAL_DASHBOARD_LEADS.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === "All" || lead.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "Qualified":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "Routing":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
      case "Handoff":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "Confirmed":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-400";
    }
  };

  const getCircleColor = (score: number) => {
    if (score >= 80) return "border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10";
    if (score >= 60) return "border-amber-400 text-amber-400 bg-amber-400/10";
    return "border-red-400 text-red-400 bg-red-400/10";
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-6 text-[#e0e6ff] flex flex-col justify-between h-[calc(100vh-140px)] font-sans relative overflow-y-auto scrollbar-none">
      
      <div className="space-y-6">
        {/* Top Header info */}
        <div>
          <div className="flex items-center space-x-2 bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-3 py-1 rounded-full w-max text-[10px] font-mono tracking-wider text-[#00d4ff] mb-2 font-bold uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span>Live Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-white leading-tight">Lead Dashboard</h1>
          <p className="text-sm text-[#a8aec8] mt-1">
            All inbound leads • AI-qualified • Click any row to view full brief and audit
          </p>
        </div>

        {/* Metrics Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1f3a]/40 border border-[#00d4ff]/10 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8aec8] block mb-1">TOTAL LEADS</span>
            <div className="text-3xl font-bold text-white font-mono">7</div>
            <span className="text-[10px] text-slate-500 font-mono">all time</span>
          </div>

          <div className="bg-[#1a1f3a]/40 border border-[#00d4ff]/10 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8aec8] block mb-1">CONFIRMED</span>
            <div className="text-3xl font-bold text-emerald-400 font-mono">2</div>
            <span className="text-[10px] text-slate-500 font-mono">routed to specialist</span>
          </div>

          <div className="bg-[#1a1f3a]/40 border border-[#00d4ff]/10 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8aec8] block mb-1">AVG. SCORE</span>
            <div className="text-3xl font-bold text-[#00d4ff] font-mono">74%</div>
            <span className="text-[10px] text-slate-500 font-mono">AI qualification score</span>
          </div>

          <div className="bg-[#1a1f3a]/40 border border-[#00d4ff]/10 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8aec8] block mb-1">IN PIPELINE</span>
            <div className="text-3xl font-bold text-white font-mono">5</div>
            <span className="text-[10px] text-slate-500 font-mono">active leads</span>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-[14px] w-4 h-4 text-[#a8aec8]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, industry, use case..."
              className="w-full bg-[#10142b] border border-[#00d4ff]/20 focus:border-[#00d4ff]/50 outline-none rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#e0e6ff] placeholder-slate-500 font-mono"
            />
          </div>

          {/* New Lead Creator button */}
          <button
            onClick={onStartNewLead}
            className="bg-[#00d4ff] hover:bg-[#00e1ff] text-[#0a0e27] font-mono font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(0,212,255,0.25)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] cursor-pointer self-start md:self-auto shrink-0"
          >
            + Start Qualification
          </button>
        </div>

        {/* Pill filter layout */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(["All", "New", "Qualified", "Routing", "Handoff", "Confirmed"] as const).map((filter) => {
            const count = filter === "All" 
              ? INITIAL_DASHBOARD_LEADS.length 
              : INITIAL_DASHBOARD_LEADS.filter(l => l.status === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-[#00d4ff]/20 border-[#00d4ff]/60 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.1)]"
                    : "bg-slate-900/40 border-slate-800 text-[#a8aec8] hover:bg-slate-800/40"
                }`}
              >
                {filter} <span className="opacity-60 font-normal ml-1">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Lead List Rows */}
        <div className="space-y-3 pb-8">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.context)}
              className="group p-4 bg-[#1a1f3a]/40 border border-slate-800 hover:border-[#00d4ff]/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                {/* Score Indicator Badge */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-all duration-300 ${getCircleColor(lead.score)}`}>
                  {lead.score}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-white text-sm md:text-base group-hover:text-[#00d4ff] transition-colors">
                      {lead.company}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#a8aec8] mt-1">
                    {lead.industry} • {lead.useCase}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[#a8aec8]">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 justify-end">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {lead.time}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 text-[#a8aec8]/50 group-hover:text-[#00d4ff] transition-all" />
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-mono text-sm border border-dashed border-slate-800 rounded-2xl">
              No matching pipeline leads found.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
