import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useGameStore } from '@/store/useGameStore';
import { DOMAINS, MECH, CAPTIONS } from '@/constants/gameData';

export default function Arena() {
  const { currentCard, cardFlipId, isClashing, floatingDeltas, isAutoPilot, wakeUpClicks, clickWakeUp } = useGameStore();

  if (!currentCard) return null;

  const domainData = DOMAINS.find(d => d.id === currentCard.domain);
  const mechData = MECH[currentCard.mech as keyof typeof MECH];
  const DomainIcon = domainData?.Icon;
  const MechIcon = mechData?.Icon;

  return (
    <div className="flex justify-center h-[280px] w-full relative items-center mt-4">
      {/* Khai báo CSS Animation cho màn hình cuộn */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes autoScroll {
          0% { transform: translateY(0); filter: blur(0px); opacity: 1;}
          50% { filter: blur(4px); opacity: 0.8;}
          100% { transform: translateY(-150%); filter: blur(0px); opacity: 0;}
        }
        .anim-scroll {
          animation: autoScroll 0.3s linear infinite;
        }
      `}} />

      {/* OVERLAY WAKE UP! */}
      {isAutoPilot && (
        <div className="absolute inset-[-50px] z-50 flex items-center justify-center backdrop-blur-md bg-[#0B0E14]/80 rounded-3xl transition-all">
          <button 
            onClick={clickWakeUp} 
            className="w-48 h-48 rounded-full bg-[#FF5470] text-[#0B0E14] flex flex-col items-center justify-center animate-pulse shadow-[0_0_80px_rgba(255,84,112,0.6)] hover:scale-105 active:scale-95 transition-transform border-4 border-white/20"
          >
            <span className="font-['Space_Grotesk'] font-black text-4xl tracking-tighter">WAKE UP!</span>
            <span className="font-mono text-sm mt-2 font-bold bg-black/20 px-3 py-1 rounded-full">
              Click: {wakeUpClicks}/10
            </span>
          </button>
        </div>
      )}

      {floatingDeltas.map(fd => (
        <div key={fd.id} className="absolute text-xl font-mono font-bold anim-float z-20 pointer-events-none drop-shadow-lg" style={{ color: fd.color, transform: `translateX(${fd.offset}px)` }}>
          {fd.text}
        </div>
      ))}
      
      <div 
        key={cardFlipId} 
        className={`w-[320px] bg-[#171C27] border border-[#232938] rounded-2xl p-6 relative shadow-2xl anim-deal 
          ${isClashing ? 'anim-clash border-red-500/50' : ''}
          ${isAutoPilot ? 'anim-scroll border-[#FF5470]' : ''}
        `}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5470] to-[#FFB84D] rounded-t-2xl" />
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="text-[10px] font-mono py-1 px-2.5 text-[#8891A3] border-[#232938] flex items-center gap-1.5">
            {DomainIcon && <DomainIcon size={12} />}
            {domainData?.label}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono py-1 px-2.5 text-[#FF5470] border-[#3a1f28] flex items-center gap-1.5 bg-red-950/20">
            {MechIcon && <MechIcon size={12} />}
            {mechData?.label}
          </Badge>
        </div>
        <div className="text-lg text-[#EDEFF4] font-medium leading-relaxed mb-4">
          {CAPTIONS[currentCard.domain as keyof typeof CAPTIONS][currentCard.mech as keyof typeof MECH]}
        </div>
      </div>

      {/* Hiệu ứng tạo ảo giác có nhiều thẻ bài lướt qua khi Auto-Pilot */}
      {isAutoPilot && (
        <div className="absolute w-[320px] h-full bg-[#171C27] rounded-2xl opacity-30 anim-scroll" style={{ animationDelay: '0.1s' }} />
      )}
    </div>
  );
}