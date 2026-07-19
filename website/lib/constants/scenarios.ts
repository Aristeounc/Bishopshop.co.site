/**
 * Scenario definitions for Refutation
 * These are used throughout the site: hero, product page, scenarios listing, etc.
 */

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  icon: string;
  image?: string;
  shortDescription: string;
  topicsTaught: string[];
  exampleQuestion?: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'policy-debate',
    title: 'Policy Debate',
    description: 'Defend or challenge policy positions with logical arguments and evidence-based counterarguments',
    difficulty: 'beginner',
    estimatedTime: 15,
    icon: '📋',
    shortDescription: 'Master policy argumentation',
    topicsTaught: ['Evidence gathering', 'Logical structure', 'Counter-claims', 'Policy frameworks'],
    exampleQuestion: 'Should AI regulation be stricter? Defend your position.',
  },
  {
    id: 'logical-fallacies',
    title: 'Spotting Fallacies',
    description: 'Identify and refute common logical fallacies in arguments with precision counterarguments',
    difficulty: 'intermediate',
    estimatedTime: 12,
    icon: '🎯',
    shortDescription: 'Catch weak arguments',
    topicsTaught: ['Ad hominem', 'Straw man', 'Begging question', 'False dilemma'],
    exampleQuestion: 'That argument commits a fallacy. Explain which one and why.',
  },
  {
    id: 'public-debate',
    title: 'Public Debate',
    description: 'Participate in formal debate with prepared positions, cross-examination, and closing arguments',
    difficulty: 'intermediate',
    estimatedTime: 20,
    icon: '🏆',
    shortDescription: 'Win public arguments',
    topicsTaught: ['Opening statements', 'Cross-examination', 'Rebuttals', 'Closing arguments'],
    exampleQuestion: 'Present and defend your position in a structured debate format.',
  },
  {
    id: 'business-pitch',
    title: 'Business Pitch Defense',
    description: 'Defend your business idea against tough questions and objections from skeptical investors',
    difficulty: 'advanced',
    estimatedTime: 18,
    icon: '💼',
    shortDescription: 'Persuade investors',
    topicsTaught: ['Market analysis', 'Handling objections', 'ROI arguments', 'Competitive positioning'],
    exampleQuestion: 'Your market data is outdated. How do you refute this objection?',
  },
  {
    id: 'debate-tournament',
    title: 'Tournament Debate',
    description: 'Compete in high-pressure debate scenarios with time constraints and multiple rounds',
    difficulty: 'advanced',
    estimatedTime: 15,
    icon: '⚡',
    shortDescription: 'Competitive debate mastery',
    topicsTaught: ['Speed speaking', 'Strategic arguments', 'Pressure management', 'Win-loss tactics'],
    exampleQuestion: 'Win this debate under tournament conditions with time pressure.',
  },
  {
    id: 'philosophical-debate',
    title: 'Philosophical Debate',
    description: 'Engage in deep philosophical arguments about ethics, truth, and human nature',
    difficulty: 'advanced',
    estimatedTime: 18,
    icon: '✨',
    shortDescription: 'Master abstract argumentation',
    topicsTaught: ['Metaphysics', 'Epistemology', 'Ethics', 'Logic systems'],
    exampleQuestion: 'Defend your position on free will vs determinism.',
  },
];

export const SCENARIO_MAP = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return SCENARIO_MAP.get(id);
}

export function getScenariosByDifficulty(difficulty: Scenario['difficulty']): Scenario[] {
  return SCENARIOS.filter((s) => s.difficulty === difficulty);
}
