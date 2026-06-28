import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Activity, Check, Network, UserCheck, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { LeadContext, Specialist } from "../types";

interface RoutingDecisionProps {
  leadContext: LeadContext;
  onPrevStage: () => void;
  onNextStage: (selectedSpecialists: Specialist[]) => void;
}

const ALL_SPECIALISTS: Specialist[] = [
  {
    id: "spec-1",
    name: "Sarah Jenkins",
    role: "solutions-engineer",
    roleLabel: "Senior Solutions Engineer (Healthcare Spec.)",
    avatar: "SJ",
    bio: "Ex-Epic Systems. Integrates electronic health records and custom API routing protocols securely under tight constraints.",
    relevanceScore: 98,
    matchCriteria: ["Epic EHR Integration", "HIPAA Compliant Data Flow", "Voice/Chat Automation Architect"]
  },
  {
    id: "spec-2",
    name: "Marcus Vane",
    role: "compliance-officer",
    roleLabel: "Compliance & Regulatory Specialist",
    avatar: "MV",
    bio: "Data Privacy Officer. Deep knowledge of GDPR, HIPAA audits, and state-specific healthcare data residency mandates.",
    relevanceScore: 94,
    matchCriteria: ["US Data Residency Auditing", "HIPAA Safeguards Verification", "Zero-Trust Keys Policy"]
  },
  {
    id: "spec-3",
    name: "Elena Rostova",
    role: "product-manager",
    roleLabel: "Lead Integration Architect",
    avatar: "ER",
    bio: "Enterprise voice orchestration. Builds enterprise-grade telephony gateways and third-party webhook coordinators.",
    relevanceScore: 82,
    matchCriteria: ["Voice Gateway Webhooks", "API Scope Management"]
  },
  {
    id: "spec-4",
    name: "Dave Chappell",
    role: "account-executive",
    roleLabel: "Enterprise Account Executive",
    avatar: "DC",
    bio: "Senior Commercial Partner. Oversees high-value health network onboarding and structured pilot program scopes.",
    relevanceScore: 76,
    matchCriteria: ["Health Network Commercials", "Approved Budget Alignment"]
  }
];

export default function RoutingDecision({
  leadContext,
  onPrevStage,
  onNextStage,
}: RoutingDecisionProps) {
  const [animationStage, setAnimationStage] = useState<1 | 2 | 3>(1);
  const [scores, setScores] = useState<Record<string, number>>({
    "spec-1": 0,
    "spec-2": 0,
    "spec-3": 0,
    "spec-4": 0,
  });

  // Cycle through the three stages automatically to give a highly professional, immersive feeling
  useEffect(() => {
    // Stage 1 -> Stage 2 after 2.5 seconds
    const timer1 = setTimeout(() => {
      setAnimationStage(2);
    }, 2000);

    // Stage 2 -> Stage 3 after another 3 seconds (letting the score bars fill)
    const timer2 = setTimeout(() => {
      setAnimationStage(3);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Animating the score values filling up in Stage 2 & 3
  useEffect(() => {
    if (animationStage >= 2) {
      const interval = setInterval(() => {
        setScores((prev) => {
          const updated = { ...prev };
          let allFilled = true;
          ALL_SPECIALISTS.forEach((spec) => {
            if (updated[spec.id] < spec.relevanceScore) {
              updated[spec.id] = Math.min(
                spec.relevanceScore,
                updated[spec.id] + Math.floor(Math.random() * 8) + 4
              );
              allFilled = false;
            }
          });
          if (allFilled) {
            clearInterval(interval);
          }
          return updated;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [animationStage]);

  // The top 2 specialists are selected automatically in Stage 3
  const selectedSpecialists = ALL_SPECIALISTS.filter(
    (spec) => spec.id === "spec-1" || spec.id === "spec-2"
  );

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 text-[#e0e6ff] flex flex-col justify-between h-[calc(100vh-140px)] font-sans relative">
      
      {/* Header and Stage Indicators */}
      <div className="border-b border-[#00d4ff]/10 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00d4ff]">STAGE 3 // SMART ROUTING ENGINE</span>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white mt-1">Specialist Match Matrix</h1>
          </div>
          
          {/* Visual Step Tracker */}
          <div className="flex items-center space-x-2 bg-[#1a1f3a]/80 p-1.5 rounded-xl border border-white/5">
            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-widest transition-all duration-300 ${
              animationStage === 1 ? "bg-[#00d4ff] text-[#0a0e27] font-bold" : "text-[#a8aec8]"
            }`}>
              1. SCAN DIRECTORY
            </div>
            <span className="text-[#00d4ff]/40 text-[10px]">→</span>
            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-widest transition-all duration-300 ${
              animationStage === 2 ? "bg-[#00d4ff] text-[#0a0e27] font-bold animate-pulse" : "text-[#a8aec8]"
            }`}>
              2. EVALUATE FIT
            </div>
            <span className="text-[#00d4ff]/40 text-[10px]">→</span>
            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-widest transition-all duration-300 ${
              animationStage === 3 ? "bg-[#00d4ff] text-[#0a0e27] font-bold" : "text-[#a8aec8]"
            }`}>
              3. ENGAGE SQUAD
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin">
        
        {/* Left Side: Candidates list with animation (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-wider text-[#a8aec8]">
              {animationStage === 1 && "SCANNING CANDIDATE REGISTER..."}
              {animationStage === 2 && "EVALUATING FIT SCORE ALGORITHMS..."}
              {animationStage === 3 && "TOP SPECIALISTS ASSIGNED SUCCESSFULLY"}
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${animationStage === 3 ? "bg-emerald-500" : "bg-amber-400 animate-ping"}`} />
              <span className="text-[10px] font-mono uppercase text-[#a8aec8]">
                {animationStage === 3 ? "Ready for Handoff" : "Processing"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {ALL_SPECIALISTS.map((spec) => {
              const isSelected = animationStage === 3 && (spec.id === "spec-1" || spec.id === "spec-2");
              const currentScore = scores[spec.id];

              return (
                <div
                  key={spec.id}
                  className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-[#00d4ff]/15 to-transparent border-[#00d4ff]/40 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
                      : animationStage === 3
                      ? "bg-slate-900/20 border-slate-800/80 opacity-50"
                      : "bg-[#1a1f3a]/40 border-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                      isSelected
                        ? "bg-[#00d4ff]/15 border-2 border-[#00d4ff] text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                        : "bg-slate-800 border border-slate-700 text-[#a8aec8]"
                    }`}>
                      {spec.avatar}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-white text-sm md:text-base">{spec.name}</h4>
                          <p className="text-[10px] text-[#a8aec8] font-sans">{spec.roleLabel}</p>
                        </div>
                        {animationStage >= 2 && (
                          <div className="text-right">
                            <span className={`text-xs font-mono font-bold transition-all duration-300 ${isSelected ? "text-[#00d4ff]" : "text-[#a8aec8]"}`}>
                              {currentScore}% MATCH
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#a8aec8] mt-2 leading-relaxed">{spec.bio}</p>
                    </div>
                  </div>

                  {/* Progress scoring bar */}
                  {animationStage >= 2 && (
                    <div className="mt-3">
                      <div className="w-full h-1 bg-[#0a0e27] rounded-full overflow-hidden border border-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentScore}%` }}
                          className={`h-full rounded-full ${
                            isSelected
                              ? "bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]"
                              : "bg-slate-500"
                          }`}
                        />
                      </div>
                      
                      {/* Match tags */}
                      {isSelected && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[#00d4ff]/10">
                          {spec.matchCriteria.map((tag, i) => (
                            <span key={i} className="text-[9px] font-mono bg-[#00d4ff]/5 border border-[#00d4ff]/20 px-2 py-0.5 rounded-full text-[#00d4ff]">
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected checkmark overlay */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] p-1 rounded-lg">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step descriptions and sequence detail (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Network className="text-[#00d4ff] w-4 h-4" />
            <h2 className="text-lg font-medium tracking-wide">Coordination Intelligence</h2>
          </div>

          <div className="flex-1 p-5 rounded-2xl bg-[#1a1f3a]/60 border border-[#00d4ff]/10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a8aec8] border-b border-slate-800 pb-2 block">
                ALGORITHM DECISION LOG
              </span>

              <div className="space-y-3.5">
                {/* Visual state 1 log */}
                <div className={`p-3 rounded-xl border flex gap-3 transition-all duration-300 ${
                  animationStage >= 1 ? "bg-[#0a0e27]/40 border-[#00d4ff]/20 text-white" : "border-slate-800 opacity-40 text-slate-500"
                }`}>
                  <Activity className={`w-4 h-4 shrink-0 mt-0.5 ${animationStage === 1 ? "text-[#00d4ff] animate-pulse" : "text-emerald-500"}`} />
                  <div>
                    <h5 className="text-xs font-mono font-bold tracking-wide">1. Query Directory</h5>
                    <p className="text-[10px] text-[#a8aec8] mt-1 leading-normal">
                      Scan expert availability tags for HIPAA compliance audit and cloud integrations.
                    </p>
                  </div>
                </div>

                {/* Visual state 2 log */}
                <div className={`p-3 rounded-xl border flex gap-3 transition-all duration-300 ${
                  animationStage >= 2 ? "bg-[#0a0e27]/40 border-[#00d4ff]/20 text-white" : "border-slate-800 opacity-40 text-slate-500"
                }`}>
                  <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${animationStage === 2 ? "text-[#00d4ff] animate-pulse" : animationStage > 2 ? "text-emerald-500" : "text-[#a8aec8]"}`} />
                  <div>
                    <h5 className="text-xs font-mono font-bold tracking-wide">2. Weighted Fit Matrix</h5>
                    <p className="text-[10px] text-[#a8aec8] mt-1 leading-normal">
                      Cross-reference prospect budget of <b>{leadContext.budget || "$50k"}</b> with expert pilot history.
                    </p>
                  </div>
                </div>

                {/* Visual state 3 log */}
                <div className={`p-3 rounded-xl border flex gap-3 transition-all duration-300 ${
                  animationStage >= 3 ? "bg-[#0a0e27]/40 border-[#00d4ff]/20 text-white" : "border-slate-800 opacity-40 text-slate-500"
                }`}>
                  <UserCheck className={`w-4 h-4 shrink-0 mt-0.5 ${animationStage === 3 ? "text-[#00d4ff] animate-bounce" : "text-[#a8aec8]"}`} />
                  <div>
                    <h5 className="text-xs font-mono font-bold tracking-wide">3. Squad Assigned</h5>
                    <p className="text-[10px] text-[#a8aec8] mt-1 leading-normal">
                      Isolate regulatory credentials for Marcus Vane and systems integration for Sarah Jenkins.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning regarding security */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex gap-2.5 mt-4">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-[#a8aec8] leading-normal font-mono">
                NOTICE: DealBridge zero-leakage proxy is preparing scoped access tokens. Share links will redact unauthorized fields for other roles.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#00d4ff]/10 gap-4 mt-auto">
        <button
          onClick={onPrevStage}
          className="w-full sm:w-auto px-5 py-3 bg-[#1a1f3a]/60 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-mono font-bold tracking-wider text-[#a8aec8] uppercase flex items-center justify-center space-x-2 hover:text-white transition-all duration-200 cursor-pointer"
          id="routing-btn-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Account Brief</span>
        </button>

        {animationStage === 3 ? (
          <button
            onClick={() => onNextStage(selectedSpecialists)}
            className="w-full sm:w-auto px-8 py-4 bg-[#00d4ff] text-[#0a0e27] hover:bg-[#00e1ff] rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] flex items-center justify-center space-x-3 cursor-pointer"
            id="routing-btn-continue"
          >
            <span>GENERATE SCOPED SHARE LINKS</span>
            <ArrowRight className="w-4 h-4 text-[#0a0e27]" />
          </button>
        ) : (
          <button
            onClick={() => setAnimationStage(3)}
            className="w-full sm:w-auto px-6 py-4 bg-slate-800/60 border border-slate-700 text-[#a8aec8] hover:text-white rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            id="routing-btn-skip"
          >
            <span>Skip Animation Sequence</span>
          </button>
        )}
      </div>

    </div>
  );
}
