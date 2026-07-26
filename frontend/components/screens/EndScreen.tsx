import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Activity, Target, Zap, Radar as RadarIcon, Terminal, ShieldAlert, Sprout, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { DOMAINS, PLAYER_CARDS, MECH } from '@/constants/gameData';

// Ánh xạ 5 Hệ điểm yếu tâm lý mới từ feedback
const BEHAVIORAL_DOMAINS = [
  { id: 'lifestyle', short: 'ALGO_LIFE', label: 'Algorithmic Lifestyle', color: '#00f3ff' },
  { id: 'career', short: 'REC_BIAS', label: 'Recommendation Bias', color: '#ff007f' },
  { id: 'finance', short: 'FOMO', label: 'FOMO Vulnerability', color: '#ffe600' },
  { id: 'romance', short: 'SOCIAL_COMP', label: 'Social Comparison', color: '#00cc66' },
  { id: 'beauty', short: 'ECHO_CHAM', label: 'Echo Chamber', color: '#a200ff' }
];

export default function EndScreen() {
  const { reality, dopamine, round, maxRound, weights, history, restart } = useGameStore();

  // State chuyển đổi qua lại màn hình Sanctuary (Vườn Tâm Trí)
  const [inSanctuary, setInSanctuary] = useState(false);

  // TÌM RA ĐIỂM YẾU LỚN NHẤT CỦA NGƯỜI CHƠI (HỆ YẾU NHẤT)
  let maxWeight = 0;
  let maxDomainId = 'lifestyle';
  Object.keys(weights).forEach(k => {
    if(weights[k] > maxWeight) {
      maxWeight = weights[k];
      maxDomainId = k;
    }
  });
  
  const highestDomainData = BEHAVIORAL_DOMAINS.find(d => d.id === maxDomainId) || BEHAVIORAL_DOMAINS[0];

  // LỜI TUYÊN ÁN ĐỘNG THEO CHUẨN CYBERPUNK
  const getDynamicSentencing = () => {
    if (reality <= 0) {
      return { 
        title: `TARGET_LOCKED: [ ${highestDomainData.label.toUpperCase()} ]`, 
        text: `Hệ thống thuật toán đã thao túng hoàn toàn nhận thức của bạn thông qua điểm yếu [${highestDomainData.label}]. Thực tại đã sụp đổ.` 
      };
    }
    if (dopamine >= 100) {
      return { 
        title: `OVERLOAD: [ ${highestDomainData.label.toUpperCase()} ]`, 
        text: `Dopamine bão hòa. Hành vi trực tuyến của bạn đã bị cấu trúc lại vĩnh viễn bởi các vòng lặp vô tận.` 
      };
    }
    return { 
      title: 'SYSTEM_BYPASSED // SURVIVED', 
      text: 'Kết nối an toàn. Bạn đã bảo vệ thành công mỏ neo thực tại trước các cuộc tấn công tâm lý từ mạng xã hội.' 
    };
  };

  const status = getDynamicSentencing();
  const finalScore = Math.max(0, Math.round((reality * 10) - (dopamine * 5)));
  const isFailed = reality <= 0 || dopamine >= 100;
  
  // Dữ liệu cho biểu đồ Radar với 5 Hệ mới
  const radarData = BEHAVIORAL_DOMAINS.map(d => ({
    domain: d.short,
    weight: Math.round(weights[d.id as keyof typeof weights] || 10),
    fullMark: 50
  }));

  const chartData = [{ round: 0, reality: 80, dopamine: 20 }, ...history];

  const decisiveRound = history.length > 0 
    ? history.reduce((prev, curr) => Math.abs(curr.deltaReal) > Math.abs(prev.deltaReal) ? curr : prev, history[0]) 
    : null;

  // GIAO DIỆN KHU VƯỜN "MIND SANCTUARY" (Khi người chơi bấm Trở về tâm trí)
  if (inSanctuary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full h-[calc(100vh-130px)] min-h-[600px] bg-[#131315] border-2 border-[#2a2a35] relative font-['Space_Grotesk'] p-6">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50 opacity-30 fixed" />
        
        <div className="relative z-10 w-full max-w-2xl bg-[#1a1a24]/95 border-[3px] border-[#00cc66] p-8 clip-pcb-lg shadow-[0_0_50px_rgba(0,204,102,0.2)] text-center">
          <div className="flex items-center justify-center gap-2 text-[#00cc66] font-mono text-xs mb-4 uppercase">
            <Sprout size={20} className="animate-bounce" /> MIND_SANCTUARY // ACTIVE
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">KHU VƯỜN TÂM TRÍ</h2>
          <p className="font-mono text-gray-300 text-sm leading-relaxed mb-6">
            Điểm Mỏ Neo Thực Tại còn dư (<span className="text-[#00cc66] font-bold">{Math.max(0, Math.round(reality))} pts</span>) đã được chuyển hóa thành năng lượng sinh học. Cỏ dại thuật toán đã được dọn sạch, các cây mầm Tỉnh Thức đang đâm chồi.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setInSanctuary(false)}
              className="px-6 py-3 bg-[#131315] border-2 border-[#00f3ff] text-[#00f3ff] font-mono text-xs font-bold uppercase tracking-widest clip-bevel hover:bg-[#00f3ff] hover:text-[#131315] transition-all"
            >
              Quay lại Báo cáo
            </button>
            <button 
              onClick={restart}
              className="px-6 py-3 bg-[#131315] border-2 border-[#ff007f] text-[#ff007f] font-mono text-xs font-bold uppercase tracking-widest clip-bevel hover:bg-[#ff007f] hover:text-[#131315] transition-all"
            >
              Tái khởi động Hệ thống
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-8 w-full max-w-5xl mx-auto animate-fade-in font-['Space_Grotesk'] text-gray-200">
      
      <style dangerouslySetInnerHTML={{__html: `
        .clip-pcb-lg { clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px); }
        .clip-bevel { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        .hazard-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px); }
      `}} />

      {/* SESSION TERMINATED / KẾT QUẢ TỔNG QUAN */}
      <div className="w-full text-center mb-8">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#00f3ff] mb-2">/// SESSION_TERMINATED // LOG_ID: 0492</div>
        
        <div className={`bg-[#1a1a24]/95 border-[3px] ${isFailed ? 'border-[#ff007f]' : 'border-[#00f3ff]'} p-6 md:p-8 clip-pcb-lg shadow-2xl max-w-2xl mx-auto relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-3 hazard-stripes opacity-30" style={{ color: isFailed ? '#ff007f' : '#00f3ff' }} />
          
          <div className={`font-black text-2xl md:text-3xl mb-3 uppercase tracking-tight ${isFailed ? 'text-[#ff007f] glitch-text' : 'text-[#00f3ff]'}`}>
            {status.title}
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-mono">
            {status.text}
          </p>
        </div>
      </div>

      {/* BIỂU ĐỒ (LINE CHART & RADAR CHART) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6 px-4">
        
        {/* LINE CHART: Trạng thái tâm lý qua các vòng */}
        <div className="w-full bg-[#18181e] border-2 border-[#2a2a35] p-5 flex flex-col clip-bevel h-[320px]">
          <h3 className="font-mono text-xs text-[#00f3ff] uppercase tracking-widest mb-4 flex items-center justify-between border-b border-[#2a2a35] pb-2">
            <span className="flex items-center gap-2"><Activity size={16} /> PSYCHOLOGICAL_STATE</span>
            <div className="flex gap-4 text-[10px]">
               <span className="text-[#00f3ff]">● Reality</span>
               <span className="text-[#ff007f]">● Dopamine</span>
            </div>
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="round" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#131315', borderColor: '#00f3ff', color: '#fff', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }} />
                <Line type="monotone" name="Reality" dataKey="reality" stroke="#00f3ff" strokeWidth={2.5} dot={{ r: 3, fill: '#131315', stroke: '#00f3ff' }} />
                <Line type="monotone" name="Dopamine" dataKey="dopamine" stroke="#ff007f" strokeWidth={2.5} dot={{ r: 3, fill: '#131315', stroke: '#ff007f' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RADAR CHART: Hệ điểm yếu hành vi */}
        <div className="w-full bg-[#18181e] border-2 border-[#2a2a35] p-5 flex flex-col clip-bevel h-[320px]">
          <h3 className="font-mono text-xs text-[#ff007f] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#2a2a35] pb-2">
            <RadarIcon size={16} /> BEHAVIORAL_VULNERABILITY_PROFILE
          </h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#2a2a35" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#aaa', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} axisLine={false} />
                <Radar name="Obsession Level" dataKey="weight" stroke="#ff007f" fill="#ff007f" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: '#131315', borderColor: '#ff007f', color: '#fff', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* THÔNG TIN BƯỚC NGOẶT & ĐIỂM KHÁNG CỰ */}
      <div className="flex flex-col md:flex-row gap-6 w-full mb-8 px-4">
        
        {decisiveRound && (
          <div className="flex-1 bg-[#1a1a24] border-2 border-[#ffe600]/40 border-l-4 border-l-[#ffe600] p-4 clip-bevel shadow-lg">
            <h4 className="font-mono font-bold text-[#ffe600] mb-2 text-xs uppercase tracking-widest flex items-center gap-2">
              <Target size={16}/> TURNING_POINT // ROUND [{decisiveRound.round}]
            </h4>
            <p className="font-mono text-xs text-gray-300 leading-relaxed">
              Bạn đã chọn <b>{PLAYER_CARDS[decisiveRound.cardId as keyof typeof PLAYER_CARDS]?.label || 'SCROLL'}</b> chống lại <b>{MECH[decisiveRound.mech as keyof typeof MECH]?.label}</b>, khiến Mỏ Neo Thực Tại {decisiveRound.deltaReal >= 0 ? 'tăng' : 'sụt giảm'} {Math.abs(decisiveRound.deltaReal)} điểm.
            </p>
          </div>
        )}

        <div className="flex-1 bg-[#18181e] border-2 border-[#2a2a35] p-4 flex flex-col justify-center items-center clip-bevel shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] text-[#ffe600]/10 rotate-12">
            <Zap size={90} />
          </div>
          <span className="font-mono text-[10px] text-[#ffe600] uppercase tracking-widest mb-1 relative z-10">/// RESISTANCE_SCORE</span>
          <div className="text-3xl font-black font-mono text-[#ffe600] mb-0.5 relative z-10 drop-shadow-[0_0_10px_rgba(255,230,0,0.4)]">
            {finalScore} <span className="text-sm font-normal">PTS</span>
          </div>
        </div>
      </div>

      {/* CÁC NÚT ĐIỀU HƯỚNG CUỐI TRANG (REBOOT & MIND SANCTUARY) */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
        <button 
          onClick={() => setInSanctuary(true)}
          className="flex-1 bg-[#131315] border-2 border-[#00cc66] text-[#00cc66] hover:bg-[#00cc66] hover:text-[#131315] font-mono text-xs py-4 font-bold uppercase tracking-widest clip-bevel transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,204,102,0.2)]"
        >
          <Sprout size={16} /> Return to Sanctuary
        </button>

        <button 
          onClick={restart} 
          className="flex-1 bg-[#131315] border-2 border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-[#131315] font-mono text-xs py-4 font-bold uppercase tracking-widest clip-bevel transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
        >
          <RotateCcw size={16} /> Reboot System ↻
        </button>
      </div>
      
    </div>
  );
}