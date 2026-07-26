import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Terminal, ShieldCheck, Skull, Activity, Zap, Server, Crosshair, Info, BrainCircuit, ShieldAlert, Trophy, AlertTriangle, RefreshCw, HelpCircle, X } from 'lucide-react';

interface BackendGameState {
  roomId: string;
  turn: 'FEED' | 'USER';
  round: number;
  isGameOver: boolean;
  winner?: string; 
  logs: string[];
  playerUser: { reality: number; dopamine: number; ap: number; maxAp: number; hand: any[]; board: any[] };
  playerFeed: { ap: number; maxAp: number; hand: any[]; board: any[] };
}

export default function PvPNetworkDemo() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<BackendGameState | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [myRole, setMyRole] = useState<'USER' | 'FEED' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<any | null>(null);
  
  // State hiển thị màn hình Hướng dẫn
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);
    
    newSocket.on('waiting', () => setIsWaiting(true));
    newSocket.on('gameStarted', (data: { role: 'USER' | 'FEED' }) => { setIsWaiting(false); setMyRole(data.role); });
    newSocket.on('gameStateUpdate', (newGameState: BackendGameState) => setGameState(newGameState));
    
    return () => { newSocket.disconnect(); };
  }, []);

  const handleStartGame = () => socket?.emit('startGame', { playerName: 'Player' });
  const handleEndTurn = () => socket?.emit('endTurn', { roomId: gameState?.roomId, role: myRole });
  const handlePlayUserCard = (cardUid: string) => socket?.emit('playUserCard', { roomId: gameState?.roomId, cardUid });
  const handlePlayFeedCard = (cardUid: string) => socket?.emit('playFeedCard', { roomId: gameState?.roomId, cardUid });

  const handleReturnMenu = () => {
    window.location.reload(); 
  };

  // ==========================================
  // COMPONENT HƯỚNG DẪN CHƠI (TUTORIAL MODAL)
  // ==========================================
  const TutorialModal = () => (
    <div className="absolute inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#131315] border-2 border-[#00f3ff] p-6 md:p-8 flex flex-col shadow-[0_0_30px_rgba(0,243,255,0.2)] max-h-[90vh] overflow-hidden">
        
        {/* Nút Đóng */}
        <button onClick={() => setShowTutorial(false)} className="absolute top-4 right-4 text-gray-500 hover:text-[#ff007f] transition-colors z-10">
          <X size={24} />
        </button>

        <h2 className="text-2xl md:text-3xl font-black text-[#00f3ff] uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-[#2a2a35] pb-4">
          <HelpCircle size={28} /> TÀI LIỆU HƯỚNG DẪN (OS_MANUAL)
        </h2>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6 text-sm text-gray-300 font-mono leading-relaxed">
          
          {/* Cốt truyện cơ bản */}
          <section>
            <h3 className="text-[#ffe600] font-bold mb-2 flex items-center gap-2">/// TỔNG QUAN</h3>
            <p>Trận chiến mạng giữa 2 phe: <span className="text-[#00f3ff] font-bold">THE USER (Người Dùng)</span> và <span className="text-[#ff007f] font-bold">THE FEED (Thuật Toán)</span>. Mỗi bên sẽ dùng Năng lượng (AP) để tung thẻ bài nhằm đạt được mục đích của mình.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phe THE FEED */}
            <section className="bg-[#1a1a24] p-4 border border-[#ff007f]/30 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff007f] opacity-50" />
              <h3 className="text-[#ff007f] font-black uppercase mb-2 flex items-center gap-2"><Server size={16}/> Phe: THE FEED</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-white">Mục tiêu:</strong> Trừ sạch điểm Thực Tại (Reality) của User về 0.</li>
                <li><strong className="text-white">Cách đánh:</strong> Thả thẻ bài <span className="text-[#ff007f]">Mã Độc (Malware)</span> xuống Timeline.</li>
                <li><strong className="text-white">Cơ chế sát thương:</strong> Mỗi khi Feed bấm <span className="bg-[#222] px-1">END_TURN</span>, TẤT CẢ mã độc đang có trên Timeline sẽ tự động cắn máu của User.</li>
              </ul>
            </section>

            {/* Phe THE USER */}
            <section className="bg-[#1a1a24] p-4 border border-[#00f3ff]/30 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00f3ff] opacity-50" />
              <h3 className="text-[#00f3ff] font-black uppercase mb-2 flex items-center gap-2"><ShieldCheck size={16}/> Phe: THE USER</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-white">Mục tiêu:</strong> Sinh tồn. Giữ thanh Thực Tại (Reality) lớn hơn 0 lâu nhất có thể.</li>
                <li><strong className="text-white">Cách đánh:</strong> Sử dụng bài <span className="text-[#00f3ff]">Lệnh (Command)</span> ngay từ trên tay.</li>
                <li><strong className="text-white">Loại bài:</strong> Có 2 loại lệnh: <span className="text-[#00cc66]">HEAL (Hồi Thực Tại)</span> và <span className="text-[#ffe600]">DESTROY (Xóa mã độc mạnh nhất trên bàn)</span>.</li>
              </ul>
            </section>
          </div>

          {/* Cơ chế chung */}
          <section>
            <h3 className="text-[#ffe600] font-bold mb-2 flex items-center gap-2">/// LƯU Ý HỆ THỐNG</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">Action Points (AP):</strong> Năng lượng dùng để đánh bài. Điểm AP tối đa sẽ tăng thêm 1 sau mỗi vòng lặp (Tối đa 10 AP).</li>
              <li><strong className="text-white">DATA INSPECTOR:</strong> Nếu không hiểu tác dụng của lá bài, hãy <span className="text-[#00f3ff]">di chuột (hover)</span> vào nó. Bảng Inspector bên phải sẽ phân tích chi tiết.</li>
              <li><strong className="text-white">Thứ tự đánh:</strong> Thuật toán (THE FEED) luôn được đi trước.</li>
            </ul>
          </section>

          {/* CÁCH TEST CHẾ ĐỘ */}
          <section className="bg-[#ffe600]/10 p-4 border border-[#ffe600]/50 relative">
            <h3 className="text-[#ffe600] font-black uppercase mb-3 flex items-center gap-2">
              <Zap size={18} className="animate-pulse" /> HƯỚNG DẪN TEST CHẾ ĐỘ (LOCAL DEMO)
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-200">
              <li>Mở ứng dụng trên <strong>2 Tab trình duyệt</strong> (Có thể mở 1 tab thường và 1 tab Ẩn danh).</li>
              <li>Tại cả 2 Tab, chọn chế độ <span className="text-[#a200ff] font-bold">ALGORITHM DRAFT</span> và bấm nút <span className="bg-[#111] px-2 py-1 border border-[#00f3ff] text-[#00f3ff] font-bold text-xs ml-1">INITIATE_LINK</span>.</li>
              <li>Hệ thống sẽ tự động ghép cặp 2 tab với nhau:
                <ul className="list-[circle] list-inside ml-6 mt-1 text-[#00f3ff]">
                  <li>Người bấm trước sẽ cầm phe <strong>THE USER</strong> (Phòng thủ).</li>
                  <li>Người bấm sau sẽ cầm phe <strong>THE FEED</strong> (Tấn công).</li>
                </ul>
              </li>
              <li>Thu nhỏ 2 tab cạnh nhau để trải nghiệm luồng đánh thẻ bài và chuyển lượt theo thời gian thực (Real-time).</li>
            </ol>
          </section>

        </div>
      </div>
    </div>
  );

  // MÀN HÌNH CHỜ (WAITING ROOM)
  if (isWaiting) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#131315] text-[#00f3ff] font-['Space_Grotesk'] w-full h-full relative">
      {showTutorial && <TutorialModal />}
      <Terminal size={48} className="animate-pulse mb-4 text-[#ff007f]" />
      <h2 className="text-xl font-bold tracking-widest">AWAITING_CONNECTION...</h2>
      <p className="text-gray-500 mt-2 text-[10px] font-mono">Đang tìm đối thủ trong mạng lưới...</p>
      
      <button onClick={() => setShowTutorial(true)} className="mt-8 px-4 py-2 border border-[#00f3ff]/50 text-[#00f3ff]/70 font-mono text-xs hover:bg-[#00f3ff]/10 hover:text-[#00f3ff] flex items-center gap-2 transition-all">
        <HelpCircle size={14} /> XEM HƯỚNG DẪN TEST
      </button>
    </div>
  );

  // MÀN HÌNH BẮT ĐẦU (START MENU)
  if (!gameState || !myRole) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#131315] text-[#00f3ff] font-['Space_Grotesk'] w-full h-full relative overflow-hidden">
      {showTutorial && <TutorialModal />}
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      <h1 className="text-5xl font-black mb-2 tracking-tighter z-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">NEURO<span className="text-[#ff007f]">FEED</span></h1>
      <p className="text-gray-400 font-mono tracking-[0.3em] mb-12 z-10 text-xs">TACTICAL_OS v3.5</p>
      
      <div className="flex gap-4 z-10">
        <button onClick={() => setShowTutorial(true)} className="px-6 py-3 bg-[#131315] border border-gray-600 text-gray-400 font-bold uppercase hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2">
          <HelpCircle size={18} /> OS_MANUAL
        </button>

        <button onClick={handleStartGame} className="px-8 py-3 bg-[#111] border border-[#00f3ff] text-[#00f3ff] font-bold uppercase hover:bg-[#00f3ff] hover:text-[#000] shadow-[0_0_15px_rgba(0,243,255,0.2)] flex items-center gap-2 transition-colors">
          <Terminal size={18} /> INITIATE_LINK
        </button>
      </div>
    </div>
  );

  const isUser = myRole === 'USER';
  const isMyTurn = gameState.turn === myRole;
  const hand = isUser ? gameState.playerUser.hand : gameState.playerFeed.hand;
  
  const myAp = isUser ? gameState.playerUser.ap : gameState.playerFeed.ap;
  const myMaxAp = isUser ? gameState.playerUser.maxAp : gameState.playerFeed.maxAp;
  const myApColor = isUser ? 'bg-[#ffe600] border-[#ffe600]' : 'bg-[#ff007f] border-[#ff007f]';

  const oppAp = isUser ? gameState.playerFeed.ap : gameState.playerUser.ap;
  const oppMaxAp = isUser ? gameState.playerFeed.maxAp : gameState.playerUser.maxAp;
  const oppHand = isUser ? gameState.playerFeed.hand : gameState.playerUser.hand;
  const oppLabel = isUser ? 'SYS.ALGORITHM_LOAD' : 'USER.FOCUS_LOAD';
  const oppColor = isUser ? 'text-[#ff007f]' : 'text-[#00f3ff]';
  const oppBorder = isUser ? 'border-[#ff007f]' : 'border-[#00f3ff]';
  const oppBg = isUser ? 'bg-[#ff007f]' : 'bg-[#00f3ff]';
  const OppIcon = isUser ? Server : ShieldCheck;

  const hpPercent = (gameState.playerUser.reality / 100) * 100;
  const hpColor = hpPercent > 50 ? 'bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]' : hpPercent > 20 ? 'bg-[#ffe600] shadow-[0_0_15px_#ffe600]' : 'bg-[#ff007f] shadow-[0_0_15px_#ff007f]';

  const isVictory = gameState.winner === myRole;

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-[#131315] font-['Space_Grotesk'] overflow-hidden text-gray-300 select-none flex flex-col border-2 border-[#2a2a35]">
      
      {showTutorial && <TutorialModal />}

      <style dangerouslySetInnerHTML={{__html: `
        .scanlines { background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2)); background-size: 100% 4px; pointer-events: none; }
        .clip-bevel { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
        .clip-pcb-lg { clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px); }
        .clip-tcb-card { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .clip-tcb-cost { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%); }
        .clip-tcb-textbox { clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px); }
        .hazard-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px); }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00f3ff; }
      `}} />
      <div className="absolute inset-0 scanlines z-[100]" />

      {/* ==========================================
          MÀN HÌNH GAME OVER (OVERLAY)
          ========================================== */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
           <div className={`relative w-full max-w-2xl bg-[#131315]/90 border-[3px] p-10 clip-pcb-lg flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]
               ${isVictory ? 'border-[#00f3ff]' : 'border-[#ff007f]'}`}>
              
              <div className={`absolute top-0 left-0 w-full h-2 hazard-stripes opacity-50 ${isVictory ? 'text-[#00f3ff]' : 'text-[#ff007f]'}`} />
              
              {isVictory ? (
                <Trophy size={64} className="text-[#00f3ff] drop-shadow-[0_0_15px_#00f3ff] mb-4" />
              ) : (
                <Skull size={64} className="text-[#ff007f] drop-shadow-[0_0_15px_#ff007f] mb-4" />
              )}
              
              <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 ${isVictory ? 'text-[#00f3ff]' : 'text-[#ff007f]'}`}>
                 {isVictory ? 'VICTORY_ACHIEVED' : 'SYSTEM_COMPROMISED'}
              </h2>
              
              <p className="text-gray-400 font-mono text-sm mb-8">
                 {isVictory 
                   ? (isUser ? 'Bạn đã bảo vệ thành công Thực Tại khỏi thuật toán.' : 'Thuật toán đã thao túng thành công Tâm trí người dùng.')
                   : (isUser ? 'Tâm trí đã bị thuật toán chiếm quyền điều khiển.' : 'Thuật toán thất bại trong việc thao túng người dùng.')}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                <div className="bg-[#0f1117] border border-[#2a2a35] p-3 clip-bevel">
                  <div className="text-[10px] text-gray-500 font-mono mb-1">VÒNG LẶP (ROUNDS)</div>
                  <div className="text-2xl font-black text-white">{gameState.round}</div>
                </div>
                <div className="bg-[#0f1117] border border-[#2a2a35] p-3 clip-bevel">
                  <div className="text-[10px] text-gray-500 font-mono mb-1">THỰC TẠI CÒN LẠI</div>
                  <div className={`text-2xl font-black ${gameState.playerUser.reality > 0 ? 'text-[#00f3ff]' : 'text-[#ff007f]'}`}>{gameState.playerUser.reality}</div>
                </div>
              </div>

              <button onClick={handleReturnMenu} className={`group relative px-10 py-4 bg-[#111] border-2 font-black uppercase tracking-widest transition-all clip-bevel flex items-center gap-3
                  ${isVictory ? 'border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-[#111]' : 'border-[#ff007f] text-[#ff007f] hover:bg-[#ff007f] hover:text-[#111]'}`}>
                 <RefreshCw size={18} className="group-hover:animate-spin" /> DISCONNECT_AND_REBOOT
              </button>
           </div>
        </div>
      )}

      {/* GIAO DIỆN CHÍNH CỦA GAME */}
      <div className={`flex flex-1 overflow-hidden relative z-10 ${gameState.isGameOver || showTutorial ? 'blur-sm grayscale opacity-50 pointer-events-none' : ''}`}>
        
        {/* ==========================================
            CỘT TRÁI: KHU VỰC CHIẾN TRƯỜNG & TAY BÀI
            ========================================== */}
        <div className="flex-1 flex flex-col border-r-2 border-[#2a2a35] overflow-hidden">
          
          {/* ----- TOP HUD: ĐỐI THỦ ----- */}
          <div className="h-[70px] bg-[#1a1a24] border-b-2 border-[#2a2a35] px-4 flex justify-between items-center relative shrink-0">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[${oppColor}] to-transparent opacity-50`} />
            <div className="flex items-center gap-3">
              <OppIcon className={oppColor} size={24} />
              <div>
                <div className={`text-[9px] ${oppColor} font-bold tracking-widest uppercase font-mono`}>{oppLabel}</div>
                <div className="text-2xl font-black text-white">{oppAp}<span className="text-xs text-gray-500 font-mono">/{oppMaxAp} THREADS</span></div>
              </div>
            </div>
            
            <div className="flex gap-1.5">
               {oppHand.map((_, idx) => (
                 <div key={idx} className={`w-[35px] h-[50px] border ${oppBorder}/40 ${oppBg}/5 clip-tcb-card flex items-center justify-center relative`}>
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,currentColor,currentColor_4px,transparent_4px,transparent_8px)]" style={{ color: isUser ? '#ff007f' : '#00f3ff' }} />
                 </div>
               ))}
            </div>
          </div>

          {/* ----- MIDDLE: SÀN ĐẤU MÃ ĐỘC ----- */}
          <div className="flex-1 bg-[#131315] relative flex flex-col justify-center p-6 overflow-y-auto custom-scrollbar">
             {gameState.playerFeed.board.length === 0 && (
               <div className="text-center text-[10px] text-gray-600 font-mono">Không có mã độc nào đang hoạt động.</div>
             )}

             <div className="flex flex-wrap justify-center gap-4">
               {gameState.playerFeed.board.map((card) => (
                 <div key={card.uid} 
                      className="group relative min-w-[130px] w-[130px] h-[180px] bg-[#15171e] text-center p-2 flex flex-col justify-between border-2 border-[#ff007f]/70 clip-tcb-card shadow-[0_0_15px_rgba(255,0,127,0.2)] hover:-translate-y-1 cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredCard(card)} onMouseLeave={() => setHoveredCard(null)}>
                    
                    <div className="absolute top-0 left-0 bg-[#ff007f] text-[#131315] font-black font-mono text-xs w-6 h-6 flex items-center justify-center clip-tcb-cost shadow-[0_0_10px_#ff007f] z-20">
                      {card.cost}
                    </div>
                    
                    <div className="flex flex-col items-center flex-1 w-full pt-6 z-10 overflow-hidden">
                      <div className="font-black text-[9px] uppercase mb-1.5 px-1 py-0.5 break-words leading-tight tracking-wider w-full bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/40">
                        {card.label}
                      </div>
                      <Skull size={26} className="text-[#ff007f] drop-shadow-[0_0_4px_#ff007f] my-1" />
                      <div className="text-[10px] font-mono text-gray-300 leading-[1.2] px-1 py-1 bg-[#0f1117] border border-[#ff007f]/30 clip-tcb-textbox font-semibold w-full flex-1 flex flex-col items-center justify-center">
                        <span className="text-[#ff007f] text-[8px] mb-1">SÁT THƯƠNG</span>
                        <span className="text-xl font-black text-white">{card.atk}</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* ----- BOTTOM: KHU VỰC CỦA BẠN & TAY BÀI ----- */}
          <div className="h-[240px] bg-[#1a1a24] border-t-2 border-[#2a2a35] p-3 flex flex-col shrink-0">
            
            <div className="flex justify-between items-end mb-3 border-b-2 border-[#2a2a35] pb-2 px-2">
              <div>
                <div className="text-[9px] text-[#00f3ff] font-bold tracking-widest uppercase mb-1 flex items-center gap-1 font-mono">
                  {isUser ? <ShieldCheck size={10}/> : <ShieldAlert size={10} className="text-[#ff007f]" />}
                  {isUser ? 'SYS_STABILITY (YOUR DEFENSE)' : 'USER REALITY (YOUR TARGET)'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">{gameState.playerUser.reality}</div>
                  <div className="w-[120px] bg-[#1e1e24] h-2.5 p-0.5 border-2 border-[#2a2a35] relative">
                      <div className={`${hpColor} h-full transition-all duration-500`} style={{width: `${hpPercent}%`}} />
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                 <div className={`text-[9px] ${isUser ? 'text-[#ffe600]' : 'text-[#ff007f]'} font-bold tracking-widest uppercase mb-1 flex items-center gap-1 justify-end font-mono`}><Zap size={10}/> ACTION_POINTS</div>
                 <div className="flex items-center gap-1.5 justify-end">
                    <div className="text-2xl font-black text-white mr-1">{myAp}</div>
                    {Array.from({length: myMaxAp}).map((_, i) => (
                      <div key={i} className={`w-4 h-6 clip-bevel border-2 transition-all ${i < myAp ? myApColor : 'bg-transparent border-[#444]'}`} />
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center gap-3 items-center overflow-x-auto custom-scrollbar pb-1">
              {hand.map((card) => {
                const canPlay = isMyTurn && myAp >= card.cost;
                const isHeal = (card.heal || 0) > 0;
                
                const bdColor = canPlay ? (isUser ? 'border-[#00f3ff]/70 hover:border-[#00f3ff]' : 'border-[#ff007f]/70 hover:border-[#ff007f]') : 'border-[#2a2a35]';
                const shHover = canPlay ? (isUser ? 'shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'shadow-[0_0_15px_rgba(255,0,127,0.2)]') : '';
                const bgBadge = isUser ? 'bg-[#00f3ff]' : 'bg-[#ff007f]';
                const shCost  = isUser ? 'shadow-[0_0_10px_#00f3ff]' : 'shadow-[0_0_10px_#ff007f]';
                const tlBg    = isUser ? 'bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/40' : 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]/40';

                return (
                  <button 
                    key={card.uid}
                    onMouseEnter={() => setHoveredCard(card)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => {
                      if (!canPlay) return;
                      isUser ? handlePlayUserCard(card.uid) : handlePlayFeedCard(card.uid);
                    }}
                    className={`group relative min-w-[130px] w-[130px] h-[175px] bg-[#15171e] text-center p-2 flex flex-col justify-between border-2 transition-all duration-300 clip-tcb-card shrink-0
                      ${canPlay ? `${bdColor} hover:-translate-y-3 hover:bg-[#1a1d26] ${shHover} cursor-pointer` : 'border-[#2a2a35] opacity-50 cursor-not-allowed'}`}
                  >
                    <div className={`absolute top-0 left-0 ${bgBadge} text-[#131315] font-black font-mono text-xs w-7 h-7 flex items-center justify-center clip-tcb-cost ${shCost} z-20`}>
                      {card.cost}
                    </div>
                    
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${bgBadge} text-[#131315] text-[9px] font-black tracking-widest px-3 py-0.5 clip-bevel z-10 uppercase`}>
                      {isUser ? 'COMMAND' : 'MALWARE'}
                    </div>

                    <div className="flex flex-col items-center flex-1 w-full pt-5 z-10 overflow-hidden">
                      <div className={`font-black text-[9px] uppercase mb-1.5 px-1 py-0.5 break-words leading-tight tracking-wider w-full transition-colors shrink-0 border ${canPlay ? tlBg : 'text-gray-500 border-[#2a2a35]'}`}>
                        {card.label}
                      </div>
                      
                      {isUser ? (
                        isHeal ? <Activity size={22} className={`my-1 shrink-0 ${canPlay ? 'text-[#00cc66]' : 'text-gray-500'}`} /> : <Crosshair size={22} className={`my-1 shrink-0 ${canPlay ? 'text-[#ffe600]' : 'text-gray-500'}`} />
                      ) : (
                        <Skull size={22} className={`my-1 shrink-0 ${canPlay ? 'text-[#ff007f]' : 'text-gray-500'}`} />
                      )}
                      
                      <div className="text-[9px] font-mono text-gray-300 bg-[#0f1117] border border-[#2a2a35] clip-tcb-textbox font-semibold w-full flex-1 flex flex-col items-center justify-center px-1">
                        {isUser ? (
                          <div>{card.effect === 'DESTROY' ? 'Tiêu diệt 1 Mã độc' : `Hồi phục ${card.heal} Reality`}</div>
                        ) : (
                          <>
                            <span className={`${canPlay ? 'text-[#ff007f]' : 'text-gray-500'} text-[8px] mb-0.5`}>SÁT THƯƠNG</span>
                            <span className="text-sm font-black text-white">{card.atk}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            CỘT PHẢI: BẢNG KIỂM TRA (INSPECTOR)
            ========================================== */}
        <div className="w-[280px] bg-[#131315] flex flex-col relative z-20 border-l-2 border-[#2a2a35] shrink-0">

          <div className="flex flex-row items-center justify-between p-3 border-b-2 border-[#2a2a35] bg-[#1a1a24]">
             <div className="text-[9px] text-gray-500 font-bold tracking-widest flex items-center gap-1 font-mono"><Info size={10}/> DATA_INSPECTOR</div>
             <button onClick={() => setShowTutorial(true)} className="text-[#00f3ff] hover:text-white transition-colors bg-[#00f3ff]/10 p-1 rounded">
               <HelpCircle size={14} />
             </button>
          </div>

          <div className="flex-1 p-4 flex flex-col border-b-2 border-[#2a2a35]">
             {hoveredCard ? (
               <div className="flex-1 flex flex-col animate-fade-in">
                 <div className={`text-xl font-black uppercase leading-tight mb-2 ${hoveredCard.atk ? 'text-[#ff007f]' : 'text-[#00f3ff]'}`}>
                   {hoveredCard.label}
                 </div>
                 <div className="flex gap-2 mb-4 border-b border-[#2a2a35] pb-2">
                   <span className="text-[9px] font-black bg-[#222] px-2 py-1 rounded text-white flex items-center gap-1">
                     <Zap size={10} className="text-[#ffe600]"/> COST: {hoveredCard.cost}
                   </span>
                 </div>
                 <div className="p-3 bg-[#111] border-l-2 border-[#00f3ff] text-[11px] text-gray-300 font-mono leading-relaxed min-h-[90px]">
                   {hoveredCard.desc}
                 </div>
                 
                 <div className="mt-auto flex justify-between items-end border-t border-[#2a2a35] pt-3">
                    {hoveredCard.atk && <span className="text-lg font-black text-[#111] bg-[#ff007f] px-2 py-0.5 clip-bevel">ATK: {hoveredCard.atk}</span>}
                    {hoveredCard.heal && <span className="text-lg font-black text-[#111] bg-[#00f3ff] px-2 py-0.5 clip-bevel">HEAL: {hoveredCard.heal}</span>}
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-center">
                 <span className="text-[10px] text-gray-600 font-mono border border-dashed border-[#2a2a35] p-4 bg-[#1a1a24]">
                   DI CHUỘT VÀO THẺ BÀI ĐỂ PHÂN TÍCH CHUYÊN SÂU
                 </span>
               </div>
             )}
          </div>

          <div className="p-4 flex flex-col justify-center items-center gap-3 bg-[#1a1a24]">
             <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase font-mono">ROUND: {gameState.round}</div>
             
             <div className={`text-[10px] font-black px-4 py-1.5 border w-full text-center clip-bevel ${
               gameState.turn === 'USER' ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10' : 'border-[#ff007f] text-[#ff007f] bg-[#ff007f]/10'
             }`}>
               {gameState.turn === 'USER' ? 'USER HAS CONTROL' : 'ALGORITHM IS PROCESSING'}
             </div>

             <button onClick={handleEndTurn} disabled={!isMyTurn}
               className={`w-full py-3 mt-1 text-[10px] font-black uppercase tracking-widest transition-all clip-bevel shadow-md ${
                 isMyTurn
                   ? 'bg-[#ffe600] text-[#131315] hover:bg-white shadow-[0_0_10px_rgba(255,230,0,0.4)]'
                   : 'bg-[#111] border border-[#2a2a35] text-gray-600 cursor-not-allowed'
               }`}>
               {isMyTurn ? 'END_TURN' : 'WAITING_SYNC...'}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}