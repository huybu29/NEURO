import {
  Copy, Frown, Star, Timer, Users, Layers, Target,
  Search, Eye, Wind, Filter, BookOpen, Leaf, ShieldAlert,
  BrainCircuit,
  RadarIcon, // <-- THÊM DẤU PHẨY Ở ĐÂY
  Activity, ShieldCheck, Moon, Zap // <-- THÊM MOON VÀO ĐÂY VÌ THẺ 'SLEEPWELL' ĐANG DÙNG
} from 'lucide-react';
// --- 1. FEED DECK: 5 VULNERABILITY SYSTEMS (Thay thế Chủ đề cũ) ---
export const DOMAINS = [
  { id: 'lifestyle', label: 'Algorithmic Lifestyle', short: 'LIFE', Icon: Layers },
  { id: 'recommend', label: 'Recommendation Bias', short: 'BIAS', Icon: Target },
  { id: 'fomo', label: 'FOMO Vulnerability', short: 'FOMO', Icon: Timer },
  { id: 'compare', label: 'Social Comparison', short: 'COMP', Icon: Users },
  { id: 'echo', label: 'Echo Chamber', short: 'ECHO', Icon: RadarIcon },
];

// --- 2. MANIPULATION MECHANICS (Thủ thuật thao túng) ---
export const MECH = {
  similar: { label: 'Similar Content', base: 1, Icon: Copy },
  emotional: { label: 'Emotional Trigger', base: 2, Icon: Frown },
  celebrity: { label: 'Celebrity Endorsement', base: 3, Icon: Star },
  urgency: { label: 'Fake Urgency', base: 2, Icon: Timer },
  social: { label: 'Social Proof', base: 1, Icon: Users },
};

// --- 3. DYNAMIC CONTENT GENERATION ---
export const CAPTIONS = {
  lifestyle: { 
    similar: '5 morning habits of highly successful people...', 
    emotional: 'I cried when I got laid off—the untold truth...', 
    celebrity: 'Billionaire startup founder shares the ultimate formula.', 
    urgency: 'Scholarship application deadline: 6 hours left!', 
    social: '87% of Gen Z believes quitting corporate is the right choice.' 
  },
  recommend: { 
    similar: 'My 10-step nighttime skincare routine.', 
    emotional: 'I used to hate my skin — my transformation journey.', 
    celebrity: 'Top dermatologist recommends this one product.', 
    urgency: '70% off today only, prices go up tomorrow!', 
    social: '10 million people have tried this viral beauty challenge.' 
  },
  fomo: { 
    similar: 'How I save 30% of my salary every month.', 
    emotional: 'Lost $10,000 trusting the wrong crypto guru.', 
    celebrity: '24-year-old CEO reveals investing secrets to get rich.', 
    urgency: 'Only 3 VIP spots left — offer expires in 2 hours!', 
    social: '72% of followers say this investment is worth trying.' 
  },
  compare: { 
    similar: 'Signs you are dating the right person.', 
    emotional: 'He left me on my birthday — how I survived.', 
    celebrity: 'Renowned psychologist points out 3 toxic traits to avoid.', 
    urgency: 'Dating app: 5 premium matches expiring in 1 hour!', 
    social: '72% agree: this is the ultimate red flag in a relationship.' 
  },
  echo: { 
    similar: 'A slow-living day in the countryside.', 
    emotional: 'I quit the city after severe burnout.', 
    celebrity: 'Million-follower travel blogger reveals budget secrets.', 
    urgency: 'Flash flight sale — book within the next 24 hours!', 
    social: "9/10 young adults want to 'escape to the country'." 
  },
};

// --- 4. PLAYER DECK DATABASE (Đã dịch sang tiếng Anh) ---
export const PLAYER_CARDS = {

  // ==========================
  // VERIFICATION
  // ==========================
  factcheck: {
    id: 'factcheck',
    label: 'Fact Check',
    type: 'Verification',
    ap: 2,
    focus: 1,
    Icon: ShieldAlert,
    color: '#FFB84D',
    desc: 'Counters [Celebrity, Social Proof]. Recover +10 Reality if successful, otherwise +5.'
  },

  sourcecheck: {
    id: 'sourcecheck',
    label: 'Source Check',
    type: 'Verification',
    ap: 1,
    focus: 0,
    Icon: Search,
    color: '#FFB84D',
    desc: 'Reveal content source. Weakens unreliable sources by 50%. Draw 1 card.'
  },

  contextsearch: {
    id: 'contextsearch',
    label: 'Context Search',
    type: 'Verification',
    ap: 2,
    focus: 0,
    Icon: Search,
    color: '#FFB84D',
    desc: 'Counters [Urgency, FOMO]. Recover +8 Reality and reduce 5 Dopamine.'
  },

  reverseimage: {
    id: 'reverseimage',
    label: 'Reverse Image',
    type: 'Verification',
    ap: 2,
    focus: 1,
    Icon: Eye,
    color: '#FFB84D',
    desc: 'Expose manipulated images or fake celebrity content. Skip next Feed attack.'
  },

  verifyauthor: {
    id: 'verifyauthor',
    label: 'Verify Author',
    type: 'Verification',
    ap: 1,
    focus: 0,
    Icon: ShieldCheck,
    color: '#FFB84D',
    desc: 'Check author credibility. Prevent Shadow Profile learning this turn.'
  },

  // ==========================
  // AWARENESS
  // ==========================
  shadowscan: {
    id: 'shadowscan',
    label: 'Shadow Scan',
    type: 'Awareness',
    ap: 1,
    focus: 0,
    Icon: Eye,
    color: '#B084FF',
    desc: 'Reveal current Shadow Profile. Gain +2 Focus.'
  },

  patterndetection: {
    id: 'patterndetection',
    label: 'Pattern Detection',
    type: 'Awareness',
    ap: 2,
    focus: 0,
    Icon: RadarIcon,
    color: '#B084FF',
    desc: 'Reveal the next 2 Feed Cards.'
  },

  biasdetector: {
    id: 'biasdetector',
    label: 'Bias Detector',
    type: 'Awareness',
    ap: 2,
    focus: 0,
    Icon: BrainCircuit,
    color: '#B084FF',
    desc: 'Reveal the Psychological Trigger. Recover +3 Reality.'
  },

  prediction: {
    id: 'prediction',
    label: 'Prediction',
    type: 'Awareness',
    ap: 1,
    focus: 0,
    Icon: Target,
    color: '#B084FF',
    desc: 'Predict the next Feed Card. Correct guess restores 1 AP and Draw 1.'
  },

  trendanalysis: {
    id: 'trendanalysis',
    label: 'Trend Analysis',
    type: 'Awareness',
    ap: 2,
    focus: 0,
    Icon: Activity,
    color: '#B084FF',
    desc: 'Reveal the most likely Domain for the next 3 rounds.'
  },

  // ==========================
  // EMOTIONAL CONTROL
  // ==========================
  deepbreath: {
    id: 'deepbreath',
    label: 'Deep Breath',
    type: 'Emotional',
    ap: 1,
    focus: 0,
    Icon: Wind,
    color: '#4CE0D2',
    desc: 'Reduce 5 Dopamine. Recover 6 Reality.'
  },

  pauseclick: {
    id: 'pauseclick',
    label: 'Pause Before Click',
    type: 'Emotional',
    ap: 1,
    focus: 0,
    Icon: Timer,
    color: '#4CE0D2',
    desc: 'Current Feed Card cannot increase Dopamine.'
  },

  mindfulness: {
    id: 'mindfulness',
    label: 'Mindfulness',
    type: 'Emotional',
    ap: 2,
    focus: 0,
    Icon: Leaf,
    color: '#4CE0D2',
    desc: 'Remove all Debuffs. Gain +5 Reality and +2 Focus.'
  },

  focusmode: {
    id: 'focusmode',
    label: 'Focus Mode',
    type: 'Emotional',
    ap: 2,
    focus: 0,
    Icon: BrainCircuit,
    color: '#4CE0D2',
    desc: 'Gain +3 Focus. Verification cards cost 1 less AP for 2 turns.'
  },

  emotionalreset: {
    id: 'emotionalreset',
    label: 'Emotional Reset',
    type: 'Emotional',
    ap: 3,
    focus: 0,
    Icon: Activity,
    color: '#4CE0D2',
    desc: 'Reset Dopamine to balance and remove Auto Pilot.'
  },

  // ==========================
  // DIGITAL HYGIENE
  // ==========================
  unfollow: {
    id: 'unfollow',
    label: 'Unfollow',
    type: 'Hygiene',
    ap: 1,
    focus: 0,
    Icon: Filter,
    color: '#8891A3',
    desc: 'Reduce current Domain influence by 20%.'
  },

  mutetopic: {
    id: 'mutetopic',
    label: 'Mute Topic',
    type: 'Hygiene',
    ap: 2,
    focus: 0,
    Icon: Filter,
    color: '#8891A3',
    desc: 'Selected Domain will not appear for the next 3 rounds.'
  },

  blocksource: {
    id: 'blocksource',
    label: 'Block Source',
    type: 'Hygiene',
    ap: 3,
    focus: 0,
    Icon: ShieldCheck,
    color: '#8891A3',
    desc: 'Remove all future Feed Cards from the current source.'
  },

  resetfeed: {
    id: 'resetfeed',
    label: 'Reset Feed',
    type: 'Hygiene',
    ap: 3,
    focus: 0,
    Icon: Copy,
    color: '#8891A3',
    desc: 'Shuffle the Feed Deck and break AI combo chains.'
  },

  privacymode: {
    id: 'privacymode',
    label: 'Privacy Mode',
    type: 'Hygiene',
    ap: 2,
    focus: 0,
    Icon: ShieldCheck,
    color: '#8891A3',
    desc: 'AI cannot update Shadow Profile for 2 turns.'
  },

  // ==========================
  // RECOVERY
  // ==========================
  readbook: {
    id: 'readbook',
    label: 'Read Book',
    type: 'Recovery',
    ap: 2,
    focus: 0,
    Icon: BookOpen,
    color: '#3DDC84',
    desc: 'Recover +8 Reality and +2 Focus.'
  },

  exercise: {
    id: 'exercise',
    label: 'Exercise',
    type: 'Recovery',
    ap: 2,
    focus: 0,
    Icon: Activity,
    color: '#3DDC84',
    desc: 'Recover +5 Reality. Dopamine gains reduced by 50% for 3 turns.'
  },

  sleepwell: {
    id: 'sleepwell',
    label: 'Sleep Well',
    type: 'Recovery',
    ap: 3,
    focus: 0,
    Icon: Moon,
    color: '#3DDC84',
    desc: 'Recover +12 Reality. Fully restore Focus.'
  },

  meetfriends: {
    id: 'meetfriends',
    label: 'Meet Friends',
    type: 'Recovery',
    ap: 1,
    focus: 0,
    Icon: Users,
    color: '#3DDC84',
    desc: 'Remove Social Comparison. Recover +6 Reality.'
  },

  touchgrass: {
    id: 'touchgrass',
    label: 'Touch Grass',
    type: 'Recovery',
    ap: 'ALL',
    focus: 0,
    Icon: Leaf,
    color: '#3DDC84',
    desc: 'Spend all AP. Recover +20 Reality. Reduce 10 Dopamine. Exhaust.'
  },

  // ==========================
  // STRATEGY
  // ==========================
  prepare: {
    id: 'prepare',
    label: 'Prepare',
    type: 'Strategy',
    ap: 1,
    focus: 0,
    Icon: Target,
    color: '#FFD166',
    desc: 'Next card costs 1 less AP and gains 50% stronger effect.'
  },

  hold: {
    id: 'hold',
    label: 'Hold',
    type: 'Strategy',
    ap: 0,
    focus: 0,
    Icon: Copy,
    color: '#FFD166',
    desc: 'Keep one card in your hand until next turn.'
  },

  duplicate: {
    id: 'duplicate',
    label: 'Duplicate',
    type: 'Strategy',
    ap: 2,
    focus: 1,
    Icon: Copy,
    color: '#FFD166',
    desc: 'Copy the last played card into your hand.'
  },

  recycle: {
    id: 'recycle',
    label: 'Recycle',
    type: 'Strategy',
    ap: 1,
    focus: 0,
    Icon: Layers,
    color: '#FFD166',
    desc: 'Return one card from Discard to Deck. Draw 1.'
  },

  combochain: {
    id: 'combochain',
    label: 'Combo Chain',
    type: 'Strategy',
    ap: 2,
    focus: 0,
    Icon: Zap,
    color: '#FFD166',
    desc: 'If 3 cards are played this turn, gain 2 AP and Draw 2.'
  },

  planning: {
    id: 'planning',
    label: 'Planning',
    type: 'Strategy',
    ap: 1,
    focus: 0,
    Icon: RadarIcon,
    color: '#FFD166',
    desc: 'Look at the top 3 Player Deck cards. Rearrange them and Draw 1.'
  },

  quickdecision: {
    id: 'quickdecision',
    label: 'Quick Decision',
    type: 'Strategy',
    ap: 0,
    focus: 0,
    Icon: Timer,
    color: '#FFD166',
    desc: 'Replace one card in your hand with a new draw.'
  },

  resourceconversion: {
    id: 'resourceconversion',
    label: 'Resource Conversion',
    type: 'Strategy',
    ap: 2,
    focus: 0,
    Icon: Activity,
    color: '#FFD166',
    desc: 'Convert Reality into Dopamine or Dopamine into Reality.'
  }

};
// --- 5. INITIAL STATE ---
export const INITIAL_DECK = [
  'deepbreath', 'deepbreath', 'deepbreath', 
  'shadowscan', 'shadowscan', 
  'readbook', 'readbook',
  'factcheck', 'factcheck', 
  'contextsearch', 'contextsearch', // <--- Sửa 'context' thành 'contextsearch' ở đây
  'focusmode', 'unfollow', 'unfollow', 'touchgrass'
];

// Trọng số cơ bản để AI bắt đầu học hỏi
export const initialWeights = { lifestyle: 20, recommend: 20, fomo: 20, compare: 20, echo: 20 };