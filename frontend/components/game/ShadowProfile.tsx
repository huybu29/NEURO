"use client";
import React from 'react';
import { Eye } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { DOMAINS } from '@/constants/gameData';

export default function ShadowProfile() {
  const weights = useGameStore((state) => state.weights);

  return (
    <div className="lg:col-span-3 bg-[#12161F]/60 border border-[#232938] rounded-2xl p-5 flex flex-col gap-6 h-full">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#1c222e,#0c0f16)] border-2 border-[#2a3242] flex items-center justify-center">
          <Eye size={36} className="text-[#FF5470]" />
        </div>
        <h3 className="font-['Space_Grotesk'] font-bold text-slate-100 mt-4 text-lg tracking-widest">THE ALGORITHM</h3>
      </div>
      <div className="flex-1 mt-4">
        <h4 className="font-mono text-[10px] text-[#565F72] uppercase tracking-widest mb-4 text-center">Shadow Profile</h4>
        <div className="flex justify-between items-end h-[140px] px-1 gap-1.5">
          {DOMAINS.map(d => {
            const w = weights[d.id as keyof typeof weights];
            const fillColor = w > 32 ? 'bg-[#FF5470]' : w > 20 ? 'bg-[#FFB84D]' : 'bg-[#4CE0D2]';
            return (
              <div key={d.id} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <div className="w-5 h-full bg-[#232938]/50 rounded-full overflow-hidden flex items-end">
                  <div className={`w-full rounded-full transition-all duration-500 ease-out ${fillColor}`} style={{ height: `${Math.min(100, w * 2.2)}%` }} />
                </div>
                <div className="font-mono text-[9px] font-bold tracking-wider text-[#8891A3]">{d.short}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}