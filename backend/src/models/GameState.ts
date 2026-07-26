import { v4 as uuidv4 } from 'uuid';

// 1. DATABASE THẺ BÀI MỚI (CHUẨN CYBERPUNK / HACKING)
export const FEED_CARDS_DB = [
  { id: 'F-01', label: 'CLICKBAIT_PAYLOAD', cost: 1, heal: 0, atk: 10, effect: null, desc: 'Content rác giật tít. Gây sát thương nhẹ nhưng rút cạn sự chú ý nhanh chóng.' },
  { id: 'F-02', label: 'VISION_TRACKER', cost: 2, heal: 0, atk: 15, effect: null, desc: 'Giao thức thị giác máy tính ngầm theo dõi hành vi ánh mắt.' },
  { id: 'F-03', label: 'ECHO_CHAMBER', cost: 3, heal: 0, atk: 25, effect: null, desc: 'Giam cầm User trong buồng vang thông tin. Các dữ liệu trái chiều bị chặn.' },
  { id: 'F-04', label: 'MULTI_AGENT_SWARM', cost: 4, heal: 0, atk: 35, effect: null, desc: 'Đội quân AI Bot tự động hóa quy trình phân phối tin giả.' },
  { id: 'F-05', label: 'DOOMSCROLLING', cost: 5, heal: 0, atk: 50, effect: null, desc: 'Vòng lặp cuộn vô tận. Rút cạn sinh lực hệ thống.' }
];

export const USER_CARDS_DB = [
  { id: 'U-01', label: 'FACT-CHECK.exe', cost: 1, heal: 15, atk: 0, effect: null, desc: 'Quét dữ liệu rác sơ bộ. Khôi phục Thực Tại.' },
  { id: 'U-02', label: 'BINARY_FILTER', cost: 2, heal: 25, atk: 0, effect: null, desc: 'Lọc thông tin nhiễu loạn theo cấu trúc cây nhị phân.' },
  { id: 'U-03', label: 'JWT_AUTH_BLOCK', cost: 2, heal: 0, atk: 0, effect: 'DESTROY', desc: 'Từ chối quyền và tiêu diệt 1 Malware trên hệ thống.' },
  { id: 'U-04', label: 'SONAR_PURGE', cost: 3, heal: 0, atk: 0, effect: 'DESTROY', desc: 'Chạy phân tích mã tĩnh toàn diện. Xóa bỏ 1 Malware mạnh nhất.' },
  { id: 'U-05', label: 'MINDFULNESS_API', cost: 4, heal: 40, atk: 0, effect: null, desc: 'Đưa hệ thống về trạng thái cân bằng tuyệt đối.' }
];

// 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU RÕ RÀNG HƠN
export type Card = { 
  uid: string; 
  id: string; 
  label: string; 
  cost: number; 
  desc: string;
  atk?: number; 
  heal?: number;
  effect?: string | null; 
};

export type PlayerState = { 
  id: string; 
  socketId: string; 
  name: string; 
  type: 'FEED' | 'USER'; 
  reality: number; 
  dopamine: number; 
  ap: number; 
  maxAp: number; 
  hand: Card[]; 
  board: Card[]; 
};

// 3. LOGIC GAME ĐÃ ĐƯỢC TINH CHỈNH
export class GameState {
  roomId: string; 
  turn: 'FEED' | 'USER'; 
  round: number; 
  isGameOver: boolean; 
  logs: string[]; 
  winner?: string;
  playerUser: PlayerState; 
  playerFeed: PlayerState;

  constructor(player1: PlayerState, player2: PlayerState) {
    this.roomId = uuidv4(); 
    this.round = 1; 
    this.isGameOver = false; 
    
    // Đảm bảo lượt đầu tiên là của THE FEED
    this.turn = 'FEED'; 
    this.logs = ['[SYS_BOOT] Kết nối thành công. Lượt đầu: ALGORITHM (FEED).'];
    
    this.playerUser = player1; 
    this.playerFeed = player2;

    // Rút 3 lá bài khởi đầu cho mỗi bên
    this.drawCards(this.playerUser, USER_CARDS_DB, 3);
    this.drawCards(this.playerFeed, FEED_CARDS_DB, 3);
  }

  // Rút bài có giới hạn số lượng trên tay (Tối đa 5 lá)
  private drawCards(player: PlayerState, db: any[], count: number) {
    for (let i = 0; i < count; i++) {
        if (player.hand.length >= 5) break; 
        const randomCard = db[Math.floor(Math.random() * db.length)];
        player.hand.push({ ...randomCard, uid: uuidv4() });
    }
  }

  playUserCard(cardUid: string) {
    if (this.turn !== 'USER' || this.isGameOver) return;
    
    const idx = this.playerUser.hand.findIndex(c => c.uid === cardUid);
    if (idx === -1) return;
    
    const card = this.playerUser.hand[idx];
    if (this.playerUser.ap < card.cost) return;

    if (card.heal) {
      this.playerUser.reality = Math.min(100, this.playerUser.reality + card.heal);
      this.logs.unshift(`[USER_CMD] Thực thi ${card.label}. Khôi phục ${card.heal} Reality.`);
    } else if (card.effect === 'DESTROY' && this.playerFeed.board.length > 0) {
      // Sắp xếp để ưu tiên tiêu diệt thẻ có sức tấn công (ATK) cao nhất của địch
      this.playerFeed.board.sort((a, b) => (b.atk || 0) - (a.atk || 0));
      const destroyed = this.playerFeed.board.shift();
      this.logs.unshift(`[USER_CMD] Thực thi ${card.label}. Tiêu diệt mã độc [${destroyed?.label}].`);
    } else {
      // Nếu đánh thẻ DESTROY nhưng bàn địch đang trống -> Cảnh báo và không trừ AP
      this.logs.unshift(`[LỖI] Không tìm thấy mục tiêu khả thi cho lệnh ${card.label}.`);
      return; 
    }

    this.playerUser.ap -= card.cost; 
    this.playerUser.hand.splice(idx, 1);
  }

  playFeedCard(cardUid: string) {
    if (this.turn !== 'FEED' || this.isGameOver) return;
    
    // Giới hạn bàn cờ tối đa 5 mã độc (Phù hợp với UI 5 ô trên Frontend)
    if (this.playerFeed.board.length >= 5) {
        this.logs.unshift(`[SYS_WARN] Timeline đã đầy, không thể chứa thêm mã độc.`);
        return;
    }

    const idx = this.playerFeed.hand.findIndex(c => c.uid === cardUid);
    if (idx === -1) return;
    
    const card = this.playerFeed.hand[idx];
    if (this.playerFeed.ap < card.cost) return;

    this.playerFeed.ap -= card.cost;
    this.playerFeed.board.push(card);
    this.playerFeed.hand.splice(idx, 1);
    this.logs.unshift(`[ALGORITHM] Tung mã độc [${card.label}] vào Timeline.`);
  }

  endTurn(requestType: 'USER' | 'FEED') {
    if (this.isGameOver || this.turn !== requestType) return;

    if (this.turn === 'USER') {
      // 1. Kết thúc lượt của USER -> Chuyển sang FEED
      this.turn = 'FEED';
      this.playerFeed.maxAp = Math.min(10, this.playerFeed.maxAp + 1);
      this.playerFeed.ap = this.playerFeed.maxAp;
      this.drawCards(this.playerFeed, FEED_CARDS_DB, 1);
      this.logs.unshift(`[SYS_LOG] Chuyển giao quyền điều khiển cho ALGORITHM.`);
    } else {
      // 2. Kết thúc lượt của FEED -> TÍNH SÁT THƯƠNG TỪ BÀN CỜ VÀO USER
      let totalDmg = this.playerFeed.board.reduce((dmg, card) => dmg + (card.atk || 0), 0);
      
      if (totalDmg > 0) {
        this.playerUser.reality -= totalDmg;
        this.logs.unshift(`[CẢNH BÁO] Mã độc trên Timeline gây ${totalDmg} Sát thương hệ thống!`);
      }
      
      if (this.playerUser.reality <= 0) {
        this.isGameOver = true; 
        this.winner = 'FEED';
        this.logs.unshift(`[CRITICAL_FAILURE] Hệ thống sụp đổ. THE FEED WIN.`);
        return;
      }
      
      // Chuyển sang USER
      this.turn = 'USER'; 
      this.round++;
      this.playerUser.maxAp = Math.min(10, this.playerUser.maxAp + 1);
      this.playerUser.ap = this.playerUser.maxAp;
      this.drawCards(this.playerUser, USER_CARDS_DB, 1);
      this.logs.unshift(`[SYS_LOG] ROUND ${this.round}. Trả quyền điều khiển cho USER.`);
    }
  }
}