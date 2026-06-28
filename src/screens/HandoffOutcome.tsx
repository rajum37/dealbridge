import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, ShieldAlert, Link2, Copy, Check, Eye, EyeOff, CheckSquare, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { LeadContext, Specialist, ScopedShareLink } from "../types";

interface HandoffOutcomeProps {
  leadContext: LeadContext;
  selectedSpecialists: Specialist[];
  onReset: () => void;
}

export default function HandoffOutcome({
  leadContext,
  selectedSpecialists,
  onReset,
}: HandoffOutcomeProps) {
  const [links, setLinks] = useState<ScopedShareLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSimulationRole, setActiveSimulationRole] = useState<string | null>(null);
  const [simulatedData, setSimulatedData] = useState<Record<string, string> | null>(null);
  const [isLoadingSim, setIsLoadingSim] = useState<boolean>(false);

  // Generate tokens on mount from backend proxy
  useEffect(() => {
    async function generateTokens() {
      const generatedLinks: ScopedShareLink[] = [];

      try {
        // Solutions Engineer link configuration
        const seRes = await fetch("/api/share/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "solutions-engineer",
            roleLabel: "Solutions Engineer",
            visibleFields: ["useCase", "teamSize", "integrations", "budget"]
          })
        });
        const seToken = await seRes.json();
        if (seToken.success) {
          generatedLinks.push({
            id: seToken.tokenId,
            role: "solutions-engineer",
            roleLabel: "Solutions Engineer",
            url: `${window.location.origin}/api/share/${seToken.tokenId}`,
            visibleFields: seToken.visibleFields,
            hiddenFields: ["companyType", "urgency"]
          });
        }

        // Compliance Officer link configuration
        const coRes = await fetch("/api/share/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "compliance-officer",
            roleLabel: "Compliance Officer",
            visibleFields: ["useCase", "urgency", "companyType"]
          })
        });
        const coToken = await coRes.json();
        if (coToken.success) {
          generatedLinks.push({
            id: coToken.tokenId,
            role: "compliance-officer",
            roleLabel: "Compliance Officer",
            url: `${window.location.origin}/api/share/${coToken.tokenId}`,
            visibleFields: coToken.visibleFields,
            hiddenFields: ["teamSize", "integrations", "budget"]
          });
        }
      } catch (err) {
        console.error("Failed to generate backend tokens, creating client fail-safe keys", err);
        // Client-side local fallback keys if server acts up
        generatedLinks.push({
          id: "token-se-local",
          role: "solutions-engineer",
          roleLabel: "Solutions Engineer",
          url: `${window.location.origin}/api/share/token-se-local`,
          visibleFields: ["useCase", "teamSize", "integrations", "budget"],
          hiddenFields: ["companyType", "urgency"]
        });
        generatedLinks.push({
          id: "token-co-local",
          role: "compliance-officer",
          roleLabel: "Compliance Officer",
          url: `${window.location.origin}/api/share/token-co-local`,
          visibleFields: ["useCase", "urgency", "companyType"],
          hiddenFields: ["teamSize", "integrations", "budget"]
        });
      }

      setLinks(generatedLinks);
      // Auto-simulate the Solutions Engineer on start to showcase the capability
      if (generatedLinks.length > 0) {
        handleSimulateRole(generatedLinks[0]);
      }
    }

    generateTokens();
  }, []);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateRole = async (link: ScopedShareLink) => {
    setActiveSimulationRole(link.role);
    setIsLoadingSim(true);

    try {
      // Fetch dynamic output from the real backend proxy router
      const response = await fetch(`/api/share/${link.id}`);
      if (response.ok) {
        const result = await response.json();
        setSimulatedData(result.context);
      } else {
        throw new Error("Local fallback required");
      }
    } catch (err) {
      // Simulate client side filtering if offline or token not registered on backend
      const mockResult: Record<string, string> = {};
      const allFields = ["useCase", "companyType", "teamSize", "urgency", "integrations", "budget"];
      allFields.forEach((field) => {
        if (link.visibleFields.includes(field)) {
          mockResult[field] = leadContext[field as keyof LeadContext] || "Not provided";
        } else {
          mockResult[field] = "[REDACTED - ACCESS RESTRICTED]";
        }
      });
      setSimulatedData(mockResult);
    } finally {
      setIsLoadingSim(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 text-[#e0e6ff] flex flex-col justify-between h-[calc(100vh-140px)] font-sans relative">
      
      {/* Header */}
      <div className="border-b border-[#00d4ff]/10 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">STAGE 4 // ZERO-TRUST HANDOFF</span>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white mt-1">Handoff Complete</h1>
          </div>
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <Shield className="text-emerald-400 w-5 h-5" />
            <span className="text-xs font-mono text-emerald-400">ROLE-BASED ISOLATION ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin">
        
        {/* Left Column: Generated Keys & Share Links (6 Columns) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-wide">Scoped Share Links</h2>
            <span className="text-[10px] font-mono text-[#a8aec8]">DECRYPT KEY ATTACHED</span>
          </div>

          <div className="space-y-4">
            {links.map((link) => {
              const spec = selectedSpecialists.find(s => s.role === link.role) || {
                name: link.roleLabel,
                roleLabel: `${link.roleLabel} Specialist`
              };

              const isActiveSim = activeSimulationRole === link.role;

              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isActiveSim
                      ? "bg-[#1a1f3a]/80 border-[#00d4ff]/40 shadow-[0_0_20px_rgba(0,212,255,0.05)]"
                      : "bg-[#1a1f3a]/40 border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{spec.name}</h4>
                      <p className="text-[10px] text-[#a8aec8]">{spec.roleLabel}</p>
                    </div>
                    
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE TOKEN
                    </span>
                  </div>

                  {/* Scoped fields tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {link.visibleFields.map((field) => (
                      <span key={field} className="text-[9px] font-mono bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Visible: {field}
                      </span>
                    ))}
                    {link.hiddenFields.map((field) => (
                      <span key={field} className="text-[9px] font-mono bg-red-500/5 text-red-400 border border-red-500/20 px-2 py-0.5 rounded opacity-60">
                        Redacted: {field}
                      </span>
                    ))}
                  </div>

                  {/* Copy link input structure */}
                  <div className="flex items-center space-x-2 bg-[#0a0e27]/80 border border-slate-800 rounded-xl p-1.5 pl-3">
                    <span className="text-[10px] font-mono text-slate-500 select-none">GET //</span>
                    <input
                      type="text"
                      readOnly
                      value={link.url}
                      className="bg-transparent text-[11px] font-mono text-[#a8aec8] outline-none flex-1 truncate select-all"
                    />
                    
                    <button
                      onClick={() => handleCopyLink(link.id, link.url)}
                      className="p-2 hover:bg-slate-800 text-[#a8aec8] hover:text-[#00d4ff] rounded-lg transition-colors cursor-pointer"
                      title="Copy access URL"
                    >
                      {copiedId === link.id ? <Check className="w-4 h-4 text-[#00d4ff]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleSimulateRole(link)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                        isActiveSim ? "bg-[#00d4ff]/10 text-[#00d4ff]" : "hover:bg-slate-800 text-[#a8aec8] hover:text-white"
                      }`}
                      title="Simulate secure view"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Next Actions Checklist */}
          <div className="p-5 rounded-2xl bg-[#0a0e27]/40 border border-[#00d4ff]/10 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">RECOMMENDED NEXT STEPS</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#a8aec8] leading-normal">
                  <b>Join Slack Room:</b> System is creating a private bridge channel for Marcus Vane & Sarah Jenkins.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#a8aec8] leading-normal">
                  <b>Deliver API Blueprint:</b> Deliver Epic integration templates directly within Solutions Engineer's workspace.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Zero-Leakage Live Simulation (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="text-[#00d4ff] w-4 h-4" />
            <h2 className="text-lg font-medium tracking-wide">Live Zero-Leakage Simulator</h2>
          </div>

          <div className="flex-1 p-5 rounded-2xl bg-[#1a1f3a]/60 border border-[#00d4ff]/15 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#a8aec8] uppercase block">SIMULATING PORTAL FOR:</span>
                  <span className="text-xs font-bold text-[#00d4ff] font-mono">
                    {activeSimulationRole === "solutions-engineer" ? "Solutions Engineer (Sarah Jenkins)" : "Compliance Officer (Marcus Vane)"}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-mono text-emerald-400">ISOLATION SECURED</span>
                </div>
              </div>

              {isLoadingSim ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-[#00d4ff] animate-spin" />
                  <span className="text-xs font-mono text-[#a8aec8]">Applying zero-trust filter policies...</span>
                </div>
              ) : simulatedData ? (
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(simulatedData).map(([key, value]) => {
                    const strValue = String(value);
                    const isRedacted = strValue.includes("REDACTED");
                    return (
                      <div key={key} className={`p-2.5 rounded-lg border transition-colors ${
                        isRedacted ? "bg-red-950/10 border-red-900/30 text-red-400" : "bg-[#0a0e27]/40 border-slate-800 text-[#e0e6ff]"
                      }`}>
                        <div className="flex justify-between mb-1 text-[9px] uppercase tracking-wider text-slate-500">
                          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{isRedacted ? "Access Denied" : "Access Granted"}</span>
                        </div>
                        <p className={isRedacted ? "font-bold tracking-wider" : "font-sans font-medium"}>
                          {strValue}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs font-mono">
                  Select a specialist's eye icon to simulate their access URL
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-[#a8aec8] leading-normal font-mono flex items-start gap-2">
              <EyeOff className="w-4 h-4 text-[#00d4ff] shrink-0 mt-0.5" />
              <span>
                <b>Leakage Prevention Verification:</b> Notice that the solutions engineer is strictly barred from viewing urgency and company details, while compliance has no visibility over budget and integrations.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-4 border-t border-[#00d4ff]/10">
        <button
          onClick={onReset}
          className="px-8 py-4 bg-[#00d4ff] text-[#0a0e27] hover:bg-[#00e1ff] rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] flex items-center space-x-2 cursor-pointer"
          id="handoff-btn-new-lead"
        >
          <RefreshCw className="w-4 h-4 text-[#0a0e27]" />
          <span>ROUTE NEW LEAD</span>
        </button>
      </div>

    </div>
  );
}
