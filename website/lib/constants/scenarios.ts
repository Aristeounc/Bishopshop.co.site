/**
 * Scenario definitions for Abacus
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
    id: 'job-interview',
    title: 'Job Interview',
    description: 'Practice answering tough interview questions and negotiating offers with realistic AI personas',
    difficulty: 'beginner',
    estimatedTime: 15,
    icon: '🎯',
    shortDescription: 'Land your dream role',
    topicsTaught: ['STAR method', 'Behavioral questions', 'Salary negotiation', 'Confidence under pressure'],
    exampleQuestion: 'Tell me about a time you failed and what you learned',
  },
  {
    id: 'difficult-conversation',
    title: 'Difficult Conversation',
    description: 'Navigate emotionally charged discussions with colleagues, friends, or family members',
    difficulty: 'intermediate',
    estimatedTime: 12,
    icon: '💬',
    shortDescription: 'Handle tough moments with grace',
    topicsTaught: ['Active listening', 'Empathy', 'De-escalation', 'Clear communication'],
    exampleQuestion: 'I think you made a mistake on the project. How do you respond?',
  },
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    description: 'Build confidence presenting ideas to audiences, from small teams to large crowds',
    difficulty: 'intermediate',
    estimatedTime: 20,
    icon: '🎤',
    shortDescription: 'Command the room',
    topicsTaught: ['Pacing', 'Vocal variety', 'Audience engagement', 'Managing anxiety'],
    exampleQuestion: 'Present a quarterly business update to skeptical leadership',
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    description: 'Master persuasion techniques and win-win negotiation tactics',
    difficulty: 'advanced',
    estimatedTime: 18,
    icon: '⚖️',
    shortDescription: 'Get what you deserve',
    topicsTaught: ['Value creation', 'Anchoring', 'Concession tactics', 'BATNA'],
    exampleQuestion: 'You want a 20% raise. Your manager says the budget is tight.',
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    description: 'Turn conflicts into opportunities by understanding different perspectives and finding common ground',
    difficulty: 'advanced',
    estimatedTime: 15,
    icon: '🤝',
    shortDescription: 'Resolve disputes diplomatically',
    topicsTaught: ['Perspective-taking', 'Mediation', 'Finding compromise', 'Long-term relationship building'],
    exampleQuestion: 'Two team members disagree fundamentally on project direction',
  },
  {
    id: 'influence-persuasion',
    title: 'Influence & Persuasion',
    description: 'Learn the psychology behind influence and ethical persuasion techniques',
    difficulty: 'advanced',
    estimatedTime: 18,
    icon: '✨',
    shortDescription: 'Lead with influence',
    topicsTaught: ['Reciprocity', 'Social proof', 'Authority', 'Scarcity', 'Liking', 'Consistency'],
    exampleQuestion: 'Persuade a budget-conscious stakeholder to invest in your initiative',
  },
];

export const SCENARIO_MAP = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return SCENARIO_MAP.get(id);
}

export function getScenariosByDifficulty(difficulty: Scenario['difficulty']): Scenario[] {
  return SCENARIOS.filter((s) => s.difficulty === difficulty);
}
