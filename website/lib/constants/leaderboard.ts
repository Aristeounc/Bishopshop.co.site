/**
 * Sample leaderboard data
 * In production, this would be real-time from Firestore
 */

export interface LeaderboardEntry {
  rank: number;
  username: string;
  belt: 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'purple' | 'brown' | 'black';
  streak: number;
  totalSessions: number;
  scenariosCompleted: string[];
}

const BELTS = {
  white: { label: 'White', color: 'slate' },
  yellow: { label: 'Yellow', color: 'yellow' },
  orange: { label: 'Orange', color: 'orange' },
  green: { label: 'Green', color: 'green' },
  blue: { label: 'Blue', color: 'blue' },
  purple: { label: 'Purple', color: 'purple' },
  brown: { label: 'Brown', color: 'amber' },
  black: { label: 'Black', color: 'slate' },
};

export function getBeltColor(belt: LeaderboardEntry['belt']) {
  return BELTS[belt];
}

export const LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'SarahC_PM',
    belt: 'black',
    streak: 47,
    totalSessions: 142,
    scenariosCompleted: ['job-interview', 'negotiation', 'public-speaking'],
  },
  {
    rank: 2,
    username: 'MarcusJ_Sales',
    belt: 'brown',
    streak: 32,
    totalSessions: 98,
    scenariosCompleted: ['negotiation', 'influence-persuasion', 'job-interview'],
  },
  {
    rank: 3,
    username: 'ElenaR_Eng',
    belt: 'blue',
    streak: 28,
    totalSessions: 87,
    scenariosCompleted: ['public-speaking', 'difficult-conversation', 'conflict-resolution'],
  },
  {
    rank: 4,
    username: 'JamesL_Consulting',
    belt: 'blue',
    streak: 24,
    totalSessions: 76,
    scenariosCompleted: ['job-interview', 'influence-persuasion', 'negotiation'],
  },
  {
    rank: 5,
    username: 'PriyaP_Manager',
    belt: 'green',
    streak: 22,
    totalSessions: 65,
    scenariosCompleted: ['difficult-conversation', 'conflict-resolution'],
  },
  {
    rank: 6,
    username: 'DavidK_AI',
    belt: 'green',
    streak: 19,
    totalSessions: 58,
    scenariosCompleted: ['public-speaking', 'job-interview'],
  },
  {
    rank: 7,
    username: 'AmayaC_Design',
    belt: 'orange',
    streak: 16,
    totalSessions: 48,
    scenariosCompleted: ['job-interview', 'public-speaking'],
  },
  {
    rank: 8,
    username: 'RahulP_Finance',
    belt: 'yellow',
    streak: 12,
    totalSessions: 35,
    scenariosCompleted: ['negotiation'],
  },
];
