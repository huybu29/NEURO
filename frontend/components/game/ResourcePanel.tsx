"use client";
import React from 'react';
import { Zap, BrainCircuit, Anchor, Flame } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function ResourcePanel() {
  const { ap, apMax, focus, focusMax, reality, dopamine } = useGameStore();

  return (
    <div className="lg:col-span-3 flex flex-col gap-5 h-full">
      <div className="bg-[#12161F]/60 border border-[#232938] rounded-2xl p-4">
        <div className="flex justify-between text-xs font-mono font-bold text-[#FFB84D] mb-3 uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><Zap size={14}/> Energy (AP)</span>
          <span>{ap}/{apMax}</span>
        </div>
        <div className="flex gap-2">
          {[...Array(apMax)].map((_, i) => (
            <div key={i} className={`h-8 flex-1 rounded-md border transition-all duration-300 ${i < ap ? 'bg-[#FFB84D]/20 border-[#FFB84D] shadow-[0_0_10px_rgba(255,184,77,0.3)]' : 'bg-[#171C27] border-[#232938]'}`} />
          ))}
        </div>
      </div>

      <div className="bg-[#12161F]/60 border border-[#232938] rounded-2xl p-4">
        <div className="flex justify-between text-xs font-mono font-bold text-[#b084ff] mb-3 uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><BrainCircuit size={14}/> Focus Level</span>
          <span>{focus}/{focusMax}</span>
        </div>
        <div className="flex gap-2">
          {[...Array(focusMax)].map((_, i) => (
            <div key={i} className={`h-6 flex-1 rounded-md border transition-all duration-300 ${i < focus ? 'bg-[#b084ff]/30 border-[#b084ff] shadow-[0_0_10px_rgba(176,132,255,0.3)]' : 'bg-[#171C27] border-[#232938]'}`} />
          ))}
        </div>
      </div>

      <div className="bg-[#12161F]/60 border border-[#232938] rounded-2xl p-4">
        <div className="flex justify-between text-xs font-mono font-bold text-[#4CE0D2] mb-3 uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><Anchor size={14}/> Reality Anchor</span>
          <span>{reality}%</span>
        </div>
        <div className="h-4 bg-[#232938] rounded-full overflow-hidden border border-[#1b2f33] p-[2px]">
          <div className="h-full bg-gradient-to-r from-[#218c81] to-[#4CE0D2] rounded-full transition-all duration-500 ease-out" style={{width: `${reality}%`}} />
        </div>
      </div>

      <div className="bg-[#12161F]/60 border border-[#232938] rounded-2xl p-4">
        <div className="flex justify-between text-xs font-mono font-bold text-[#FF5470] mb-3 uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><Flame size={14}/> Dopamine</span>
          <span>{dopamine}%</span>
        </div>
        <div className="h-4 bg-[#232938] rounded-full overflow-hidden border border-[#3a1f28] p-[2px]">
          <div className="h-full bg-gradient-to-r from-[#8c1c2e] to-[#FF5470] rounded-full transition-all duration-500 ease-out" style={{width: `${dopamine}%`}} />
        </div>
      </div>
    </div>
  );
}