import { User, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { LeadContext } from "../types";

interface LandingProps {
  onGoToDashboard: () => void;
  onStartNewLead: () => void;
  onStartWithLead: (context: LeadContext) => void;
}

export default function Landing({ onGoToDashboard, onStartNewLead }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#050816] text-[#e0e6ff] flex flex-col relative overflow-x-hidden font-sans select-none justify-between">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d4ff_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[500px] bg-[#00d4ff]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header Frame */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.2)]">
            <span className="text-xs font-mono font-bold text-[#00d4ff]">DB</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">DealBridge AI</span>
        </div>

        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_8px_#00d4ff]" />
          <span className="text-[10px] font-mono text-[#a8aec8] font-medium tracking-wider">Aicoo Pulse <span className="text-[#00d4ff]">Live</span></span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col items-center justify-center text-center relative z-10 space-y-12">
        
        {/* Title & Taglines */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold font-serif italic tracking-tight text-[#00d4ff] leading-none drop-shadow-[0_0_30px_rgba(0,212,255,0.15)]">
            Talk to our AI COO
          </h1>
          <p className="text-base sm:text-lg text-[#00d4ff] tracking-wider font-mono font-medium flex flex-wrap items-center justify-center gap-x-2 gap-y-1 opacity-90 pt-2">
            <span>Lead qualification.</span>
            <span className="text-[#00d4ff]/60">•</span>
            <span>Structured context.</span>
            <span className="text-[#00d4ff]/60">•</span>
            <span>Instant routing.</span>
          </p>
        </div>

        {/* Dynamic Workflow "How it works" Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-11 items-center gap-4 lg:gap-6 pt-4">
          
          {/* Step 1: Prospect */}
          <div className="md:col-span-3 bg-[#11152a]/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 h-64 justify-center relative overflow-hidden group hover:border-[#00d4ff]/25 transition-all duration-300">
            <span className="text-[10px] font-mono text-[#a8aec8] opacity-40 absolute top-4 left-4">01</span>
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a8aec8]/80 group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-base tracking-wide font-mono">Prospect</h3>
              <p className="text-[11px] font-mono text-[#00d4ff]/70 uppercase tracking-widest">Inbound lead</p>
            </div>
            
            <p className="text-[12px] text-[#a8aec8] leading-relaxed px-2">
              You describe your use case in a natural conversation
            </p>
          </div>

          {/* Connection Arrow 1 */}
          <div className="md:col-span-1 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-[#00d4ff]/30 transform rotate-90 md:rotate-0" />
          </div>

          {/* Step 2: AI COO (Highlighted/Active) */}
          <div className="md:col-span-3 bg-[#121935]/80 border-2 border-[#00d4ff] p-6 rounded-2xl flex flex-col items-center text-center space-y-4 h-68 justify-center relative shadow-[0_0_40px_rgba(0,212,255,0.15)] z-10 scale-105">
            <span className="text-[10px] font-mono text-[#00d4ff] font-bold absolute top-4 left-4">02</span>
            
            <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/40 flex items-center justify-center text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.2)]">
              <MapPin className="w-5 h-5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-white text-base tracking-wide font-mono">AI COO</h3>
              <div className="px-3 py-1 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 text-[9px] font-mono font-bold text-[#00d4ff] uppercase tracking-wider">
                Qualify · Brief · Route
              </div>
            </div>
            
            <p className="text-[12px] text-[#a8aec8] leading-relaxed px-2">
              Extracts context, builds your account brief, routes to the right specialist
            </p>
          </div>

          {/* Connection Arrow 2 */}
          <div className="md:col-span-1 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-[#00d4ff]/30 transform rotate-90 md:rotate-0" />
          </div>

          {/* Step 3: Specialist */}
          <div className="md:col-span-3 bg-[#11152a]/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 h-64 justify-center relative overflow-hidden group hover:border-[#00d4ff]/25 transition-all duration-300">
            <span className="text-[10px] font-mono text-[#a8aec8] opacity-40 absolute top-4 left-4">03</span>
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a8aec8]/80 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-base tracking-wide font-mono">Specialist</h3>
              <p className="text-[11px] font-mono text-[#00d4ff]/70 uppercase tracking-widest">Warm handoff</p>
            </div>
            
            <p className="text-[12px] text-[#a8aec8] leading-relaxed px-2">
              Pre-briefed expert receives your context and picks up the conversation
            </p>
          </div>

        </div>

        {/* Call to Actions */}
        <div className="flex flex-col items-center space-y-5 pt-4">
          
          <button
            onClick={onStartNewLead}
            className="px-10 py-4.5 rounded-2xl bg-[#090d23] hover:bg-[#0c1230] text-[#00d4ff] border-2 border-[#00d4ff] font-mono text-sm tracking-wider font-bold uppercase transition-all duration-300 shadow-[0_0_35px_rgba(0,212,255,0.25)] hover:shadow-[0_0_50px_rgba(0,212,255,0.45)] cursor-pointer"
            id="start-lead-conversation-btn"
          >
            Start a Lead Conversation
          </button>

          <button
            onClick={onGoToDashboard}
            className="text-xs font-mono text-[#a8aec8] hover:text-[#00d4ff] transition-colors flex items-center gap-1 cursor-pointer"
            id="view-dashboard-link"
          >
            View Lead Dashboard <span className="font-sans">→</span>
          </button>

        </div>

      </main>

      {/* Bottom Footer Section */}
      <footer className="w-full text-center py-6 text-[11px] font-mono text-slate-500 relative z-10 border-t border-white/5">
        No signup required · Live on Aicoo Pulse
      </footer>

    </div>
  );
}
