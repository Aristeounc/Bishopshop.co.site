import { SkillTrackId } from '@/models/types';

export interface ToneMatchPair {
  id: string;
  situation: string;
  response: string;
}

export interface SnapJudgment {
  id: string;
  moment: string;
  optionA: string;
  optionB: string;
  correctOption: 'A' | 'B';
  explanation: string;
}

export interface ToneMatchScenario {
  id: string;
  context: string;
  skillFocus: SkillTrackId[];
  difficulty: number;
  pairs: ToneMatchPair[];
  snapJudgments: SnapJudgment[];
}

export interface ToneMatchResult {
  scenarioId: string;
  timeMs: number;
  accuracy: number;
  maxCombo: number;
  snapCorrect: number;
  snapTotal: number;
  totalXp: number;
  isPersonalBest: boolean;
}

const COMBO_MULTIPLIERS = [1, 1.5, 2, 2.5, 3];

export function getComboMultiplier(streak: number): number {
  return COMBO_MULTIPLIERS[Math.min(streak, COMBO_MULTIPLIERS.length - 1)];
}

export function calculateMatchXp(
  correctMatches: number,
  comboHistory: number[],
  snapCorrect: number,
  timeMs: number,
  parTimeMs: number,
): ToneMatchResult['totalXp'] {
  const baseXp = correctMatches * 10;

  let comboXp = 0;
  for (let i = 0; i < comboHistory.length; i++) {
    comboXp += 10 * (getComboMultiplier(comboHistory[i]) - 1);
  }

  const snapXp = snapCorrect * 5;

  const timeBonus = timeMs < parTimeMs ? 25 : 0;

  return Math.round(baseXp + comboXp + snapXp + timeBonus);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const TONE_MATCH_SCENARIOS: ToneMatchScenario[] = [
  {
    id: 'tm_workplace_credit',
    context: 'Your colleague publicly took credit for a project you led.',
    skillFocus: ['assert', 'defend', 'regulate'],
    difficulty: 2,
    pairs: [
      { id: 'p1', situation: 'Colleague says: "It was really a team effort, wasn\'t it?"', response: 'Calibrated question: "How would you describe each person\'s contribution?"' },
      { id: 'p2', situation: 'Your manager asks who led the project', response: 'Assertive I-statement: "I led the design and execution — here\'s my documentation."' },
      { id: 'p3', situation: 'Colleague privately says "Sorry, I got carried away"', response: 'Empathy + boundary: "I appreciate that. Going forward, let\'s agree to credit specific contributions."' },
      { id: 'p4', situation: 'Another coworker whispers "That was your work, right?"', response: 'Composure: "I\'ll address it directly with them. Thanks for noticing."' },
      { id: 'p5', situation: 'Colleague cc\'s you on an email taking credit again', response: 'DESC script: Reply-all with specific facts, no accusations, clear request.' },
      { id: 'p6', situation: 'Your manager says "Great teamwork on that project"', response: 'Strategic framing: "Thank you — I\'m glad the approach I designed delivered results."' },
    ],
    snapJudgments: [
      { id: 's1', moment: 'Colleague presents your slides as their own in a meeting.', optionA: 'Interrupt: "Those are actually my slides."', optionB: 'After meeting: "I noticed my slides were presented. Can we discuss how to handle attribution?"', correctOption: 'B', explanation: 'Addressing it privately preserves composure and avoids escalation while still asserting your contribution.' },
      { id: 's2', moment: 'Your boss praises the colleague\'s "initiative" on your work.', optionA: '"I appreciate the praise for the team — I\'d love to walk you through my specific contributions."', optionB: '"Actually, that was all my work, not theirs."', correctOption: 'A', explanation: 'The first option asserts ownership without creating confrontation or putting your boss in an awkward position.' },
      { id: 's3', moment: 'The colleague asks to "collaborate" on your next project.', optionA: '"Sure, let\'s define roles and deliverables upfront in writing."', optionB: '"No thanks, I work better alone."', correctOption: 'A', explanation: 'Setting clear boundaries with documentation prevents future credit issues without burning the relationship.' },
    ],
  },
  {
    id: 'tm_salary_negotiation',
    context: 'You\'re negotiating your salary for a promotion you\'ve earned.',
    skillFocus: ['negotiate', 'close', 'assert'],
    difficulty: 3,
    pairs: [
      { id: 'p1', situation: 'HR says: "This is the standard rate for this level."', response: 'Reframe: "I\'d like to discuss compensation based on my specific contributions, not just the band."' },
      { id: 'p2', situation: 'Manager says: "Budgets are tight this year."', response: 'Calibrated question: "What would need to happen for us to revisit the number?"' },
      { id: 'p3', situation: 'They offer 10% below your target', response: 'Anchoring counter: "Based on my research and contributions, I was expecting closer to [target]."' },
      { id: 'p4', situation: '"We can revisit this in 6 months."', response: 'Specificity: "I\'d like to agree on specific milestones and a timeline in writing."' },
      { id: 'p5', situation: '"Other people at your level make this amount."', response: 'Expand the pie: "I understand. Can we explore other elements — signing bonus, equity, or title?"' },
      { id: 'p6', situation: '"This is our final offer."', response: 'BATNA awareness: "I appreciate the offer. I need a few days to consider it fully."' },
    ],
    snapJudgments: [
      { id: 's1', moment: 'They ask: "What are you currently making?"', optionA: 'Redirect: "I\'d prefer to focus on the value I\'ll bring to this role."', optionB: 'Share your current salary honestly.', correctOption: 'A', explanation: 'Sharing current salary anchors the negotiation to your past, not your value. Redirecting keeps the focus forward.' },
      { id: 's2', moment: 'They say "Take it or leave it" with a smile.', optionA: 'Call the bluff calmly: "I hear you. What flexibility do you have on [other element]?"', optionB: 'Accept immediately to avoid losing the offer.', correctOption: 'A', explanation: '"Take it or leave it" is often a tactic, not a reality. Exploring other dimensions shows you\'re serious without being adversarial.' },
      { id: 's3', moment: 'Your manager advocates for you but says their hands are tied.', optionA: '"Who else would need to approve an exception?"', optionB: '"That\'s okay, I understand."', correctOption: 'A', explanation: 'A calibrated question helps you find the real decision-maker while keeping your advocate on your side.' },
    ],
  },
  {
    id: 'tm_family_boundary',
    context: 'A family member keeps giving unsolicited advice about your life choices.',
    skillFocus: ['assert', 'empathize', 'regulate'],
    difficulty: 2,
    pairs: [
      { id: 'p1', situation: '"You really should be doing X by now at your age."', response: 'Boundary + warmth: "I know you care. I\'ve thought this through and I\'m confident in my path."' },
      { id: 'p2', situation: '"I\'m just trying to help — you\'ll thank me later."', response: 'Validate + redirect: "I appreciate your concern. Right now, the best support is trusting my decisions."' },
      { id: 'p3', situation: '"When I was your age, I had already..."', response: 'Empathy label: "It sounds like you worked really hard for what you achieved. My path looks different."' },
      { id: 'p4', situation: 'They bring it up at a family dinner in front of everyone', response: 'Composure + deflect: "Let\'s enjoy dinner — I\'m happy to chat about this one-on-one later."' },
      { id: 'p5', situation: '"Your cousin is doing so well — have you considered..."', response: 'Name the tactic: "I notice comparisons come up a lot. I\'d rather hear how you\'re doing."' },
      { id: 'p6', situation: 'They get upset when you set a boundary: "I can\'t even talk to you anymore."', response: 'Hold firm with empathy: "I want us to talk — just about topics where you\'re curious, not corrective."' },
    ],
    snapJudgments: [
      { id: 's1', moment: 'They say "I\'m only saying this because I love you."', optionA: '"I know, and I love you too. But I need you to trust me on this."', optionB: '"If you loved me you\'d respect my choices."', correctOption: 'A', explanation: 'Acknowledging their love while holding the boundary maintains connection. The second option weaponizes their emotion back at them.' },
      { id: 's2', moment: 'They start crying when you set a boundary.', optionA: 'Hold the boundary with compassion: "I can see this is hard. My boundary still stands."', optionB: 'Backtrack to make them feel better.', correctOption: 'A', explanation: 'Tears don\'t invalidate your boundary. Holding firm with compassion shows both empathy and self-respect.' },
      { id: 's3', moment: 'Another relative says "Just let them say it, it\'s easier."', optionA: '"I understand it\'s uncomfortable. I\'m choosing to handle it differently."', optionB: '"You\'re right, it\'s not worth the fight."', correctOption: 'A', explanation: 'Calmly asserting your approach without criticizing theirs models healthy boundary-setting.' },
    ],
  },
  {
    id: 'tm_partner_conflict',
    context: 'You and your partner disagree about household responsibilities.',
    skillFocus: ['connect', 'empathize', 'negotiate'],
    difficulty: 2,
    pairs: [
      { id: 'p1', situation: '"You never help around the house."', response: 'NVC observation: "I hear you\'re frustrated. Can we look at what each of us did this week specifically?"' },
      { id: 'p2', situation: '"I shouldn\'t have to ask you to do things."', response: 'Validate + explore interests: "I understand that feels unfair. What system would work for both of us?"' },
      { id: 'p3', situation: 'They sigh loudly and start cleaning aggressively', response: 'Repair attempt: "Hey — I can see you\'re upset. Let me help right now, and then let\'s talk."' },
      { id: 'p4', situation: '"My friends\' partners do way more."', response: 'Deflect comparison, stay collaborative: "Every couple is different. What matters is what works for us."' },
      { id: 'p5', situation: '"Fine, I\'ll just do everything myself."', response: 'Empathy label + engage: "It sounds like you feel alone in this. That\'s not what I want. Let\'s fix it."' },
      { id: 'p6', situation: 'They bring it up during an unrelated argument', response: 'Name the pattern: "I notice we\'re mixing topics. Can we finish this one, then address chores separately?"' },
    ],
    snapJudgments: [
      { id: 's1', moment: 'Your partner says "Whatever, it\'s fine" in a flat tone.', optionA: '"It doesn\'t sound fine. I want to understand what you\'re feeling."', optionB: '"Okay, great" and move on.', correctOption: 'A', explanation: '"Fine" in a flat tone is a bid for engagement, not resolution. Turning toward it builds trust.' },
      { id: 's2', moment: 'They list 10 things they did today.', optionA: '"That sounds exhausting. Thank you for doing all of that."', optionB: '"Well here\'s what I did..." and list yours.', correctOption: 'A', explanation: 'Validating first de-escalates. Countering with your own list turns it into a competition.' },
      { id: 's3', moment: 'They say "If you really loved me, you\'d just know what to do."', optionA: '"I do love you, and I want to get this right. Help me understand what matters most to you."', optionB: '"That\'s not fair — I\'m not a mind reader."', correctOption: 'A', explanation: 'The first response addresses the underlying need (feeling cared for) rather than debating the logic of mind-reading.' },
    ],
  },
  {
    id: 'tm_sales_pressure',
    context: 'A salesperson is using high-pressure tactics on a purchase you\'re considering.',
    skillFocus: ['defend', 'regulate', 'negotiate'],
    difficulty: 3,
    pairs: [
      { id: 'p1', situation: '"This price is only good for today."', response: 'Mindful pause: "If the deal is good today, it\'ll be good when I\'ve had time to think."' },
      { id: 'p2', situation: '"I have three other buyers lined up."', response: 'Call the scarcity: "That\'s fine — if it sells, it wasn\'t meant to be. I make better decisions without pressure."' },
      { id: 'p3', situation: '"I\'m giving you my employee discount."', response: 'Recognize reciprocity trap: "I appreciate that, but I need to evaluate the offer on its own merits."' },
      { id: 'p4', situation: '"Everyone in your neighborhood is switching to this."', response: 'Spot social proof: "What others do is their choice. Walk me through why it works for my specific situation."' },
      { id: 'p5', situation: '"You seem like a smart person — you can see this is a no-brainer."', response: 'Deflect flattery: "Flattery aside, I still need to compare this with other options."' },
      { id: 'p6', situation: '"Let me talk to my manager about getting you a better deal."', response: 'Strategic patience: "Take your time. I\'m not in a rush to decide today."' },
    ],
    snapJudgments: [
      { id: 's1', moment: 'They hand you a pen and say "Just sign here."', optionA: '"I\'ll review the full terms first and get back to you."', optionB: 'Sign because the conversation has gone on long enough.', correctOption: 'A', explanation: 'Signing under social pressure is exactly what the tactic is designed to produce. Taking the document home removes the pressure.' },
      { id: 's2', moment: '"What would it take to earn your business right now?"', optionA: '"Right now? Nothing — I\'m in research mode. But I\'ll remember how you handled this conversation."', optionB: '"Well, if you could lower the price by 30%..."', correctOption: 'A', explanation: 'The question is designed to get you negotiating, which means you\'ve already mentally committed. Staying in research mode keeps your BATNA strong.' },
      { id: 's3', moment: 'They say "I don\'t want you to miss out. Can I at least put a hold on it for you?"', optionA: '"No thank you. If it\'s available when I\'m ready, great. If not, I\'ll find something else."', optionB: '"Sure, a hold sounds reasonable."', correctOption: 'A', explanation: 'A "hold" is a micro-commitment that creates sunk cost. Declining keeps you free from psychological anchoring.' },
    ],
  },
];

export function getScenarioById(id: string): ToneMatchScenario | undefined {
  return TONE_MATCH_SCENARIOS.find((s) => s.id === id);
}

export function getRandomScenario(excludeIds: string[] = []): ToneMatchScenario {
  const available = TONE_MATCH_SCENARIOS.filter((s) => !excludeIds.includes(s.id));
  if (available.length === 0) return TONE_MATCH_SCENARIOS[0];
  return available[Math.floor(Math.random() * available.length)];
}
