import { useState } from "react";
import Landing from "./screens/Landing";
import Dashboard from "./screens/Dashboard";
import ProspectChat from "./screens/ProspectChat";
import AccountBrief from "./screens/AccountBrief";
import RoutingDecision from "./screens/RoutingDecision";
import HandoffOutcome from "./screens/HandoffOutcome";
import { LeadContext, Message, Specialist } from "./types";
import { Sparkles, Terminal, ShieldAlert, Cpu, Zap, LogOut, ArrowLeft, LayoutDashboard } from "lucide-react";

const INITIAL_CONTEXT: LeadContext = {
  useCase: "",
  companyType: "",
  teamSize: "",
  urgency: "",
  integrations: "",
  budget: "",
};

export default function App() {
  const [isInWorkspace, setIsInWorkspace] = useState(false);
  const [activeStage, setActiveStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [leadContext, setLeadContext] = useState<LeadContext>(INITIAL_CONTEXT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState<Specialist[]>([]);

  // Reset the lead qualification process
  const handleReset = () => {
    setLeadContext(INITIAL_CONTEXT);
    setMessages([]);
    setSelectedSpecialists([]);
    setActiveStage(0);
    setIsInWorkspace(false);
  };

  const handleUpdateContext = (updatedFields: Partial<LeadContext>) => {
    setLeadContext((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const handleAddMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSelectLead = (context: LeadContext) => {
    setLeadContext(context);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: "m1",
        sender: "agent",
        text: "Hi! I'm your AI COO. Tell me about your use case and I'll qualify your needs and route you to the right specialist.",
        timestamp
      },
      {
        id: "m2",
        sender: "user",
        text: `We are looking to implement: ${context.useCase || "our workflow automation"}. We are a ${context.companyType || "business"}.`,
        timestamp
      },
      {
        id: "m3",
        sender: "agent",
        text: "Understood. Let me look at your specific needs. What are your target integrations, team size, timeline urgency, and budget?",
        timestamp
      },
      {
        id: "m4",
        sender: "user",
        text: `Our team size is ${context.teamSize || "not specified yet"}, integration requirements are ${context.integrations || "none"}, budget is ${context.budget || "not specified yet"}, with urgency level ${context.urgency || "not specified"}.`,
        timestamp
      },
      {
        id: "m5",
        sender: "agent",
        text: "Perfect! I have parsed your key requirements and compiled your secure Account Brief. Let's head over to the briefing step.",
        timestamp
      }
    ]);
    setActiveStage(2); // Go to Account Briefing
  };

  const handleStartNewLead = () => {
    setLeadContext(INITIAL_CONTEXT);
    setMessages([
      {
        id: "welcome-msg",
        sender: "agent",
        text: "Hi! I'm your AI COO. Tell me about your use case and I'll qualify your needs and route you to the right specialist.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setSelectedSpecialists([]);
    setActiveStage(1); // Go to Prospect Qualification
  };

  if (!isInWorkspace) {
    return (
      <Landing
        onGoToDashboard={() => {
          setIsInWorkspace(true);
          setActiveStage(0);
        }}
        onStartNewLead={() => {
          setIsInWorkspace(true);
          handleStartNewLead();
        }}
        onStartWithLead={(context) => {
          setIsInWorkspace(true);
          handleSelectLead(context);
        }}
      />
    );
  }

  // Active Screen display inside the coordination frame
  const renderStageScreen = () => {
    switch (activeStage) {
      case 0:
        return (
          <Dashboard
            onSelectLead={handleSelectLead}
            onStartNewLead={handleStartNewLead}
          />
        );
      case 1:
        return (
          <ProspectChat
            leadContext={leadContext}
            onUpdateContext={handleUpdateContext}
            messages={messages}
            onAddMessage={handleAddMessage}
            onNextStage={() => setActiveStage(2)}
          />
        );
      case 2:
        return (
          <AccountBrief
            leadContext={leadContext}
            onPrevStage={() => setActiveStage(1)}
            onNextStage={() => setActiveStage(3)}
            onReset={handleReset}
          />
        );
      case 3:
        return (
          <RoutingDecision
            leadContext={leadContext}
            onPrevStage={() => setActiveStage(2)}
            onNextStage={(specialists) => {
              setSelectedSpecialists(specialists);
              setActiveStage(4);
            }}
          />
        );
      case 4:
        return (
          <HandoffOutcome
            leadContext={leadContext}
            selectedSpecialists={selectedSpecialists}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0e27] text-[#e0e6ff] font-sans overflow-hidden">
      
      {/* Sidebar Navigation - Immersive Theme Style */}
      <aside className="w-72 bg-[#1a1f3a]/60 border-r border-[#00d4ff]/20 flex flex-col shrink-0 select-none z-20">
        <div className="p-8 flex flex-col h-full justify-between">
          <div>
            {/* Logo Brand Frame */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">DealBridge</h1>
                <span className="text-[9px] font-mono tracking-widest text-[#00d4ff] uppercase">AI COORDINATOR</span>
              </div>
            </div>

            {/* Stages Navigation links */}
            <nav className="space-y-2.5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#a8aec8] mb-4 font-mono font-bold">
                SYSTEM STAGES
              </div>

              {/* Stage 0 link: Lead Dashboard */}
              <button
                onClick={() => setActiveStage(0)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  activeStage === 0
                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/35 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.05)] font-semibold"
                    : "bg-transparent border-transparent text-[#a8aec8] hover:bg-white/5"
                }`}
                id="sidebar-nav-stage0"
              >
                <div className={`w-2 h-2 rounded-full ${activeStage === 0 ? "bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "bg-white/20"}`} />
                <span className="text-xs font-mono">Lead Dashboard</span>
              </button>

              {/* Stage 1 link */}
              <button
                onClick={() => setActiveStage(1)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  activeStage === 1
                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/35 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.05)] font-semibold"
                    : "bg-transparent border-transparent text-[#a8aec8] hover:bg-white/5"
                }`}
                id="sidebar-nav-stage1"
              >
                <div className={`w-2 h-2 rounded-full ${activeStage === 1 ? "bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "bg-white/20"}`} />
                <span className="text-xs font-mono">Prospect Qualification</span>
              </button>

              {/* Stage 2 link */}
              <button
                onClick={() => leadContext.useCase || leadContext.budget ? setActiveStage(2) : null}
                disabled={!leadContext.useCase && !leadContext.budget}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  activeStage === 2
                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/35 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.05)] font-semibold"
                    : !leadContext.useCase && !leadContext.budget
                    ? "opacity-40 cursor-not-allowed text-[#a8aec8]"
                    : "bg-transparent border-transparent text-[#a8aec8] hover:bg-white/5 cursor-pointer"
                }`}
                id="sidebar-nav-stage2"
              >
                <div className={`w-2 h-2 rounded-full ${activeStage === 2 ? "bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "bg-white/20"}`} />
                <span className="text-xs font-mono">Account Briefing</span>
              </button>

              {/* Stage 3 link */}
              <button
                onClick={() => leadContext.useCase || leadContext.budget ? setActiveStage(3) : null}
                disabled={!leadContext.useCase && !leadContext.budget}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  activeStage === 3
                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/35 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.05)] font-semibold"
                    : !leadContext.useCase && !leadContext.budget
                    ? "opacity-40 cursor-not-allowed text-[#a8aec8]"
                    : "bg-transparent border-transparent text-[#a8aec8] hover:bg-white/5 cursor-pointer"
                }`}
                id="sidebar-nav-stage3"
              >
                <div className={`w-2 h-2 rounded-full ${activeStage === 3 ? "bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "bg-white/20"}`} />
                <span className="text-xs font-mono">Smart Routing</span>
              </button>

              {/* Stage 4 link */}
              <button
                onClick={() => selectedSpecialists.length > 0 ? setActiveStage(4) : null}
                disabled={selectedSpecialists.length === 0}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  activeStage === 4
                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/35 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.05)] font-semibold"
                    : selectedSpecialists.length === 0
                    ? "opacity-40 cursor-not-allowed text-[#a8aec8]"
                    : "bg-transparent border-transparent text-[#a8aec8] hover:bg-white/5 cursor-pointer"
                }`}
                id="sidebar-nav-stage4"
              >
                <div className={`w-2 h-2 rounded-full ${activeStage === 4 ? "bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "bg-white/20"}`} />
                <span className="text-xs font-mono">Scoped Handoff</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Bottom Frame */}
          <div className="space-y-4">
            <button
              onClick={() => setIsInWorkspace(false)}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-[#0a0e27]/50 hover:bg-red-950/20 text-xs font-mono text-[#a8aec8] hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all duration-200 cursor-pointer"
              id="sidebar-btn-exit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EXIT TO PORTAL</span>
            </button>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] border border-white/5 text-center">
              <p className="text-[10px] text-[#a8aec8] mb-1 font-mono">Powered by</p>
              <p className="text-xs font-mono tracking-widest text-[#00d4ff] font-bold">AICOO PULSE v2.4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        
        {/* Ambient Atmosphere Glow Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00d4ff]/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

        {/* Top Header Bar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#a8aec8] font-mono block">ACTIVE INBOUND LEAD PIPELINE</span>
            <h2 className="text-lg font-serif italic text-white mt-0.5">
              {leadContext.companyType 
                ? `${leadContext.companyType} Lead Assessment` 
                : "Aethel Health & Wellness Clinic"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold uppercase tracking-wider">
              {leadContext.urgency && leadContext.urgency.includes("High") ? "High Priority" : "Lead Assessed"}
            </div>
            
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-[#1a1f3a]/80 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
              <ShieldAlert className="w-4 h-4 text-[#00d4ff]" />
            </div>
          </div>
        </header>

        {/* Workspace Content Router View */}
        <div className="flex-1 overflow-hidden relative z-10">
          {renderStageScreen()}
        </div>

        {/* Bottom Progress Rail - Styled following template */}
        <div className="h-1 bg-white/5 w-full flex shrink-0">
          <div
            className="h-full bg-[#00d4ff] shadow-[0_0_10px_#00d4ff] transition-all duration-700"
            style={{ width: `${(activeStage / 4) * 100}%` }}
          />
        </div>

      </main>

    </div>
  );
}
