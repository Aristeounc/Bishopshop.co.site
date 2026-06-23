import { SkillTrackId } from '@/models/types';

export type ReframeTechnique =
  | 'i_statement'
  | 'calibrated_question'
  | 'empathy_label'
  | 'boundary_setting'
  | 'reframe';

export interface ReframeChallenge {
  id: string;
  toxicStatement: string;
  technique: ReframeTechnique;
  techniqueLabel: string;
  hint: string;
  exampleReframe: string;
  skillsTested: SkillTrackId[];
  difficulty: number;
}

export interface ReframeRound {
  challenge: ReframeChallenge;
  userReframe: string;
  score: number;
  timeMs: number;
  isGoldenReframe: boolean;
}

export interface ReframeRaceResult {
  rounds: ReframeRound[];
  totalXp: number;
  goldenCount: number;
  averageTime: number;
  perfectRun: boolean;
}

const GOLDEN_THRESHOLD = 85;
const SPEED_BONUS_MS = 15000;
const ROUND_COUNT = 5;

export { ROUND_COUNT };

export function calculateReframeXp(rounds: ReframeRound[]): number {
  let xp = 0;
  for (const round of rounds) {
    xp += Math.round(round.score * 0.8);
    if (round.isGoldenReframe) xp += 10;
    if (round.timeMs < SPEED_BONUS_MS) xp += 5;
  }
  const allGolden = rounds.length === ROUND_COUNT && rounds.every((r) => r.isGoldenReframe);
  if (allGolden) xp += 25;
  return xp;
}

export function isGoldenReframe(score: number): boolean {
  return score >= GOLDEN_THRESHOLD;
}

export function getTechniqueColor(technique: ReframeTechnique): string {
  const map: Record<ReframeTechnique, string> = {
    i_statement: '#FF8C42',
    calibrated_question: '#45B7D1',
    empathy_label: '#FF69B4',
    boundary_setting: '#7B68EE',
    reframe: '#2EA043',
  };
  return map[technique];
}

export const REFRAME_CHALLENGES: ReframeChallenge[] = [
  // I-Statement challenges
  {
    id: 'rf_is_1',
    toxicStatement: "You always ignore me when I'm talking to you.",
    technique: 'i_statement',
    techniqueLabel: 'I-Statement',
    hint: "Express how YOU feel without blaming. Start with 'I feel...'",
    exampleReframe: "I feel unheard when I'm speaking and don't get a response. Can we talk about it?",
    skillsTested: ['assert', 'regulate'],
    difficulty: 1,
  },
  {
    id: 'rf_is_2',
    toxicStatement: "You never pull your weight on this team.",
    technique: 'i_statement',
    techniqueLabel: 'I-Statement',
    hint: 'Focus on the specific impact on you, not their character.',
    exampleReframe: "I feel overwhelmed when tasks aren't distributed evenly. Can we review the workload together?",
    skillsTested: ['assert', 'negotiate'],
    difficulty: 2,
  },
  {
    id: 'rf_is_3',
    toxicStatement: "You're being completely selfish about this.",
    technique: 'i_statement',
    techniqueLabel: 'I-Statement',
    hint: 'Name the need behind the accusation without accepting the label.',
    exampleReframe: "I feel hurt hearing that. My intention wasn't to be selfish — I was trying to protect my time. Can we find a compromise?",
    skillsTested: ['assert', 'empathize'],
    difficulty: 3,
  },

  // Calibrated Question challenges
  {
    id: 'rf_cq_1',
    toxicStatement: "Because I said so. End of discussion.",
    technique: 'calibrated_question',
    techniqueLabel: 'Calibrated Question',
    hint: "Ask a 'how' or 'what' question that invites them to think, not defend.",
    exampleReframe: "What's the reasoning behind that decision? I'd like to understand so I can get on board.",
    skillsTested: ['negotiate', 'listen'],
    difficulty: 2,
  },
  {
    id: 'rf_cq_2',
    toxicStatement: "If you don't agree, we'll just do it without you.",
    technique: 'calibrated_question',
    techniqueLabel: 'Calibrated Question',
    hint: "Use a 'how' question to highlight the consequence without threatening.",
    exampleReframe: "How do you see this working if key perspectives are left out of the process?",
    skillsTested: ['negotiate', 'defend'],
    difficulty: 3,
  },
  {
    id: 'rf_cq_3',
    toxicStatement: "You're either with us or against us.",
    technique: 'calibrated_question',
    techniqueLabel: 'Calibrated Question',
    hint: 'Challenge the false binary without being confrontational.',
    exampleReframe: "What would it look like if I could support the team while also raising my concerns?",
    skillsTested: ['negotiate', 'assert'],
    difficulty: 4,
  },

  // Empathy Label challenges
  {
    id: 'rf_el_1',
    toxicStatement: "Nobody in this family appreciates anything I do!",
    technique: 'empathy_label',
    techniqueLabel: 'Empathy Label',
    hint: "Name what they seem to be feeling. Start with 'It sounds like...' or 'It seems like...'",
    exampleReframe: "It sounds like you're feeling taken for granted, and that really hurts. Tell me more.",
    skillsTested: ['empathize', 'listen'],
    difficulty: 1,
  },
  {
    id: 'rf_el_2',
    toxicStatement: "Fine. Do whatever you want. I don't care anymore.",
    technique: 'empathy_label',
    techniqueLabel: 'Empathy Label',
    hint: 'Look past the words to the emotion underneath.',
    exampleReframe: "It seems like you've been carrying a lot and you feel like giving up. I don't want that. What do you need right now?",
    skillsTested: ['empathize', 'connect'],
    difficulty: 2,
  },
  {
    id: 'rf_el_3',
    toxicStatement: "Everyone else manages just fine. What's your excuse?",
    technique: 'empathy_label',
    techniqueLabel: 'Empathy Label',
    hint: "Label the frustration behind the comparison, then redirect.",
    exampleReframe: "It sounds like you're frustrated with the pace of things. I'd like to understand what success looks like from your perspective.",
    skillsTested: ['empathize', 'regulate'],
    difficulty: 3,
  },

  // Boundary Setting challenges
  {
    id: 'rf_bs_1',
    toxicStatement: "You owe me — remember when I helped you last month?",
    technique: 'boundary_setting',
    techniqueLabel: 'Boundary Setting',
    hint: "Acknowledge the past kindness, then firmly state your limit.",
    exampleReframe: "I really appreciated your help then. Right now though, this isn't something I can commit to. I hope you understand.",
    skillsTested: ['assert', 'defend'],
    difficulty: 2,
  },
  {
    id: 'rf_bs_2',
    toxicStatement: "I need you to drop everything and deal with this right now.",
    technique: 'boundary_setting',
    techniqueLabel: 'Boundary Setting',
    hint: "Show willingness to help while protecting your time.",
    exampleReframe: "I can see this is urgent for you. I can give it my full attention at 3pm — would that work?",
    skillsTested: ['assert', 'negotiate'],
    difficulty: 3,
  },
  {
    id: 'rf_bs_3',
    toxicStatement: "If you were a real friend, you wouldn't say no to me.",
    technique: 'boundary_setting',
    techniqueLabel: 'Boundary Setting',
    hint: "Redefine what friendship means without accepting the guilt.",
    exampleReframe: "Being a good friend means being honest with you. I care about our relationship, and I need to say no to this one.",
    skillsTested: ['assert', 'defend', 'empathize'],
    difficulty: 4,
  },

  // Reframe challenges
  {
    id: 'rf_rf_1',
    toxicStatement: "This whole project is a disaster. We're going to fail.",
    technique: 'reframe',
    techniqueLabel: 'Reframe',
    hint: 'Acknowledge the difficulty, then shift the lens to what can be controlled.',
    exampleReframe: "There are real challenges here. Let's focus on what we can fix in the next 48 hours — what's the biggest blocker?",
    skillsTested: ['regulate', 'connect'],
    difficulty: 2,
  },
  {
    id: 'rf_rf_2',
    toxicStatement: "You got lucky — it wasn't really talent that got you there.",
    technique: 'reframe',
    techniqueLabel: 'Reframe',
    hint: 'Reframe without being defensive — own your story.',
    exampleReframe: "Preparation met opportunity. I put in the work, and I'm proud of the result regardless of how others see it.",
    skillsTested: ['regulate', 'assert'],
    difficulty: 3,
  },
  {
    id: 'rf_rf_3',
    toxicStatement: "You'll never change. This is just who you are.",
    technique: 'reframe',
    techniqueLabel: 'Reframe',
    hint: "Challenge the fixed-identity claim without getting defensive.",
    exampleReframe: "I'm a work in progress, like everyone. I may not be where you want me to be yet, but I'm growing. That counts for something.",
    skillsTested: ['regulate', 'assert', 'empathize'],
    difficulty: 4,
  },
];

export function getChallengesForRound(roundCount: number): ReframeChallenge[] {
  const sorted = [...REFRAME_CHALLENGES].sort((a, b) => a.difficulty - b.difficulty);
  const step = Math.max(1, Math.floor(sorted.length / roundCount));
  const selected: ReframeChallenge[] = [];
  const usedTechniques = new Set<ReframeTechnique>();

  for (let i = 0; i < sorted.length && selected.length < roundCount; i += step) {
    const candidate = sorted[i];
    if (!usedTechniques.has(candidate.technique)) {
      selected.push(candidate);
      usedTechniques.add(candidate.technique);
    }
  }

  while (selected.length < roundCount) {
    const remaining = sorted.filter((c) => !selected.includes(c));
    if (remaining.length === 0) break;
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return selected;
}

export function getRandomChallenges(count: number): ReframeChallenge[] {
  const shuffled = [...REFRAME_CHALLENGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
