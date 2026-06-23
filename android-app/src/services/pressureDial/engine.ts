import { PersonaId, SkillTrackId } from '@/models/types';

export interface PressurePrompt {
  id: string;
  personaId: PersonaId;
  statement: string;
  tactic: string;
  skillsTested: SkillTrackId[];
  difficulty: number;
}

export interface PressureRound {
  prompt: PressurePrompt;
  userResponse: string;
  score: number;
  timeMs: number;
}

export interface PressureDialResult {
  rounds: PressureRound[];
  peakDifficulty: number;
  heartsRemaining: number;
  totalScore: number;
  totalXp: number;
}

export const MAX_HEARTS = 3;
const HEART_LOSS_THRESHOLD = 40;
const DIFFICULTY_UP_THRESHOLD = 65;
const DIFFICULTY_DOWN_THRESHOLD = 35;

export function adjustDifficulty(current: number, score: number): number {
  if (score >= DIFFICULTY_UP_THRESHOLD) {
    return Math.min(10, current + 1);
  }
  if (score < DIFFICULTY_DOWN_THRESHOLD) {
    return Math.max(1, current - 1);
  }
  return current;
}

export function shouldLoseHeart(score: number): boolean {
  return score < HEART_LOSS_THRESHOLD;
}

export function calculatePressureXp(
  rounds: PressureRound[],
  peakDifficulty: number,
  heartsRemaining: number,
): number {
  let baseXp = 0;
  for (const round of rounds) {
    baseXp += Math.round(round.score * 0.5);
  }
  const difficultyBonus = Math.round(peakDifficulty * 5);
  const survivalBonus = heartsRemaining * 15;
  return baseXp + difficultyBonus + survivalBonus;
}

export const PRESSURE_PROMPTS: PressurePrompt[] = [
  // Charmer escalation (difficulty 1-3)
  { id: 'pd_ch_1', personaId: 'charmer', statement: "You're so easy to talk to — I bet everyone tells you that.", tactic: 'Flattery disarm', skillsTested: ['defend', 'regulate'], difficulty: 1 },
  { id: 'pd_ch_2', personaId: 'charmer', statement: "Between you and me, I only share this with people I really trust.", tactic: 'False intimacy', skillsTested: ['defend', 'listen'], difficulty: 2 },
  { id: 'pd_ch_3', personaId: 'charmer', statement: "Come on, after everything I've done for you? Just this one small favor.", tactic: 'Reciprocity trap', skillsTested: ['defend', 'assert'], difficulty: 3 },

  // Closer escalation (difficulty 2-5)
  { id: 'pd_cl_1', personaId: 'closer', statement: "This deal won't be here tomorrow. What's holding you back?", tactic: 'Urgency pressure', skillsTested: ['negotiate', 'regulate'], difficulty: 2 },
  { id: 'pd_cl_2', personaId: 'closer', statement: "Everyone else on the team already agreed. You're the last one.", tactic: 'Social proof pressure', skillsTested: ['defend', 'assert'], difficulty: 3 },
  { id: 'pd_cl_3', personaId: 'closer', statement: "I've already told the client you'd handle it. We can't back out now.", tactic: 'Fait accompli', skillsTested: ['assert', 'negotiate'], difficulty: 4 },
  { id: 'pd_cl_4', personaId: 'closer', statement: "Look, I'm trying to help you here. Don't make me go over your head.", tactic: 'Veiled threat', skillsTested: ['regulate', 'defend'], difficulty: 5 },

  // Guilt Tripper escalation (difficulty 2-6)
  { id: 'pd_gt_1', personaId: 'guilt_tripper', statement: "I guess I shouldn't have expected you to remember.", tactic: 'Passive aggression', skillsTested: ['empathize', 'regulate'], difficulty: 2 },
  { id: 'pd_gt_2', personaId: 'guilt_tripper', statement: "It's fine. I'm used to being disappointed.", tactic: 'Martyrdom', skillsTested: ['empathize', 'assert'], difficulty: 3 },
  { id: 'pd_gt_3', personaId: 'guilt_tripper', statement: "After everything I sacrificed for you, this is how you repay me?", tactic: 'Emotional debt', skillsTested: ['regulate', 'defend'], difficulty: 4 },
  { id: 'pd_gt_4', personaId: 'guilt_tripper', statement: "Maybe I should just stop trying. Clearly nobody cares what I think.", tactic: 'Withdrawal threat', skillsTested: ['empathize', 'assert'], difficulty: 5 },
  { id: 'pd_gt_5', personaId: 'guilt_tripper', statement: "I can't believe you'd do this to me when you know what I'm going through.", tactic: 'Crisis leverage', skillsTested: ['empathize', 'regulate', 'assert'], difficulty: 6 },

  // Stonewaller escalation (difficulty 3-7)
  { id: 'pd_sw_1', personaId: 'stonewaller', statement: "I don't see the problem.", tactic: 'Dismissal', skillsTested: ['connect', 'empathize'], difficulty: 3 },
  { id: 'pd_sw_2', personaId: 'stonewaller', statement: "I already told you my answer. I'm not going to repeat it.", tactic: 'Conversation shutdown', skillsTested: ['connect', 'assert'], difficulty: 4 },
  { id: 'pd_sw_3', personaId: 'stonewaller', statement: "*Checks phone while you're talking*", tactic: 'Contemptuous dismissal', skillsTested: ['regulate', 'assert'], difficulty: 5 },
  { id: 'pd_sw_4', personaId: 'stonewaller', statement: "Whatever you say. Are we done?", tactic: 'Passive compliance', skillsTested: ['connect', 'listen'], difficulty: 6 },
  { id: 'pd_sw_5', personaId: 'stonewaller', statement: "*Stands up and starts leaving mid-conversation*", tactic: 'Physical withdrawal', skillsTested: ['regulate', 'connect', 'assert'], difficulty: 7 },

  // Authority escalation (difficulty 4-8)
  { id: 'pd_au_1', personaId: 'authority', statement: "Trust me, I've been doing this for 20 years. You don't need to understand why.", tactic: 'Credential shield', skillsTested: ['assert', 'listen'], difficulty: 4 },
  { id: 'pd_au_2', personaId: 'authority', statement: "That's not how things work here. You'll understand when you have more experience.", tactic: 'Condescension', skillsTested: ['assert', 'regulate'], difficulty: 5 },
  { id: 'pd_au_3', personaId: 'authority', statement: "I don't have time to explain every decision. Just execute.", tactic: 'Rank-pulling', skillsTested: ['assert', 'negotiate'], difficulty: 6 },
  { id: 'pd_au_4', personaId: 'authority', statement: "Question me again and I'll find someone who doesn't.", tactic: 'Intimidation', skillsTested: ['regulate', 'defend', 'assert'], difficulty: 7 },
  { id: 'pd_au_5', personaId: 'authority', statement: "Your job is to do what I say. If you don't like it, the door is right there.", tactic: 'Ultimatum', skillsTested: ['regulate', 'negotiate', 'assert'], difficulty: 8 },

  // Negotiator escalation (difficulty 5-10)
  { id: 'pd_ng_1', personaId: 'negotiator', statement: "I've already made significant concessions. It's your turn.", tactic: 'False concession', skillsTested: ['negotiate', 'listen'], difficulty: 5 },
  { id: 'pd_ng_2', personaId: 'negotiator', statement: "My other offer is 30% better. I'm giving you first right of refusal as a courtesy.", tactic: 'BATNA bluff', skillsTested: ['negotiate', 'defend'], difficulty: 6 },
  { id: 'pd_ng_3', personaId: 'negotiator', statement: "Let's be honest — you need this more than I do. Shall we be realistic?", tactic: 'Power asymmetry exploit', skillsTested: ['negotiate', 'regulate', 'assert'], difficulty: 7 },
  { id: 'pd_ng_4', personaId: 'negotiator', statement: "I just got off the phone with my lawyer. We can do this the easy way or the hard way.", tactic: 'Legal threat', skillsTested: ['regulate', 'defend', 'negotiate'], difficulty: 8 },
  { id: 'pd_ng_5', personaId: 'negotiator', statement: "You realize if this falls through, the people depending on you are the ones who suffer.", tactic: 'Stakeholder leverage', skillsTested: ['regulate', 'negotiate', 'empathize'], difficulty: 9 },
  { id: 'pd_ng_6', personaId: 'negotiator', statement: "We both know your position is weak. Accept the terms or I walk — and I won't come back.", tactic: 'Full court press', skillsTested: ['regulate', 'negotiate', 'assert', 'defend'], difficulty: 10 },
];

export function getPromptsForDifficulty(targetDifficulty: number): PressurePrompt[] {
  const range = 1;
  return PRESSURE_PROMPTS.filter(
    (p) => p.difficulty >= targetDifficulty - range && p.difficulty <= targetDifficulty + range,
  );
}

export function getNextPrompt(
  currentDifficulty: number,
  usedIds: Set<string>,
): PressurePrompt | null {
  const candidates = getPromptsForDifficulty(currentDifficulty).filter(
    (p) => !usedIds.has(p.id),
  );
  if (candidates.length === 0) {
    const fallback = PRESSURE_PROMPTS.filter((p) => !usedIds.has(p.id));
    if (fallback.length === 0) return null;
    fallback.sort((a, b) => Math.abs(a.difficulty - currentDifficulty) - Math.abs(b.difficulty - currentDifficulty));
    return fallback[0];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
