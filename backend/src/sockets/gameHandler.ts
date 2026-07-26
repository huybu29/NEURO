import { Server, Socket } from 'socket.io';
import { GameState, PlayerState } from '../models/GameState';

const activeGames: Record<string, GameState> = {};
let waitingSocket: Socket | null = null; 

export const gameHandler = (io: Server, socket: Socket) => {
  
  socket.on('startGame', (data: { playerName: string }) => {
    // Nếu chưa có ai đợi -> Cho vào phòng đợi
    if (!waitingSocket) {
      waitingSocket = socket;
      socket.emit('waiting', { message: 'Đang chờ đối thủ kết nối...' });
      console.log(`[MATCHMAKING] Socket ${socket.id} đang chờ...`);
      return;
    }

    // Nếu đã có người đợi -> Ghép cặp (Người đợi = USER, Người mới = FEED)
    const playerUser: PlayerState = { id: 'p1', socketId: waitingSocket.id, name: 'Player 1', type: 'USER', reality: 100, dopamine: 0, ap: 3, maxAp: 3, hand: [], board: [] };
    const playerFeed: PlayerState = { id: 'p2', socketId: socket.id, name: 'Player 2', type: 'FEED', reality: 100, dopamine: 0, ap: 3, maxAp: 5, hand: [], board: [] };
    
    const game = new GameState(playerUser, playerFeed);
    activeGames[game.roomId] = game;

    waitingSocket.join(game.roomId);
    socket.join(game.roomId);
    
    // Báo cho từng client biết họ được đóng vai gì
    io.to(waitingSocket.id).emit('gameStarted', { role: 'USER' });
    io.to(socket.id).emit('gameStarted', { role: 'FEED' });

    // Gửi state bàn cờ
    io.to(game.roomId).emit('gameStateUpdate', getClientGameState(game));
    
    // Reset phòng chờ
    waitingSocket = null;
    console.log(`[MATCHMAKING] Đã ghép trận: Phòng ${game.roomId}`);
  });

  socket.on('playUserCard', (data: { roomId: string, cardUid: string }) => {
    if(activeGames[data.roomId]) { 
      activeGames[data.roomId].playUserCard(data.cardUid); 
      io.to(data.roomId).emit('gameStateUpdate', getClientGameState(activeGames[data.roomId])); 
    }
  });

  socket.on('playFeedCard', (data: { roomId: string, cardUid: string }) => {
    if(activeGames[data.roomId]) { 
      activeGames[data.roomId].playFeedCard(data.cardUid); 
      io.to(data.roomId).emit('gameStateUpdate', getClientGameState(activeGames[data.roomId])); 
    }
  });

  socket.on('endTurn', (data: { roomId: string, role: 'USER'|'FEED' }) => {
    if(activeGames[data.roomId]) { 
      activeGames[data.roomId].endTurn(data.role); 
      io.to(data.roomId).emit('gameStateUpdate', getClientGameState(activeGames[data.roomId])); 
    }
  });

  // HÀM MỚI: Xử lý sự cố ngắt kết nối
  socket.on('disconnect', () => {
    if (waitingSocket?.id === socket.id) {
      waitingSocket = null; // Xóa khỏi hàng đợi nếu thoát lúc đang chờ
    }

    // Tìm xem người chơi thoát có đang trong phòng nào không
    for (const roomId in activeGames) {
      const game = activeGames[roomId];
      if (game.playerUser.socketId === socket.id || game.playerFeed.socketId === socket.id) {
        
        // Gửi thông báo cho người còn lại
        game.isGameOver = true;
        const winnerRole = game.playerUser.socketId === socket.id ? 'FEED' : 'USER';
        game.logs.unshift(`[LỖI MẠNG] Đối thủ đã ngắt kết nối. THE ${winnerRole} CHIẾN THẮNG.`);
        
        io.to(roomId).emit('gameStateUpdate', getClientGameState(game));
        
        // Dọn dẹp RAM server
        delete activeGames[roomId];
        console.log(`[GAME OVER] Đã xóa phòng ${roomId} do có người thoát.`);
        break;
      }
    }
  });
};

function getClientGameState(game: GameState) {
  return {
    roomId: game.roomId, 
    turn: game.turn, 
    round: game.round, 
    isGameOver: game.isGameOver, 
    winner: game.winner, 
    logs: game.logs,
    playerUser: { 
      reality: game.playerUser.reality, 
      dopamine: game.playerUser.dopamine, // Bổ sung khớp Frontend
      ap: game.playerUser.ap, 
      maxAp: game.playerUser.maxAp, 
      hand: game.playerUser.hand,
      board: game.playerUser.board // Bổ sung khớp Frontend
    },
    playerFeed: { 
      ap: game.playerFeed.ap, 
      maxAp: game.playerFeed.maxAp, 
      hand: game.playerFeed.hand, 
      board: game.playerFeed.board 
    }
  };
}