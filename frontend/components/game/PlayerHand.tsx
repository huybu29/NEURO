"use client";
import React from 'react';
import { Layers, Inbox, BrainCircuit, MousePointer2 } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { PLAYER_CARDS } from '@/constants/gameData';

export default function PlayerHand() {
  const { hand, deck, discard, ap, focus, isClashing, isAutoPilot, playCard, skipTurn } = useGameStore();

  return (
    <div className="w-full mt-auto pt-6 flex justify-between items-end gap-2">
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="w-14 h-20 bg-[#12161F] border-2 border-[#232938] rounded-lg flex items-center justify-center shadow-lg relative">
          <Layers className="text-[#565F72]" size={20} />
          <div className="absolute -top-2 -right-2 bg-[#232938] text-xs font-mono px-2 py-0.5 rounded-full border border-[#12161F]">{deck.length}</div>
        </div>
      </div>

      <div className="flex justify-center flex-1 px-2 perspective-[1000px] -space-x-12 sm:-space-x-8 md:-space-x-4">
        {hand.map((cardId, idx) => {
          const card = PLAYER_CARDS[cardId as keyof typeof PLAYER_CARDS];
          const apCost = card.ap === 'ALL' ? ap : (card.ap as number);
          const notEnoughAP = ap < apCost || (card.ap === 'ALL' && ap === 0);
          const notEnoughFocus = focus < card.focus;
          
          const CardIcon = card.Icon;
          const disabled = notEnoughAP || notEnoughFocus || isClashing || isAutoPilot;
          return (
            <button
              key={`${cardId}-${idx}`}
              disabled={disabled}
              onClick={() => playCard(cardId, idx)}
              
              className={`group relative w-[110px] md:w-[125px] h-[160px] md:h-[170px] bg-[#1a1c23] rounded-xl text-left flex flex-col shadow-2xl anim-draw transition-all duration-300 ease-out origin-bottom border
                hover:z-50 focus:z-50 
                ${disabled ? 'opacity-40 grayscale-[50%] border-[#2a3142] cursor-not-allowed' : 'cursor-pointer hover:-translate-y-8 hover:scale-110 hover:shadow-[0_0_25px_rgba(76,224,210,0.5)] border-[#2a3142] hover:border-[#4CE0D2]'}`}
              style={{ 
                animationDelay: `${idx * 0.1}s`,
                zIndex: idx 
              }}
            >
              <div className="p-2 border-b border-[#2a3142]/50 flex justify-between items-start">
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${notEnoughAP ? 'bg-red-900/50 text-red-300 border-red-800' : 'bg-[#0B0E14] text-[#FFB84D] border-[#4a3a1c]'}`}>
                  {card.ap === 'ALL' ? 'ALL AP' : `${card.ap} AP`}
                </span>
                {card.focus > 0 && (
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${notEnoughFocus ? 'bg-red-900/50 text-red-300 border-red-800' : 'bg-[#1e1433] text-[#b084ff] border-[#38265c]'}`}>
                    <BrainCircuit size={10}/> {card.focus}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black/30 p-2">
                 <CardIcon size={36} color={card.color} className="group-hover:scale-110 transition-transform drop-shadow-lg mb-2" />
                 <div className="text-xs font-bold text-[#EDEFF4] text-center leading-tight">{card.label}</div>
              </div>
              <div className="p-2 text-[9px] text-[#8891A3] leading-tight bg-[#12161F] rounded-b-xl border-t border-[#2a3142]/50 h-[48px] overflow-hidden flex items-center">
                {card.desc}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 mb-2 ml-2">
        {/* NÚT SCROLL (SKIP TURN) */}
        <button
          disabled={isClashing || isAutoPilot}
          onClick={skipTurn}
          className={`group w-14 h-[84px] bg-[#1a0a0d] border-2 border-[#FF5470]/70 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,84,112,0.15)] transition-all hover:bg-[#FF5470]/20 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed relative z-20`}
        >
          <MousePointer2 className="text-[#FF5470] mb-1 group-hover:animate-bounce" size={18} />
          <span className="text-[10px] font-black text-[#FF5470] text-center leading-tight tracking-wider">SCROLL</span>
        </button>

        <div className="w-14 h-14 bg-[#0B0E14] border border-[#1b202e] rounded-lg flex items-center justify-center shadow-inner relative opacity-80 mt-1">
          <Inbox className="text-[#3a3f4c]" size={20} />
          <div className="absolute -top-2 -right-2 bg-[#1b202e] text-[#565F72] text-xs font-mono px-2 py-0.5 rounded-full border border-[#0B0E14]">{discard.length}</div>
        </div>
      </div>
    </div>
  );
}