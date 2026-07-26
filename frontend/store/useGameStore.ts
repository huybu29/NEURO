import { create } from 'zustand';
import { PLAYER_CARDS, initialWeights } from '@/constants/gameData';

const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

interface GameState {
  screen: 'intro' | 'game' | 'end';
  round: number;
  maxRound: number;
  reality: number; realityMax: number;
  dopamine: number; dopamineMax: number;
  ap: number; apMax: number;
  focus: number; focusMax: number;
  weights: any;
  deck: string[]; hand: string[]; discard: string[];
  history: any[];
  currentCard: any;
  maxHandSize: number;
  // --- TRẠNG THÁI ANIMATION & AUTO-PILOT ---
  cardFlipId: number;
  isClashing: boolean;
  floatingDeltas: Array<{ id: string; text: string; color: string; offset: number }>;
  consecutiveDopamineHits: number;
  isAutoPilot: boolean;
  wakeUpClicks: number;

  // --- TRẠNG THÁI HIỆU ỨNG THẺ BÀI MỚI ---
  cardsPlayedThisTurn: number;
  apDiscountTurns: number;
  dopamineResistTurns: number;
  preventShadowLearning: number;
  skipNextFeed: boolean;
  lastPlayedCard: string | null;
  mutedDomains: Record<string, number>;
  
  // --- ACTIONS ---
  startGame: () => void;
  playCard: (cardId: string, handIndex: number) => void;
  generateNextCard: (round: number, weights: any) => void;
  restart: () => void;
  setScreen: (screen: 'intro' | 'game' | 'end') => void;
  clickWakeUp: () => void;
  skipTurn: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'intro',
  round: 1, maxRound: 10,
  reality: 80, realityMax: 100,
  dopamine: 20, dopamineMax: 100,
  ap: 4, apMax: 4,
  focus: 2, focusMax: 5,
  weights: { ...initialWeights },
  deck: [], hand: [], discard: [], history: [],
  currentCard: null,
  maxHandSize: 5,
  cardFlipId: 0,
  isClashing: false,
  floatingDeltas: [],
  consecutiveDopamineHits: 0,
  isAutoPilot: false,
  wakeUpClicks: 0,

  cardsPlayedThisTurn: 0,
  apDiscountTurns: 0,
  dopamineResistTurns: 0,
  preventShadowLearning: 0,
  skipNextFeed: false,
  lastPlayedCard: null,
  mutedDomains: {},

  setScreen: (screen) => set({ screen }),
  restart: () => set({ screen: 'intro', currentCard: null }),

  clickWakeUp: () => {
    const { wakeUpClicks, focus } = get();
    if (wakeUpClicks + 1 >= 10) {
      set({ isAutoPilot: false, wakeUpClicks: 0, focus: Math.max(0, focus - 1) });
    } else {
      set({ wakeUpClicks: wakeUpClicks + 1 });
    }
  },

  generateNextCard: (round, weights) => {
    const state = get();
    
    // Xử lý đếm ngược các hiệu ứng theo Turn
    const newApDiscount = Math.max(0, state.apDiscountTurns - 1);
    const newDopamineResist = Math.max(0, state.dopamineResistTurns - 1);
    const newPreventLearning = Math.max(0, state.preventShadowLearning - 1);
    
    const newMuted = { ...state.mutedDomains };
    Object.keys(newMuted).forEach(k => {
      newMuted[k] -= 1;
      if (newMuted[k] <= 0) delete newMuted[k];
    });

    set({ 
      cardsPlayedThisTurn: 0, 
      apDiscountTurns: newApDiscount,
      dopamineResistTurns: newDopamineResist,
      preventShadowLearning: newPreventLearning,
      mutedDomains: newMuted
    });

    // Nếu có hiệu ứng Reverse Image -> Skip đòn tấn công của Feed
    if (state.skipNextFeed) {
      set({ skipNextFeed: false });
    }

    const total = Object.values(weights).reduce((a: any, b: any) => a + b, 0) as number;
    let r = Math.random() * total;
    let selectedDomain = Object.keys(weights)[0];
    
    // Loại bỏ các Domain đang bị Mute
    const availableDomains = Object.keys(weights).filter(k => !newMuted[k]);
    if (availableDomains.length > 0) {
      let filteredTotal = availableDomains.reduce((a, b) => a + weights[b], 0);
      let rFiltered = Math.random() * filteredTotal;
      for (const k of availableDomains) { 
        rFiltered -= weights[k]; 
        if (rFiltered <= 0) { selectedDomain = k; break; } 
      }
    }

    const pool = ['similar', 'emotional', 'urgency', 'social', 'celebrity'];
    const selectedMech = pool[Math.floor(Math.random() * pool.length)];

    set(s => ({ 
      currentCard: { domain: selectedDomain, mech: selectedMech, likes: (Math.random() * 20 + 1).toFixed(1) + 'K' },
      cardFlipId: s.cardFlipId + 1 
    }));
  },

  startGame: () => {
    // Lấy ID của TẤT CẢ các lá bài hiện có trong thư viện
    const allCardIds = Object.keys(PLAYER_CARDS);
    
    // TẠO BỘ BÀI MỚI: Mỗi lá sẽ xuất hiện ngẫu nhiên
    const startingDeck = shuffle([...allCardIds]);

    // Rút 4 lá đầu tiên lên tay
    const newHand = startingDeck.splice(0, 4);

    set({
      screen: 'game', round: 1, reality: 80, dopamine: 20, ap: 4, focus: 2,
      weights: { ...initialWeights }, deck: startingDeck, hand: newHand, discard: [], history: [],
      isClashing: false, floatingDeltas: [], isAutoPilot: false, consecutiveDopamineHits: 0,
      cardsPlayedThisTurn: 0, apDiscountTurns: 0, dopamineResistTurns: 0, preventShadowLearning: 0, skipNextFeed: false, lastPlayedCard: null, mutedDomains: {}
    });
    get().generateNextCard(1, initialWeights);
  },

  // ---------------------------------------------------------
  // HÀM SKIP TURN (VƯỢT LƯỢT KHI KẸT BÀI / CẠN AP)
  // ---------------------------------------------------------
  skipTurn: () => {
    const state = get();
    const feedCard = state.currentCard;

    // 1. Chịu toàn bộ sát thương mặc định từ thuật toán
    let deltaReal = 0; let deltaDop = 0;
    if (feedCard.mech === 'celebrity') { deltaReal -= 15; deltaDop += 10; }
    else if (feedCard.mech === 'emotional') { deltaReal -= 8; deltaDop += 15; }
    else if (feedCard.mech === 'urgency') { deltaReal -= 10; deltaDop += 5; }
    else { deltaReal -= 5; deltaDop += 5; } 

    if (state.dopamineResistTurns > 0 && deltaDop > 0) deltaDop = Math.floor(deltaDop / 2);

    const newReality = Math.max(0, Math.min(state.realityMax, state.reality + deltaReal));
    const newDopamine = Math.max(0, Math.min(state.dopamineMax, state.dopamine + deltaDop));

    // 2. Thuật toán học hỏi (vì người chơi không phòng thủ)
    const newWeights = { ...state.weights };
    if (state.preventShadowLearning <= 0 && deltaDop > 5) {
        newWeights[feedCard.domain] = Math.min(50, newWeights[feedCard.domain] + 5);
    }

    // 3. Xử lý Bẫy Auto-Pilot
    let newConsecutiveDopamine = state.consecutiveDopamineHits;
    if (deltaDop > 0) newConsecutiveDopamine += 1;
    else newConsecutiveDopamine = 0;

    let triggerAutoPilot = false;
    if (newConsecutiveDopamine >= 3) {
      triggerAutoPilot = true;
      newConsecutiveDopamine = 0;
    }

    // 4. CHỐNG KẸT BÀI: Vứt toàn bộ bài cũ, bốc 4 lá bài mới
    let newDiscard = [...state.discard, ...state.hand];
    let newDeck = [...state.deck];
    let newHand: string[] = [];

    for (let i = 0; i < 4; i++) {
      if (newDeck.length === 0) {
        if (newDiscard.length === 0) break;
        newDeck = shuffle([...newDiscard]);
        newDiscard = [];
      }
      if (newDeck.length > 0) newHand.push(newDeck.pop()!);
    }

    // 5. Hiệu ứng Float Text
    const id = Math.random().toString();
    const deltas = [];
    if(deltaReal !== 0) deltas.push({ id: id+'r', text: `${deltaReal > 0 ? '+' : ''}${deltaReal} Real`, color: '#4CE0D2', offset: -20 });
    if(deltaDop !== 0) deltas.push({ id: id+'d', text: `${deltaDop > 0 ? '+' : ''}${deltaDop} Dop`, color: '#FF5470', offset: 20 });

    set({
      hand: newHand, deck: newDeck, discard: newDiscard,
      reality: newReality, dopamine: newDopamine, weights: newWeights,
      history: [...state.history, { round: state.round, reality: newReality, dopamine: newDopamine, cardId: 'skip', mech: feedCard.mech, deltaReal }],
      floatingDeltas: deltas,
      isClashing: true,
      cardsPlayedThisTurn: 0 
    });

    // 6. Timeout chờ chuyển vòng và hồi AP
    setTimeout(() => {
      set({ 
        isClashing: false, 
        floatingDeltas: [],
        consecutiveDopamineHits: newConsecutiveDopamine,
        isAutoPilot: triggerAutoPilot
      });
      
      if (triggerAutoPilot) return; 

      if (newReality <= 0 || newDopamine >= 100 || state.round >= state.maxRound) {
        set({ screen: 'end' });
      } else {
        const nextRound = state.round + 1;
        set({ round: nextRound, ap: Math.min(state.apMax, state.ap + 1) }); // Chỉ hồi +1 AP (Hardcore mode)
        get().generateNextCard(nextRound, newWeights);
      }
    }, 800);
  },

  playCard: (cardId, handIndex) => {
    const state = get();
    const playerCard = PLAYER_CARDS[cardId as keyof typeof PLAYER_CARDS];
    const feedCard = state.currentCard;
    
    let newHand = [...state.hand];
    let newDeck = [...state.deck];
    let newDiscard = [...state.discard];
    
    // Remove card from hand
    newHand.splice(handIndex, 1);
    
    // Hold logic
    if (cardId !== 'touchgrass' && cardId !== 'hold') {
      newDiscard.push(cardId);
    }

    // Tính Cost (Ưu tiên AP Discount)
    let newAp = state.ap;
    let cost = playerCard.ap === 'ALL' ? state.ap : (playerCard.ap as number);
    if (state.apDiscountTurns > 0 && cost > 0) cost -= 1; // Giảm 1 AP

    if (playerCard.ap === 'ALL') newAp = 0;
    else newAp -= cost;
    
    let newFocus = state.focus - playerCard.focus;
    let newCardsPlayed = state.cardsPlayedThisTurn + 1;

    // Default Feed Damage
    let deltaReal = 0; let deltaDop = 0; let deltaFoc = 0;
    if (feedCard.mech === 'celebrity') { deltaReal -= 15; deltaDop += 10; }
    else if (feedCard.mech === 'emotional') { deltaReal -= 8; deltaDop += 15; }
    else if (feedCard.mech === 'urgency') { deltaReal -= 10; deltaDop += 5; }
    else { deltaReal -= 5; deltaDop += 5; } 

    // Helper: Draw Cards
    const draw = (amount: number) => {
      for (let i = 0; i < amount; i++) {
        if (newDeck.length === 0) {
          if (newDiscard.length === 0) break;
          newDeck = shuffle([...newDiscard]);
          newDiscard = [];
        }
        if (newDeck.length > 0) {
          const drawnCard = newDeck.pop()!;
          // KIỂM TRA GIỚI HẠN BÀI
          if (newHand.length < state.maxHandSize) {
            newHand.push(drawnCard); // Tay chưa đầy -> Vào tay
          } else {
            newDiscard.push(drawnCard); // Tay đã đầy -> Vứt thẳng vào Discard Pile
          }
        }
      }
    };

    // --- CARD EFFECTS RESOLUTION ---
    switch (cardId) {
      // VERIFICATION
      case 'factcheck':
        if (feedCard.mech === 'celebrity' || feedCard.mech === 'social') {
          deltaReal += 10; 
          if(feedCard.mech === 'celebrity') deltaDop -= 10; 
        } else deltaReal += 5;
        break;
      case 'contextsearch':
        if (feedCard.mech === 'urgency' || feedCard.domain === 'fomo') { deltaReal += 8; deltaDop -= 5; }
        break;
      case 'sourcecheck': draw(1); break;
      case 'reverseimage': set({ skipNextFeed: true }); break;
      case 'verifyauthor': set({ preventShadowLearning: 1 }); break;
      
      // AWARENESS
      case 'shadowscan': deltaFoc += 2; break;
      case 'biasdetector': deltaReal += 3; break;
      case 'prediction': newAp += 1; draw(1); break;

      // EMOTIONAL CONTROL
      case 'deepbreath': deltaDop -= 5; deltaReal += 6; break;
      case 'pauseclick': deltaDop = 0; break;
      case 'mindfulness': deltaReal += 5; deltaFoc += 2; break;
      case 'focusmode': deltaFoc += 3; set({ apDiscountTurns: 2 }); break;
      case 'emotionalreset': deltaDop = -state.dopamine + 20; set({ isAutoPilot: false, consecutiveDopamineHits: 0 }); break;
      
      // HYGIENE
      case 'unfollow': 
        state.weights[feedCard.domain] = Math.max(5, state.weights[feedCard.domain] - 15);
        break;
      case 'mutetopic': 
        state.mutedDomains[feedCard.domain] = 3; 
        break;
      case 'blocksource': 
        state.weights[feedCard.domain] = 5; 
        break;
      case 'resetfeed': 
        set({ weights: { ...initialWeights } }); 
        break;
      case 'privacymode': set({ preventShadowLearning: 2 }); break;

      // RECOVERY
      case 'readbook': deltaReal += 8; deltaFoc += 2; break;
      case 'exercise': deltaReal += 5; set({ dopamineResistTurns: 3 }); break;
      case 'sleepwell': deltaReal += 12; newFocus = state.focusMax; break;
      case 'meetfriends': deltaReal += 6; state.weights['compare'] = Math.max(5, state.weights['compare'] - 10); break;
      case 'touchgrass': deltaReal += 20; deltaDop -= 10; break;

      // STRATEGY
      case 'prepare': set({ apDiscountTurns: 1 }); break;
      case 'duplicate': 
        if (state.lastPlayedCard) newHand.push(state.lastPlayedCard); 
        break;
      case 'recycle': 
        if (newDiscard.length > 0) newHand.push(newDiscard.pop()!);
        draw(1);
        break;
      case 'combochain': 
        if (newCardsPlayed >= 3) { newAp += 2; draw(2); }
        break;
      case 'quickdecision': draw(1); break;
      case 'resourceconversion': deltaReal -= 5; deltaDop -= 10; break;
    }

    // Apply Resistances
    if (state.dopamineResistTurns > 0 && deltaDop > 0) deltaDop = Math.floor(deltaDop / 2);

    const newReality = Math.max(0, Math.min(state.realityMax, state.reality + deltaReal));
    const newDopamine = Math.max(0, Math.min(state.dopamineMax, state.dopamine + deltaDop));
    const newFocusFinal = Math.max(0, Math.min(state.focusMax, newFocus + deltaFoc));
    
    // Shadow Profile Learning
    const newWeights = { ...state.weights };
    if (state.preventShadowLearning <= 0 && deltaDop > 5) {
        newWeights[feedCard.domain] = Math.min(50, newWeights[feedCard.domain] + 5);
    }

    // Auto-Pilot Logic
    let newConsecutiveDopamine = state.consecutiveDopamineHits;
    if (deltaDop > 0) newConsecutiveDopamine += 1;
    else newConsecutiveDopamine = 0;

    let triggerAutoPilot = false;
    if (newConsecutiveDopamine >= 3) {
      triggerAutoPilot = true;
      newConsecutiveDopamine = 0;
    }

    // Draw 1 card normally per turn (if standard flow)
    draw(1);

    const id = Math.random().toString();
    const deltas = [];
    if(deltaReal !== 0) deltas.push({ id: id+'r', text: `${deltaReal > 0 ? '+' : ''}${deltaReal} Real`, color: '#4CE0D2', offset: -20 });
    if(deltaDop !== 0) deltas.push({ id: id+'d', text: `${deltaDop > 0 ? '+' : ''}${deltaDop} Dop`, color: '#FF5470', offset: 20 });
    if(deltaFoc !== 0) deltas.push({ id: id+'f', text: `${deltaFoc > 0 ? '+' : ''}${deltaFoc} Foc`, color: '#b084ff', offset: 0 });

    set({
      hand: newHand, deck: newDeck, discard: newDiscard,
      ap: newAp, focus: newFocusFinal, reality: newReality, dopamine: newDopamine, weights: newWeights,
      history: [...state.history, { round: state.round, reality: newReality, dopamine: newDopamine, cardId, mech: feedCard.mech, deltaReal }],
      floatingDeltas: deltas,
      isClashing: true,
      lastPlayedCard: cardId,
      cardsPlayedThisTurn: newCardsPlayed
    });

    setTimeout(() => {
      set({ 
        isClashing: false, 
        floatingDeltas: [],
        consecutiveDopamineHits: newConsecutiveDopamine,
        isAutoPilot: triggerAutoPilot
      });
      
      if (triggerAutoPilot) return; 

      if (newReality <= 0 || newDopamine >= 100 || state.round >= state.maxRound) {
        set({ screen: 'end' });
      } else {
        const nextRound = state.round + 1;
        set({ round: nextRound, ap: Math.min(state.apMax, newAp + 1) }); // Chỉ hồi +1 AP (Hardcore mode)
        get().generateNextCard(nextRound, newWeights);
      }
    }, 800);
  }
}));