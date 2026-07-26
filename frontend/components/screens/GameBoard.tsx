import React, { useState } from 'react';
import { BrainCircuit, Bot, ShieldAlert, Zap, Activity, Terminal, Crosshair, ScanBarcode } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { DOMAINS, MECH, CAPTIONS, PLAYER_CARDS } from '@/constants/gameData';

export default function GameBoard() {
  const { 
    reality, realityMax, dopamine, dopamineMax, ap, apMax, focus, round,
    currentCard, hand, playCard, skipTurn, 
    isClashing, isAutoPilot, wakeUpClicks, clickWakeUp,
    floatingDeltas, weights 
  } = useGameStore();

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isRebooting, setIsRebooting] = useState(false);

  if (!currentCard) return null;

  const domainData = DOMAINS.find(d => d.id === currentCard.domain);
  const mechData = MECH[currentCard.mech as keyof typeof MECH];
  const DomainIcon = domainData?.Icon;
  const MechIcon = mechData?.Icon;

  let maxWeight = 0; let dominantType = 'UNKNOWN';
  Object.keys(weights).forEach(k => {
    if(weights[k] > maxWeight) { maxWeight = weights[k]; dominantType = k; }
  });
  const typeLabel = DOMAINS.find(d => d.id === dominantType)?.short || 'NORMAL';

  const hpPercent = (reality / realityMax) * 100;
  const hpColor = hpPercent > 50 ? 'bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]' : hpPercent > 20 ? 'bg-[#ffe600] shadow-[0_0_15px_#ffe600]' : 'bg-[#ff007f] shadow-[0_0_15px_#ff007f]';

  const hoveredCard = hoveredCardIndex !== null ? PLAYER_CARDS[hand[hoveredCardIndex] as keyof typeof PLAYER_CARDS] : null;
  const hoveredApCost = hoveredCard ? (hoveredCard.ap === 'ALL' ? ap : (hoveredCard.ap as number)) : 0;
  const hoveredFocusCost = hoveredCard ? hoveredCard.focus : 0;

  const handleRebootClick = () => {
    setIsRebooting(true);
    clickWakeUp();
    setTimeout(() => {
      setIsRebooting(false);
    }, 400);
  };

  return (
    <div className={`flex flex-col w-full h-[calc(100vh-130px)] min-h-[600px] max-h-[850px] bg-[#131315] border-2 border-[#2a2a35] overflow-hidden relative font-['Space_Grotesk'] transition-all ${isRebooting ? 'brightness-150 contrast-200 hue-rotate-180' : ''}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .clip-pcb { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        .clip-pcb-lg { clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px); }
        .clip-bevel { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
        
        /* Kiểu cắt vát góc thẻ bài giống mẫu TCG Cyberpunk */
        .clip-tcb-card { clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); }
        .clip-tcb-cost { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%); }
        .clip-tcb-textbox { clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px); }

        .hazard-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px); }
        .hazard-stripes-bg { background-image: repeating-linear-gradient(45deg, rgba(255,0,127,0.1), rgba(255,0,127,0.1) 4px, transparent 4px, transparent 8px); }

        @keyframes glitchBorder {
          0%   { border-color: #00f3ff; box-shadow: 0 0 20px rgba(0,243,255,0.5); }
          25%  { border-color: #ff007f; box-shadow: 0 0 50px rgba(255,0,127,0.9), inset 0 0 20px rgba(255,0,127,0.5); }
          50%  { border-color: #ffe600; box-shadow: 0 0 30px rgba(255,230,0,0.6); }
          75%  { border-color: transparent; box-shadow: none; }
          100% { border-color: #ff007f; box-shadow: 0 0 40px rgba(255,0,127,0.8); }
        }
        .anim-border-glitch { animation: glitchBorder 0.2s steps(2, end) infinite; }

        @keyframes resourceFlash {
          0% { opacity: 0.3; filter: brightness(0.5); }
          50% { opacity: 1; filter: brightness(2); box-shadow: 0 0 15px #ffe600; }
          100% { opacity: 0.3; filter: brightness(0.5); }
        }
        .animate-resource-flash { animation: resourceFlash 0.6s infinite ease-in-out; }

        @keyframes rebootFlash {
          0% { background-color: rgba(255, 0, 127, 0.8); transform: scale(1); }
          50% { background-color: rgba(0, 243, 255, 0.6); transform: scale(0.995); filter: invert(1); }
          100% { background-color: transparent; transform: scale(1); }
        }
        .animate-reboot-flash { animation: rebootFlash 0.4s cubic-bezier(0.11, 0, 0.5, 1) forwards; }

        @keyframes floatSpreadUp {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          20% { opacity: 1; transform: translateY(-15px) scale(1); }
          100% { opacity: 0; transform: translateY(-70px) scale(1.05); }
        }
        .anim-spread-float { animation: floatSpreadUp 0.9s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }

        /* THANH CUỘN CYBERPUNK CHỐNG ĐÈ LÊN BÀI */
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff007f; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
      `}} />

      {isRebooting && <div className="absolute inset-0 z-[100] pointer-events-none animate-reboot-flash" />}

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50 opacity-30" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      {/* ==========================================
          PHẦN 1: BATTLEFIELD & RIGHT SIDEBAR
          ========================================== */}
      <div className="flex-1 flex flex-row overflow-hidden relative border-b-2 border-[#2a2a35] z-10">
        
        {/* KHU VỰC TRÁI: CHIẾN TRƯỜNG */}
        <div className="flex-1 relative flex flex-col p-4 md:p-6">

          <div className="relative z-20 flex items-stretch h-10 w-fit shadow-[0_0_20px_rgba(255,0,127,0.15)] clip-bevel">
            <div className="bg-[#ff007f] text-[#131315] flex items-center px-3 font-black text-xs tracking-widest gap-2">
              <Bot size={16} /> 5.0
            </div>
            <div className="border-2 border-l-0 border-[#ff007f] bg-[#131315]/80 backdrop-blur-md flex items-center px-3">
              <span className="text-[#ff007f] font-mono text-[10px] font-bold uppercase tracking-widest">
                SURVEILLANCE_LOCK: [{typeLabel}]
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 w-full px-2 md:px-4">
            <div className={`w-full max-w-[500px] bg-[#1a1a24]/95 backdrop-blur-xl border-[3px] px-6 md:px-8 pt-10 pb-10 relative shadow-[0_0_60px_rgba(0,243,255,0.15)] transition-all duration-300 clip-pcb-lg
              ${isClashing || isAutoPilot ? 'anim-border-glitch' : 'border-[#00f3ff]/40'}`}
            >
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-70 mix-blend-screen" />

              <div className="absolute top-0 left-0 w-full h-5 hazard-stripes text-[#00f3ff] border-b-2 border-[#00f3ff]/50 opacity-60 z-0" />
              <div className="absolute bottom-0 left-0 w-full h-5 hazard-stripes text-[#ff007f] border-t-2 border-[#ff007f]/50 opacity-60 z-0" />

              <div className={`absolute -top-[3px] -left-[3px] w-10 h-10 border-t-[4px] border-l-[4px] z-10 ${isClashing || isAutoPilot ? 'border-transparent' : 'border-[#00f3ff] drop-shadow-[0_0_8px_#00f3ff]'}`} />
              <div className={`absolute -top-[3px] -right-[3px] w-10 h-10 border-t-[4px] border-r-[4px] z-10 ${isClashing || isAutoPilot ? 'border-transparent' : 'border-[#00f3ff] drop-shadow-[0_0_8px_#00f3ff]'}`} />
              <div className={`absolute -bottom-[3px] -left-[3px] w-10 h-10 border-b-[4px] border-l-[4px] z-10 ${isClashing || isAutoPilot ? 'border-transparent' : 'border-[#ff007f] drop-shadow-[0_0_8px_#ff007f]'}`} />
              <div className={`absolute -bottom-[3px] -right-[3px] w-10 h-10 border-b-[4px] border-r-[4px] z-10 ${isClashing || isAutoPilot ? 'border-transparent' : 'border-[#ff007f] drop-shadow-[0_0_8px_#ff007f]'}`} />

              <div className="absolute top-7 right-5 flex items-center gap-2 opacity-70 z-10 bg-[#1a1a24] px-2 py-0.5 border border-[#00f3ff]/30 shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                <ScanBarcode size={14} className="text-[#00f3ff]" />
                <span className="font-mono text-[9px] font-bold text-[#00f3ff] tracking-widest">DATA: CB-90</span>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6 border-b-2 border-[#2a2a35] pb-4 mt-2 relative z-10">
                <div className="text-[10px] font-mono font-bold py-1 px-3 text-[#131315] bg-[#00f3ff] flex items-center gap-1.5 uppercase clip-bevel shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                  {DomainIcon && <DomainIcon size={12} />} {domainData?.label}
                </div>
                <div className="text-[10px] font-mono font-bold py-1 px-3 text-[#ff007f] border-2 border-[#ff007f] bg-[#ff007f]/10 flex items-center gap-1.5 uppercase clip-bevel">
                  {MechIcon && <MechIcon size={12} />} {mechData?.label}
                </div>
              </div>
              
              <div className="text-xl md:text-2xl text-white font-bold leading-relaxed tracking-tight relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                "{CAPTIONS[currentCard.domain as keyof typeof CAPTIONS][currentCard.mech as keyof typeof MECH]}"
              </div>

              <div className="mt-8 flex items-center justify-between text-[#ffe600] font-mono text-[10px] md:text-xs font-bold relative z-10">
                <div className="flex items-center gap-2 bg-[#131315] px-3 py-1.5 border border-[#ffe600]/30 clip-bevel shadow-[0_0_10px_rgba(255,230,0,0.1)]">
                   <Activity size={14}/> {currentCard.likes} NODE_ENGAGEMENTS
                </div>
                <Crosshair size={24} className="text-[#00f3ff] opacity-50 drop-shadow-[0_0_5px_#00f3ff]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-16 right-12 z-50 flex flex-col items-end gap-2 pointer-events-none">
            {floatingDeltas.map((fd, index) => (
              <div 
                key={fd.id} 
                className="text-lg md:text-2xl font-mono font-black anim-spread-float px-3 py-1 bg-[#131315]/90 border border-[#2a2a35] clip-bevel shadow-[0_0_15px_rgba(0,0,0,0.8)] whitespace-nowrap"
                style={{ 
                  color: fd.color === '#FF5470' ? '#ff007f' : fd.color === '#4CE0D2' ? '#00f3ff' : fd.color,
                  transform: `translateX(${fd.offset}px)`
                }}
              >
                {fd.text}
              </div>
            ))}
          </div>
        </div>

        {/* KHU VỰC PHẢI: VERTICAL HUD */}
        <div className="w-[240px] md:w-[280px] bg-[#131315] border-l-2 border-[#2a2a35] p-4 flex flex-col justify-between z-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00f3ff]/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex mb-6 w-fit shadow-[0_0_10px_rgba(0,243,255,0.2)] clip-bevel">
              <div className="bg-[#00f3ff] text-[#131315] px-2 py-1 flex items-center justify-center">
                <BrainCircuit size={18} />
              </div>
              <div className="border-2 border-l-0 border-[#00f3ff] bg-[#131315] px-2 py-1 flex flex-col justify-center">
                <h2 className="font-black text-xs tracking-widest text-[#00f3ff] leading-none uppercase">USER_01</h2>
              </div>
            </div>

            <div className="mb-5">
              <div className="text-[9px] font-mono text-[#ffe600] mb-1.5 flex items-center justify-between uppercase tracking-widest">
                <span className="flex items-center gap-1"><Zap size={10}/> KERNEL_FOCUS</span>
                <span>[BSC-92]</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({length: 5}).map((_, i) => {
                  const isFlashingFocus = hoveredFocusCost > 0 && i >= (focus - hoveredFocusCost) && i < focus;
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 h-2 clip-bevel border transition-all ${
                        isFlashingFocus 
                          ? 'bg-[#ffe600] border-[#ffe600] animate-resource-flash scale-110' 
                          : i < focus 
                            ? 'bg-[#ffe600] border-[#ffe600] shadow-[0_0_10px_#ffe600]' 
                            : 'bg-[#1e1e24] border-[#2a2a35]'
                      }`} 
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-mono text-[#00f3ff] uppercase tracking-widest">SYS_STABILITY</span>
                <span className="text-xs font-mono font-black text-white">01/{Math.round(reality)}</span>
              </div>
              <div className="w-full bg-[#1e1e24] h-3.5 p-0.5 border-2 border-[#2a2a35] relative">
                <div className="absolute -left-1 -top-1 w-2 h-2 border-t border-l border-gray-500" />
                <div className="absolute -right-1 -bottom-1 w-2 h-2 border-b border-r border-gray-500" />
                
                <div className={`${hpColor} h-full transition-all duration-500 ease-out relative`} style={{width: `${hpPercent}%`}}>
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.3)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3)_75%,transparent_75%,transparent)] bg-[length:6px_6px]" />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-mono text-[#ff007f] uppercase tracking-widest">MALWARE_INFECT</span>
                <span className="text-xs font-mono font-black text-[#ff007f]">CB/{Math.round(dopamine)}</span>
              </div>
              <div className="w-full bg-[#1e1e24] h-3.5 p-0.5 border-2 border-[#2a2a35] relative">
                <div className="bg-[#ff007f] shadow-[0_0_15px_#ff007f] h-full transition-all duration-500 ease-out relative" style={{width: `${(dopamine/dopamineMax)*100}%`}}>
                   <div className="absolute inset-0 hazard-stripes-bg" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#2a2a35] bg-[#18181e] p-3 relative clip-pcb mt-auto z-10">
            <div className="text-[9px] font-mono text-[#ffe600] mb-3 uppercase tracking-widest text-center">/// ACTION_POINTS</div>
            <div className="flex justify-center gap-2 md:gap-3">
              {Array.from({length: apMax}).map((_, i) => {
                const isFlashingAp = typeof hoveredApCost === 'number' && hoveredApCost > 'ALL' && hoveredApCost > 0 && i >= (ap - (hoveredApCost as number)) && i < ap;
                const isFlashingAllAp = hoveredCard?.ap === 'ALL' && i < ap;

                return (
                  <div 
                    key={i} 
                    className={`w-8 h-8 md:w-9 md:h-9 clip-bevel border-2 transition-all duration-300 flex items-center justify-center ${
                      isFlashingAp || isFlashingAllAp
                        ? 'bg-[#ffe600] border-[#ffe600] animate-resource-flash scale-110 shadow-[0_0_20px_#ffe600]'
                        : i < ap 
                          ? 'bg-[#ffe600]/20 border-[#ffe600] shadow-[0_0_15px_rgba(255,230,0,0.4)]' 
                          : 'bg-transparent border-[#2a2a35]'
                    }`}
                  >
                    {(i < ap || isFlashingAp || isFlashingAllAp) && (
                      <div className={`w-3 h-3 bg-[#ffe600] shadow-[0_0_10px_#ffe600] clip-bevel ${isFlashingAp || isFlashingAllAp ? 'animate-ping' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OVERLAY WAKE UP / REBOOT */}
        {isAutoPilot && (
          <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-[#131315]/90">
            <button 
              onClick={handleRebootClick} 
              className={`group relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-[#131315] border-[4px] border-[#ff007f] flex flex-col items-center justify-center transition-all hover:bg-[#ff007f]/10 shadow-[0_0_60px_rgba(255,0,127,0.4)] active:scale-90 ${isRebooting ? 'animate-ping bg-[#00f3ff]' : ''}`}
            >
              <div className="absolute inset-0 rounded-full border-[4px] border-[#ff007f] hazard-stripes text-[#ff007f]/20 animate-[spin_10s_linear_infinite]" />
              <span className="font-black text-5xl tracking-tighter text-[#ff007f] glitch-text drop-shadow-[0_0_15px_#ff007f] z-10">REBOOT</span>
              <span className="font-mono text-[10px] mt-4 font-bold text-[#ffe600] bg-[#131315] border-2 border-[#ffe600] px-3 py-1.5 clip-bevel z-10">
                OVERRIDE: [ {wakeUpClicks}/10 ]
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ==========================================
          PHẦN 2: COMMAND MENU (THIẾT KẾ THẺ BÀI THEO MẪU TCG CYBERPUNK - ĐÃ CĂN GIỮA)
          ========================================== */}
      <div className="h-[260px] bg-[#131315] p-3 md:p-4 flex gap-3 md:gap-4 z-10 relative">
        
        {/* Khung Bài (Thẻ bài to hơn, căn giữa) */}
        <div className="flex-1 bg-[#18181e] border-2 border-[#2a2a35] py-4 px-2 flex overflow-x-auto custom-scrollbar relative items-center clip-pcb">
          {/* justify-center và min-w-max để căn giữa chuẩn kể cả khi có ít hay nhiều bài */}
          <div className="w-max min-w-full flex justify-center gap-4 h-full items-center px-4">
            {hand.map((cardId, idx) => {
              const card = PLAYER_CARDS[cardId as keyof typeof PLAYER_CARDS];
              if (!card) return null;
              
              const apCost = card.ap === 'ALL' ? ap : (card.ap as number);
              const notEnoughAP = ap < apCost || (card.ap === 'ALL' && ap === 0);
              const notEnoughFocus = focus < card.focus;
              const disabled = notEnoughAP || notEnoughFocus || isClashing || isAutoPilot;
              const CardIcon = card.Icon;
              const baseIconColor = card.color === '#FF5470' ? '#ff007f' : card.color === '#4CE0D2' ? '#00f3ff' : card.color;
              
              const costDisplay = card.ap === 'ALL' ? 'X' : card.ap;

              return (
                <button
                  key={`${cardId}-${idx}`}
                  disabled={disabled}
                  onClick={() => playCard(cardId, idx)}
                  onMouseEnter={() => setHoveredCardIndex(idx)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                  className={`group relative min-w-[160px] w-[160px] h-[200px] bg-[#15171e] text-center p-3 flex flex-col justify-between border-2 transition-all duration-300 clip-tcb-card
                    ${disabled ? 'border-[#2a2a35] opacity-40 cursor-not-allowed' : 'border-[#ff007f]/70 cursor-pointer hover:border-[#00f3ff] hover:-translate-y-3 hover:bg-[#1a1d26] hover:shadow-[0_0_25px_rgba(0,243,255,0.3)]'}
                  `}
                >
                  {/* Ô COST (Năng lượng) góc trên trái - Phong cách Cyberpunk TCG */}
                  <div className="absolute top-0 left-0 bg-[#00f3ff] text-[#131315] font-black font-mono text-sm w-8 h-8 flex items-center justify-center clip-tcb-cost shadow-[0_0_10px_#00f3ff] z-20">
                    {costDisplay}
                  </div>

                  {/* Nhãn loại thẻ bài (FIGHTER style) ở trên cùng giữa */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#ff007f] text-[#131315] text-[9px] font-black tracking-widest px-3 py-0.5 clip-bevel z-10 uppercase">
                    MODULE
                  </div>

                  {/* Nội dung bên trong thẻ bài */}
                  <div className="flex flex-col items-center flex-1 w-full pt-5 z-10 overflow-hidden">
                    {/* Tên Thẻ */}
                    <div className={`font-black text-[11px] uppercase mb-1.5 px-1 py-0.5 break-words leading-tight tracking-wider w-full transition-colors shrink-0 ${
                      disabled 
                        ? 'text-gray-500 border border-[#2a2a35]' 
                        : 'bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/40 group-hover:bg-[#00f3ff]/10 group-hover:text-[#00f3ff] group-hover:border-[#00f3ff]/50'
                    }`}>
                      {card.label}
                    </div>
                    
                    {/* Icon chiêu thức */}
                    <CardIcon 
                      size={26} 
                      style={{ color: disabled ? 'currentColor' : baseIconColor }} 
                      className={`my-1.5 transition-colors shrink-0 ${disabled ? '' : `drop-shadow-[0_0_6px_${baseIconColor}] group-hover:text-[#00f3ff]`}`} 
                    />
                    
                    {/* Khung mô tả text lõm vào */}
                    <div className="text-[10px] font-mono text-gray-300 group-hover:text-gray-100 transition-colors leading-[1.25] px-1.5 py-1.5 bg-[#0f1117] border border-[#2a2a35] group-hover:border-[#00f3ff]/30 clip-tcb-textbox font-semibold overflow-y-auto custom-scrollbar w-full flex-1 flex items-center justify-center">
                      <div>{card.desc}</div>
                    </div>
                  </div>

                  {/* Thanh chỉ số góc dưới (Giống góc trái cam, góc phải xanh lá trong mẫu) */}
                  <div className="w-full flex justify-between items-end mt-2 z-20">
                    {/* Chỉ số AP/Focus yêu cầu góc dưới trái (Màu vàng/cam) */}
                    <div className="bg-[#ff9900] text-[#131315] font-mono font-black text-[10px] w-7 h-6 flex items-center justify-center clip-bevel shadow-[0_0_8px_rgba(255,153,0,0.5)]">
                      {card.focus > 0 ? `F:${card.focus}` : '0'}
                    </div>

                    {/* Logo/Icon nhỏ trang trí ở giữa đáy */}
                    <div className="text-[#ff007f] group-hover:text-[#00f3ff] transition-colors mb-1">
                      <BrainCircuit size={14} />
                    </div>

                    {/* Chỉ số góc dưới phải (Màu xanh lá) */}
                    <div className="bg-[#00cc66] text-[#131315] font-mono font-black text-[10px] w-7 h-6 flex items-center justify-center clip-bevel shadow-[0_0_8px_rgba(0,204,102,0.5)]">
                      OK
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nút Lướt Tiếp (Run/Scroll) */}
        <div className="pl-3 border-l-2 border-[#2a2a35] h-full flex flex-col justify-center">
           <button
              disabled={isClashing || isAutoPilot}
              onClick={skipTurn}
              className="group relative w-[80px] h-full bg-[#131315] border-2 border-[#ff007f] flex flex-col items-center justify-between transition-all hover:bg-[#ff007f] hover:text-[#131315] text-[#ff007f] disabled:opacity-40 shadow-[0_0_20px_rgba(255,0,127,0.2)] clip-bevel overflow-hidden"
           >
              <div className="w-full h-4 hazard-stripes border-b-2 border-[#ff007f] opacity-80" />
              <div className="flex flex-col items-center justify-center flex-1 z-10">
                <Activity className="mb-1.5" size={20}/>
                <span className="font-mono font-black text-[10px] tracking-widest">SCROLL</span>
              </div>
              <div className="w-full h-4 hazard-stripes border-t-2 border-[#ff007f] opacity-80" />
           </button>
        </div>
        
      </div>
      
    </div>
  );
}