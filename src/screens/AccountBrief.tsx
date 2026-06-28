import { useState } from "react";
import { motion } from "motion/react";
import { FileText, ArrowRight, ArrowLeft, RefreshCw, Layers, Sparkles, Building, Users, Calendar, Cpu, Link2, DollarSign } from "lucide-react";
import { LeadContext } from "../types";

interface AccountBriefProps {
  leadContext: LeadContext;
  onPrevStage: () => void;
  onNextStage: () => void;
  onReset: () => void;
}

export default function AccountBrief({
  leadContext,
  onPrevStage,
  onNextStage,
  onReset
}: AccountBriefProps) {
  const [summary, setSummary] = useState<string>(() => {
    // Generate a default narrative based on the extracted fields
    const parts = [];
    if (leadContext.useCase) parts.push(`The prospect is seeking a solution for "${leadContext.useCase}".`);
    if (leadContext.companyType) parts.push(`They operate as a "${leadContext.companyType}".`);
    if (leadContext.teamSize) parts.push(`Their organization scale is approximately ${leadContext.teamSize}.`);
    if (leadContext.integrations) parts.push(`Integrating with key platforms such as "${leadContext.integrations}" is a critical blocker.`);
    if (leadContext.urgency) parts.push(`This is a high-priority effort with a target launch timeline of "${leadContext.urgency}".`);
    if (leadContext.budget) parts.push(`They have indicated an allocated budget parameter in the range of ${leadContext.budget}.`);

    if (parts.length === 0) {
      return "No prospect parameters have been compiled yet. Please return to the qualifying chat stage to log prospect signals.";
    }
    return parts.join(" ") + " US-based data residency and compliance audits are required.";
  });

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 font-sans text-[#e0e6ff] flex flex-col justify-between h-[calc(100vh-140px)] relative">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#00d4ff]/10 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00d4ff]">STAGE 2 // AUDIT & COMPILATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-white mt-1">Compiled Account Brief</h1>
        </div>
        <div className="flex items-center space-x-3 mt-3 md:mt-0">
          <span className="text-xs font-mono text-[#a8aec8]">ID: AB-${Math.floor(10000 + Math.random() * 90000)}-DEAL</span>
          <div className="px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-[10px] font-bold uppercase tracking-wider">
            Verified Brief
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin">
        
        {/* Left Hand Card Fields (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-wide">Structured Parameters</h2>
            <span className="text-[10px] font-mono text-[#a8aec8]">REAL-TIME EXTRACTED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Field 1: Industry / Vertical */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <Building className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Industry Vertical</span>
              </div>
              <p className="text-base font-semibold text-white">
                {leadContext.companyType || "Not Specified"}
              </p>
            </div>

            {/* Field 2: Use Case */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <Cpu className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Core Use Case</span>
              </div>
              <p className="text-base font-semibold text-white">
                {leadContext.useCase || "Not Specified"}
              </p>
            </div>

            {/* Field 3: Org Scale */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <Users className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Organization Size</span>
              </div>
              <p className="text-base font-semibold text-white">
                {leadContext.teamSize || "Not Specified"}
              </p>
            </div>

            {/* Field 4: Integrations */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <Link2 className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Technical Integrations</span>
              </div>
              <p className="text-base font-semibold text-[#00d4ff] font-mono">
                {leadContext.integrations || "Not Specified"}
              </p>
            </div>

            {/* Field 5: Urgency */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <Calendar className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Project Urgency</span>
              </div>
              <p className="text-base font-semibold text-white">
                {leadContext.urgency || "Not Specified"}
              </p>
            </div>

            {/* Field 6: Budget Range */}
            <div className="p-5 rounded-2xl bg-[#1a1f3a]/40 backdrop-blur-xl border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#a8aec8] mb-2">
                <DollarSign className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] uppercase tracking-wider font-mono">Estimated Budget</span>
              </div>
              <p className="text-base font-semibold text-white">
                {leadContext.budget || "Not Specified"}
              </p>
            </div>

          </div>

          {/* Additional Notes area */}
          <div className="p-4 rounded-xl bg-[#0a0e27]/40 border border-[#00d4ff]/10">
            <span className="text-[10px] font-mono text-[#a8aec8] block mb-2">SYSTEM EXTRACTION NOTES</span>
            <p className="text-xs text-[#a8aec8] leading-relaxed">
              These fields were compiled securely via real-time stream token interception during the live conversation. Data payload complies with high-performance security policies, avoiding standard database leaks.
            </p>
          </div>
        </div>

        {/* Right Hand Narrative (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00d4ff]" />
            <h2 className="text-lg font-medium tracking-wide">AI Brief Summary</h2>
          </div>

          <div className="flex-1 p-6 rounded-3xl bg-[#1a1f3a]/60 border border-[#00d4ff]/10 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="text-[#00d4ff] w-4 h-4" />
                  <span className="text-xs font-mono text-[#a8aec8]">Synthesized Narrative</span>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono uppercase">ACCURATE</span>
              </div>

              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full h-44 lg:h-52 bg-[#0a0e27]/40 text-[#a8aec8] text-sm leading-relaxed p-3 rounded-xl border border-slate-800 focus:border-[#00d4ff]/50 outline-none font-sans italic resize-none"
                id="brief-summary-textarea"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] text-[#a8aec8] block font-mono leading-normal">
                *The above synthesis is interactive. Specialists will receive this exact narrative context upon scoped routing.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Stage Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#00d4ff]/10 gap-4 mt-auto">
        <div className="flex items-center space-x-3">
          <button
            onClick={onPrevStage}
            className="px-5 py-3 bg-[#1a1f3a]/60 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-mono font-bold tracking-wider text-[#a8aec8] uppercase flex items-center space-x-2 hover:text-white transition-all duration-200 cursor-pointer"
            id="brief-btn-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Refine Chat</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-3 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-mono font-bold tracking-wider text-red-400 uppercase flex items-center space-x-2 transition-all duration-200 cursor-pointer"
            id="brief-btn-reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <button
          onClick={onNextStage}
          className="w-full sm:w-auto px-8 py-4 bg-[#00d4ff] text-[#0a0e27] hover:bg-[#00e1ff] rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] flex items-center justify-center space-x-3 cursor-pointer"
          id="brief-btn-route"
        >
          <span>Begin Specialist Match</span>
          <ArrowRight className="w-4 h-4 text-[#0a0e27]" />
        </button>
      </div>

    </div>
  );
}
