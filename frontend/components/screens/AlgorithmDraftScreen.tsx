import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Zap, Skull, Swords, Timer, Lock, UserX, Check, ShieldCheck } from 'lucide-react';

// === DỮ LIỆU THẺ BÀI CHO KHÂU CẤM/CHỌN ===
const ALGORITHM_POOL = [
  { id: 'a1', label: 'DRAMA BAIT', type: 'HOOK', desc: 'Tăng 50% tỷ lệ dính bẫy click ảo của Người Dùng.', color: '#ff007f' },
  { id: 'a2', label: 'INFINITE SCROLL', type: 'TRAP', desc: 'Vô hiệu hóa nút Skip của đối phương trong 2 lượt.', color: '#ff007f' },
  { id: 'a3', label: 'FOMO TRIGGER', type: 'PSYCH', desc: 'Rút cạn 10 Reality nếu User không tương tác ngay lập tức.', color: '#ffe600' },
  { id: 'a4', label: 'ECHO CHAMBER', type: 'ISOLATE', desc: 'Giấu thẻ Fact-Check của User, ép họ đọc tin giả.', color: '#a200ff' },
  { id: 'a5', label: 'FAKE NEWS', type: 'TOXIC', desc: 'Gây sát thương chí mạng 20 điểm lên thanh Reality Anchor.', color: '#ff5470' },
  { id: 'a6', label: 'LOOP AUDIO', type: 'HYPNOTIZE', desc: 'Giảm 2 điểm Focus của toàn bộ team User trong 3 lượt.', color: '#ff007f' },
  { id: 'a7', label: 'RAGE BAIT', type: 'AGGRO', desc: 'Kích động cảm xúc, ép User phải dùng thẻ Attack bừa bãi.', color: '#ff5470' },
  { id: 'a8', label: 'SHADOW BAN', type: 'SILENCE', desc: 'Khóa 1 kỹ năng sinh tồn ngẫu nhiên của User.', color: '#a200ff' },
];

const USER_POOL = [
  { id: 'u1', label: 'FACT CHECK', type: 'DEFENSE', desc: 'Phá hủy hoàn toàn hiệu ứng của Fake News hoặc Drama Bait.', color: '#00f3ff' },
  { id: 'u2', label: 'TOUCH GRASS', type: 'HEAL', desc: 'Hồi phục 20 điểm Reality Anchor cho toàn team.', color: '#00cc66' },
  { id: 'u3', label: 'FORCE QUIT', type: 'ESCAPE', desc: 'Giải thoát đồng đội khỏi trạng thái Infinite Scroll ngay lập tức.', color: '#00f3ff' },
  { id: 'u4', label: 'BLOCK KEYWORD', type: 'SHIELD', desc: 'Tạo lớp khiên miễn nhiễm với Rage Bait và Echo Chamber.', color: '#00cc66' },
  { id: 'u5', label: 'DIGITAL DETOX', type: 'CLEANSE', desc: 'Xóa bỏ mọi debuff đang áp dụng lên team.', color: '#00f3ff' },
  { id: 'u6', label: 'REPORT SPAM', type: 'COUNTER', desc: 'Phản đòn, khóa 1 ô hành động của phe Thuật Toán.', color: '#ff9900' },
  { id: 'u7', label: 'MUTE NOTIFS', type: 'SILENCE', desc: 'Ngăn chặn FOMO Trigger kích hoạt trong lượt tiếp theo.', color: '#00f3ff' },
  { id: 'u8', label: 'SET TIMER', type: 'CONTROL', desc: 'Giảm một nửa thời gian tác dụng của thẻ hệ Trap.', color: '#00cc66' },
];

export default function AlgorithmDraftScreen() {
  const [phase, setPhase] = useState<'BAN' | 'PICK'>('BAN');
  const [turn, setTurn] = useState<'ALGORITHM' | 'USER'>('ALGORITHM');
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [algoBans, setAlgoBans] = useState<string[]>([]);
  const [userBans, setUserBans] = useState<string[]>([]);
  
  const [algoPicks, setAlgoPicks] = useState<string[]>([]);
  const [userPicks, setUserPicks] = useState<string[]>([]);
  
  const [hoveredCard, setHoveredCard] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Giả lập logic chuyển lượt đơn giản
  const handleLockIn = () => {
    if (!selectedCard) return;

    if (phase === 'BAN') {
      if (turn === 'ALGORITHM') {
        setAlgoBans([...algoBans, selectedCard.id]);
        setTurn('USER');
      } else {
        setUserBans([...userBans, selectedCard.id]);
        if (algoBans.length === 2 && userBans.length === 2) {
          setPhase('PICK');
          setTurn('ALGORITHM');
        } else {
          setTurn('ALGORITHM');
        }
      }
    } else {
      if (turn === 'ALGORITHM') {
        setAlgoPicks([...algoPicks, selectedCard.id]);
        setTurn('USER');
      } else {
        setUserPicks([...userPicks, selectedCard.id]);
        if (algoPicks.length === 3 && userPicks.length === 3) {
          alert('DRAFT COMPLETED! BẮT ĐẦU TRẬN CHIẾN!');
        } else {
          setTurn('ALGORITHM');
        }
      }
    }
    setSelectedCard(null);
    setTimeLeft(30);
  };

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Tự động bỏ qua nếu hết giờ
      handleLockIn();
    }
  }, [timeLeft]);

  // Xác định danh sách thẻ bài hiển thị dựa trên lượt của ai
  const currentPool = turn === 'ALGORITHM' ? USER_POOL : ALGORITHM_POOL; // Khi BAN/PICK, bạn chọn thẻ của ĐỐI PHƯƠNG để cấm, và chọn thẻ CỦA MÌNH để pick. 
  // Để đơn giản logic UI: 
  // Lượt ALGORITHM (Thuật toán): Nếu BAN thì chọn thẻ của USER. Nếu PICK thì chọn thẻ ALGORITHM.
  const displayPool = (phase === 'BAN' && turn === 'ALGORITHM') || (phase === 'PICK' && turn === 'USER') ? USER_POOL : ALGORITHM_POOL;

  const isCardDisabled = (cardId: string) => {
    return algoBans.includes(cardId) || userBans.includes(cardId) || algoPicks.includes(cardId) || userPicks.includes(cardId);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-130px)] min-h-[650px] bg-[#131315] border-2 border-[#2a2a35] overflow-hidden relative font-['Space_Grotesk']">
      
      <style dangerouslySetInnerHTML={{__html: `
        .clip-pcb { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        .clip-bevel { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
        .clip-hex { clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px); }
        .hazard-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px); }
      `}} />

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50 opacity-20" />

      {/* ================= HEADER: THÔNG TIN LƯỢT ================= */}
      <div className="h-[80px] border-b-2 border-[#2a2a35] flex items-center justify-between px-6 relative z-10 bg-[#18181e]">
        
        {/* TEAM THUẬT TOÁN (TRÁI) */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff007f]/20 border-2 border-[#ff007f] flex items-center justify-center clip-hex shadow-[0_0_15px_rgba(255,0,127,0.3)]">
            <Skull className="text-[#ff007f]" size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black text-[#ff007f] tracking-widest uppercase">TEAM 01</div>
            <div className="text-xl font-black text-white tracking-tighter">THE ALGORITHM</div>
          </div>
        </div>

        {/* TIMER & PHASE (GIỮA) */}
        <div className="flex flex-col items-center">
          <div className={`text-[10px] font-mono font-bold tracking-widest px-4 py-1 mb-1 clip-bevel ${phase === 'BAN' ? 'bg-[#ffe600] text-black' : 'bg-[#00f3ff] text-black'}`}>
            PHASE: {phase}
          </div>
          <div className="flex items-center gap-2">
            <Timer className={timeLeft <= 10 ? 'text-[#ff007f] animate-ping' : 'text-gray-400'} size={18} />
            <span className={`text-3xl font-black font-mono tracking-tighter ${timeLeft <= 10 ? 'text-[#ff007f]' : 'text-white'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
          <div className="text-xs font-black mt-1 uppercase tracking-widest" style={{ color: turn === 'ALGORITHM' ? '#ff007f' : '#00f3ff' }}>
            {turn === 'ALGORITHM' ? '< THE ALGORITHM IS PICKING' : 'THE USERS ARE PICKING >'}
          </div>
        </div>

        {/* TEAM NGƯỜI DÙNG (PHẢI) */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-[10px] font-mono font-black text-[#00f3ff] tracking-widest uppercase">TEAM 02</div>
            <div className="text-xl font-black text-white tracking-tighter">THE USERS</div>
          </div>
          <div className="w-12 h-12 bg-[#00f3ff]/20 border-2 border-[#00f3ff] flex items-center justify-center clip-hex shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <ShieldCheck className="text-[#00f3ff]" size={24} />
          </div>
        </div>
      </div>

      {/* ================= MAIN DRAFT AREA ================= */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* SIDEBAR TRÁI: ALGORITHM TEAM */}
        <div className="w-[280px] border-r-2 border-[#2a2a35] bg-[#131315] flex flex-col relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff007f]/5 to-transparent pointer-events-none" />
          
          {/* Banned Cards */}
          <div className="p-4 border-b border-[#2a2a35] flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-14 h-14 bg-[#18181e] border-2 border-[#2a2a35] flex items-center justify-center clip-bevel relative opacity-50">
                {algoBans[i] ? (
                  <>
                    <UserX className="text-gray-500 absolute" size={24} />
                    <div className="w-full h-0.5 bg-[#ff007f] absolute rotate-45" />
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Picked Cards (3 Slots for 3v3) */}
          <div className="flex-1 p-4 flex flex-col gap-4">
            {[0, 1, 2].map(i => {
              const pickedCardId = algoPicks[i];
              const card = ALGORITHM_POOL.find(c => c.id === pickedCardId);
              const isActiveSlot = phase === 'PICK' && turn === 'ALGORITHM' && algoPicks.length === i;

              return (
                <div key={i} className={`flex-1 border-2 clip-pcb transition-all flex flex-col p-3 relative ${
                  card ? 'border-[#ff007f] bg-[#ff007f]/10 shadow-[0_0_20px_rgba(255,0,127,0.2)]' :
                  isActiveSlot ? 'border-[#ff007f] animate-pulse bg-[#18181e]' : 'border-[#2a2a35] bg-[#18181e] opacity-40'
                }`}>
                  {card ? (
                    <>
                       <div className="text-[9px] font-mono text-[#ff007f] uppercase tracking-widest mb-1">{card.type}</div>
                       <div className="font-black text-lg text-white uppercase tracking-tighter">{card.label}</div>
                       <div className="absolute top-0 right-0 w-8 h-8 bg-[#ff007f] flex items-center justify-center clip-bevel text-[#131315]">
                         <Check size={18} />
                       </div>
                    </>
                  ) : (
                    <div className="m-auto text-gray-600 font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-2">
                       <Swords size={20}/>
                       {isActiveSlot ? 'SELECTING...' : 'WAITING'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: KHU VỰC THẺ BÀI */}
        <div className="flex-1 p-6 flex flex-col bg-[#0f1117] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-white/5 pointer-events-none select-none">
            {turn}
          </div>

          <div className="text-center font-mono text-sm text-gray-400 uppercase tracking-widest mb-6 border-b border-[#2a2a35] pb-4">
             POOL: {displayPool === USER_POOL ? 'SURVIVAL SKILLS (USERS)' : 'TOXIC FEED (ALGORITHM)'}
          </div>

          {/* Grid Thẻ Bài */}
          <div className="grid grid-cols-4 gap-4 mb-auto">
            {displayPool.map((card) => {
              const disabled = isCardDisabled(card.id);
              const isSelected = selectedCard?.id === card.id;

              return (
                <button
                  key={card.id}
                  disabled={disabled}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedCard(card)}
                  className={`relative h-40 bg-[#18181e] border-2 p-3 flex flex-col items-center justify-center clip-bevel transition-all duration-300
                    ${disabled ? 'border-[#2a2a35] opacity-20 grayscale cursor-not-allowed' : 
                      isSelected ? 'border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105' : 
                      'border-[#2a2a35] hover:border-gray-400 cursor-pointer'}
                  `}
                >
                  <div className="absolute top-0 left-0 w-full h-1 hazard-stripes opacity-70" style={{ color: card.color }} />
                  <div className="text-[10px] font-mono mb-2 px-2 py-0.5 border" style={{ color: card.color, borderColor: card.color }}>{card.type}</div>
                  <div className="font-black text-sm text-center uppercase text-white leading-tight">{card.label}</div>
                  {disabled && <Lock className="absolute text-[#ff007f] opacity-80" size={40} />}
                </button>
              );
            })}
          </div>

          {/* Info Panel Hover */}
          <div className="h-[120px] bg-[#131315] border-2 border-[#2a2a35] p-4 clip-pcb flex items-center gap-6 mt-6 shadow-2xl">
            {(hoveredCard || selectedCard) ? (
              <>
                <div className="w-16 h-16 border-2 flex items-center justify-center clip-hex shrink-0" style={{ borderColor: (hoveredCard || selectedCard).color, backgroundColor: `${(hoveredCard || selectedCard).color}20` }}>
                  <Zap style={{ color: (hoveredCard || selectedCard).color }} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{(hoveredCard || selectedCard).label}</h3>
                  <p className="text-gray-400 font-mono text-sm">{(hoveredCard || selectedCard).desc}</p>
                </div>
              </>
            ) : (
              <div className="text-gray-600 font-mono text-sm w-full text-center">HOVER OVER A CARD TO VIEW DETAILS</div>
            )}
            
            {/* LOCK IN BUTTON */}
            <button 
              onClick={handleLockIn}
              disabled={!selectedCard}
              className={`ml-auto w-[200px] h-full font-black text-xl uppercase tracking-widest clip-bevel transition-all duration-300 ${
                selectedCard ? 'bg-[#ffe600] text-[#131315] shadow-[0_0_30px_rgba(255,230,0,0.4)] hover:scale-105' : 'bg-[#18181e] text-gray-600 border-2 border-[#2a2a35] cursor-not-allowed'
              }`}
            >
              LOCK IN
            </button>
          </div>
        </div>

        {/* SIDEBAR PHẢI: USERS TEAM */}
        <div className="w-[280px] border-l-2 border-[#2a2a35] bg-[#131315] flex flex-col relative">
          <div className="absolute inset-0 bg-gradient-to-l from-[#00f3ff]/5 to-transparent pointer-events-none" />
          
          {/* Banned Cards */}
          <div className="p-4 border-b border-[#2a2a35] flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-14 h-14 bg-[#18181e] border-2 border-[#2a2a35] flex items-center justify-center clip-bevel relative opacity-50">
                {userBans[i] ? (
                  <>
                    <UserX className="text-gray-500 absolute" size={24} />
                    <div className="w-full h-0.5 bg-[#00f3ff] absolute rotate-45" />
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Picked Cards (3 Slots for 3v3) */}
          <div className="flex-1 p-4 flex flex-col gap-4">
            {[0, 1, 2].map(i => {
              const pickedCardId = userPicks[i];
              const card = USER_POOL.find(c => c.id === pickedCardId);
              const isActiveSlot = phase === 'PICK' && turn === 'USER' && userPicks.length === i;

              return (
                <div key={i} className={`flex-1 border-2 clip-pcb transition-all flex flex-col p-3 relative ${
                  card ? 'border-[#00f3ff] bg-[#00f3ff]/10 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-right items-end' :
                  isActiveSlot ? 'border-[#00f3ff] animate-pulse bg-[#18181e] items-end' : 'border-[#2a2a35] bg-[#18181e] opacity-40 items-end'
                }`}>
                  {card ? (
                    <>
                       <div className="text-[9px] font-mono text-[#00f3ff] uppercase tracking-widest mb-1">{card.type}</div>
                       <div className="font-black text-lg text-white uppercase tracking-tighter text-right">{card.label}</div>
                       <div className="absolute top-0 left-0 w-8 h-8 bg-[#00f3ff] flex items-center justify-center clip-bevel text-[#131315]">
                         <Check size={18} />
                       </div>
                    </>
                  ) : (
                    <div className="m-auto text-gray-600 font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-2">
                       <ShieldAlert size={20}/>
                       {isActiveSlot ? 'SELECTING...' : 'WAITING'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}