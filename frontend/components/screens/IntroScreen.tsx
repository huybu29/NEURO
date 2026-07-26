import React, { useState } from 'react';
import { Terminal, Zap, ShieldAlert, User, Users, Unplug, Skull, Swords } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import PvPNetworkDemo from  '@/components/screens/PVPNetworkDemo';
import GameBoard from './GameBoard'; // MAKE SURE THIS PATH MATCHES YOUR GAMEBOARD FILE

// GAME MODES DATA (TRANSLATED & REORDERED)
const GAME_MODES = [
  { 
    id: 'solo', 
    type: 'SOLO SYSTEM', 
    title: 'SOLO SURVIVAL', 
    icon: User, 
    color: '#00f3ff',
    desc: 'Assess psychological vulnerabilities (FOMO, Echo Chambers...). Face Auto-Pilot traps and endless Bosses. Accumulate Reality Anchors to build your Mind Sanctuary.'
  },
  { 
    id: 'pvp', 
    type: 'VERSUS', 
    title: 'ALGORITHM DRAFT', 
    icon: Swords, 
    color: '#a200ff',
    desc: 'Tactical 1v1 PvP. The Algorithm faction drafts cards to create the most toxic Feed. The Users faction deploys skills to survive and maintain reality.'
  },
  { 
    id: 'alliance', 
    type: 'CO-OP SYSTEM', 
    title: 'TEAM ALLIANCE', 
    icon: Users, 
    color: '#00cc66',
    desc: 'Form a survival hub of 4-5 players. Share a Reality Anchor pool. Use "Slap Awake" skills to save teammates from social media intoxication.'
  },
  { 
    id: 'echo', 
    type: 'CO-OP SYSTEM', 
    title: 'ECHO ESCAPE', 
    icon: Unplug, 
    color: '#ffe600',
    desc: 'Co-op Escape (2-4 players). Each receives a different blind "Feed". Communicate to piece together the full picture. Trusting your own Feed = Loss.'
  },
  { 
    id: 'raid', 
    type: 'CO-OP SYSTEM', 
    title: 'WORLD RAID BOSS', 
    icon: Skull, 
    color: '#ff5470',
    desc: 'Defeat the Toxic Superstorm. Requires a standard lineup: Skeptic (Tank/Fact-checker), Floater (Scout/Scroller), and FOMO (DPS/Spam Reporter).'
  }
];

export default function IntroScreen() {
  const startGame = useGameStore((state) => state.startGame);
  
  // Selected Mode State
  const [selectedMode, setSelectedMode] = useState(GAME_MODES[0]);

  // Navigation States
  const [showPvPDemo, setShowPvPDemo] = useState(false);
  const [showSoloGame, setShowSoloGame] = useState(false);

  // Determine if the selected mode is currently playable
  const isPlayable = selectedMode.id === 'solo' || selectedMode.id === 'pvp';

  // ROUTING BLOCK
  if (showPvPDemo) {
    return <PvPNetworkDemo />;
  }

  if (showSoloGame) {
    return <GameBoard />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[calc(100vh-130px)] bg-[#131315] border-2 border-[#2a2a35] overflow-y-auto overflow-x-hidden relative font-['Space_Grotesk'] py-10">
      
      {/* CSS CLIP-PATHS & EFFECTS */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-pcb-lg { clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 15px); }
        .clip-bevel { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        .clip-tab { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .hazard-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px); }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .anim-scanline { animation: scanline 8s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00f3ff; }
      `}} />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50 opacity-30 fixed" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0 fixed" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#00f3ff]/10 to-transparent opacity-50 anim-scanline pointer-events-none z-40 fixed" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 md:px-6 animate-fade-in custom-scrollbar">
        
        {/* SYSTEM HEADER */}
        <div className="mb-4 flex items-center gap-2 text-[#00f3ff] font-mono text-xs md:text-sm tracking-[0.3em] uppercase bg-[#00f3ff]/10 px-4 py-1 border border-[#00f3ff]/30 clip-bevel shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <Terminal size={14} className="animate-pulse" /> System_Boot_Sequence
        </div>
        
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter glitch-text drop-shadow-[0_0_15px_rgba(0,243,255,0.3)] text-center">
          NEUROFEED<span className="text-[#ff007f]">_SURVIVAL</span>
        </h1>
        
        {/* =========================================
            MODE SELECTOR
            ========================================= */}
        <div className="w-full mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#ffe600] animate-pulse" />
            <span className="font-mono text-[#ffe600] text-[10px] tracking-widest uppercase">/// SELECT_EXECUTION_PROTOCOL</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {GAME_MODES.map((mode) => {
              const isSelected = selectedMode.id === mode.id;
              const Icon = mode.icon;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`relative flex flex-col items-center justify-center p-4 h-28 transition-all duration-300 clip-tab overflow-hidden group
                    ${isSelected 
                      ? 'shadow-[0_0_15px_rgba(0,0,0,0.5)] scale-105 z-10' 
                      : 'bg-[#18181e] border-2 border-[#2a2a35] hover:border-gray-500 opacity-60 hover:opacity-100'
                    }`}
                  style={{ 
                    backgroundColor: isSelected ? `${mode.color}15` : undefined,
                    borderColor: isSelected ? mode.color : undefined,
                    borderWidth: isSelected ? '2px' : undefined
                  }}
                >
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />}
                  {isSelected && <div className="absolute top-0 left-0 w-full h-1 hazard-stripes opacity-50 pointer-events-none" style={{ color: mode.color }} />}

                  <Icon 
                    size={28} 
                    style={{ color: isSelected ? mode.color : '#8891A3' }} 
                    className={`mb-2 transition-transform ${isSelected ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'group-hover:scale-110'}`} 
                  />
                  <span className="font-black text-[10px] tracking-wider text-center uppercase" style={{ color: isSelected ? '#fff' : '#8891A3' }}>
                    {mode.title}
                  </span>
                  
                  <div 
                    className="absolute bottom-0 w-full text-[8px] font-mono font-bold py-0.5 text-center bg-black/50"
                    style={{ color: isSelected ? mode.color : '#555' }}
                  >
                    {mode.type}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            MISSION BRIEFING
            ========================================= */}
        <div className="relative w-full bg-[#1a1a24]/95 backdrop-blur-xl border-[3px] p-6 md:p-8 clip-pcb-lg transition-colors duration-300"
             style={{ borderColor: `${selectedMode.color}40`, boxShadow: `0 0 40px ${selectedMode.color}15` }}>
          
          <div className="absolute -top-[3px] -left-[3px] w-6 h-6 border-t-[4px] border-l-[4px] transition-colors" style={{ borderColor: selectedMode.color }} />
          <div className="absolute -top-[3px] -right-[3px] w-6 h-6 border-t-[4px] border-r-[4px] transition-colors" style={{ borderColor: selectedMode.color }} />
          <div className="absolute -bottom-[3px] -left-[3px] w-6 h-6 border-b-[4px] border-l-[4px] transition-colors" style={{ borderColor: selectedMode.color }} />
          <div className="absolute -bottom-[3px] -right-[3px] w-6 h-6 border-b-[4px] border-r-[4px] transition-colors" style={{ borderColor: selectedMode.color }} />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b-2 border-[#2a2a35] pb-4">
            <div className="flex items-center gap-3">
              <div className="text-[#131315] font-black text-[10px] tracking-widest px-3 py-1 flex items-center gap-1 clip-bevel transition-colors" style={{ backgroundColor: selectedMode.color }}>
                <ShieldAlert size={14} /> BRIEFING
              </div>
              <span className="font-mono text-[11px] font-bold tracking-widest uppercase" style={{ color: selectedMode.color }}>
                {selectedMode.title}_PROTOCOL
              </span>
            </div>
          </div>

          <div className="font-mono text-gray-300 text-sm leading-relaxed space-y-4 min-h-[100px]">
            <p>
              <span style={{ color: selectedMode.color }}>{'>'}</span> <span className="text-white font-bold">MECHANICS:</span> {selectedMode.desc}
            </p>
            <p>
              <span style={{ color: selectedMode.color }}>{'>'}</span> <span className="text-white font-bold">OBJECTIVE:</span> Protect the <span className="text-[#00f3ff] font-bold drop-shadow-[0_0_5px_#00f3ff]">REALITY_ANCHOR</span> from DOPAMINE temptations. Avoid Auto-Pilot traps.
            </p>
          </div>
        </div>

        {/* =========================================
            START BUTTON
            ========================================= */}
        <button 
          onClick={() => {
            if (!isPlayable) return;
            if (selectedMode.id === 'pvp') {
              setShowPvPDemo(true);
            } else {
              startGame(); 
              setShowSoloGame(true); 
            }
          }} 
          className={`group relative mt-10 w-full max-w-sm h-16 bg-[#131315] border-[3px] font-black tracking-[0.2em] text-lg uppercase clip-bevel transition-all duration-300 overflow-hidden ${!isPlayable ? 'cursor-not-allowed opacity-60' : ''}`}
          style={{ 
            borderColor: selectedMode.color, 
            color: selectedMode.color 
          }}
          onMouseEnter={(e) => {
            if (isPlayable) {
              e.currentTarget.style.backgroundColor = selectedMode.color;
              e.currentTarget.style.color = '#ffffff'; 
              e.currentTarget.style.boxShadow = `0 0 40px ${selectedMode.color}80`;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }
          }}
          onMouseLeave={(e) => {
            if (isPlayable) {
              e.currentTarget.style.backgroundColor = '#131315';
              e.currentTarget.style.color = selectedMode.color;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0px)';
            }
          }}
        >
          {isPlayable && <div className="absolute inset-0 hazard-stripes text-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />}
          
          <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full transition-colors">
            {!isPlayable ? (
              'COMING SOON...'
            ) : (
              <>INITIATE_LINK <Zap size={20} className="group-hover:animate-pulse" /></>
            )}
          </span>
        </button>

      </div>
    </div>
  );
}