"use client";

import React from 'react';
import { Activity } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import IntroScreen from '@/components/screens/IntroScreen';
import GameBoard from '@/components/screens/GameBoard';
import EndScreen from '@/components/screens/EndScreen';

export default function AppWrapper() {
  const { screen, round, maxRound } = useGameStore();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#EDEFF4] font-sans flex justify-center p-4 lg:p-8 select-none overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes feedDeal { 0% { opacity: 0; transform: translateY(-80px) scale(0.6) rotate(-15deg); } 70% { transform: translateY(10px) scale(1.05) rotate(3deg); } 100% { opacity: 1; transform: translateY(0) scale(1) rotate(-1.5deg); } }
        @keyframes cardDraw { 0% { opacity: 0; transform: translateY(50px) scale(0.8); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes clashHit { 0% { transform: scale(1); } 50% { transform: scale(0.95); filter: brightness(1.5); } 100% { transform: scale(1); } }
        @keyframes floatUp { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; transform: translateY(-20px); } 100% { opacity: 0; transform: translateY(-60px); } }
        
        /* Hiệu ứng Glitch cho màn hình End-Game */
        @keyframes glitch {
          0% { text-shadow: 0.05em 0 0 rgba(255,84,112,0.75), -0.025em -0.05em 0 rgba(76,224,210,0.75), 0.025em 0.05em 0 rgba(176,132,255,0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(255,84,112,0.75), -0.025em -0.05em 0 rgba(76,224,210,0.75), 0.025em 0.05em 0 rgba(176,132,255,0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(255,84,112,0.75), 0.025em 0.025em 0 rgba(76,224,210,0.75), -0.05em -0.05em 0 rgba(176,132,255,0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255,84,112,0.75), 0.025em 0.025em 0 rgba(76,224,210,0.75), -0.05em -0.05em 0 rgba(176,132,255,0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255,84,112,0.75), 0.05em 0 0 rgba(76,224,210,0.75), 0 -0.05em 0 rgba(176,132,255,0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255,84,112,0.75), 0.05em 0 0 rgba(76,224,210,0.75), 0 -0.05em 0 rgba(176,132,255,0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(255,84,112,0.75), -0.025em -0.025em 0 rgba(76,224,210,0.75), -0.025em -0.05em 0 rgba(176,132,255,0.75); }
        }
        .glitch-text { animation: glitch 1s linear infinite; }

        .anim-deal { animation: feedDeal 0.5s cubic-bezier(.17,.67,.28,1.03) forwards; }
        .anim-draw { animation: cardDraw 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .anim-clash { animation: clashHit 0.4s ease-in-out; }
        .anim-float { animation: floatUp 0.8s ease-out forwards; }
      `}} />

      <div className="w-full max-w-6xl flex flex-col">
        

        {screen === 'intro' && <IntroScreen />}
        {screen === 'game' && <GameBoard />}
        {screen === 'end' && <EndScreen />}
      </div>
    </div>
  );
}