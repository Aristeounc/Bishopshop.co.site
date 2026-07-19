/**
 * Sample testimonials for the site
 * In production, these would be fetched from a database
 */

export interface Testimonial {
  id: string;
  author: string;
  company?: string;
  role?: string;
  quote: string;
  result: string;
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    company: 'Google',
    role: 'Product Manager',
    quote: 'I practiced debate scenarios with Refutation for 2 weeks. The feedback on my arguments was incredibly detailed and helped me counter tough objections with confidence.',
    result: 'Got the job offer',
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    company: 'McKinsey',
    role: 'Consultant',
    quote: 'The negotiation scenarios prepared me perfectly for my salary discussion. I ended up 18% higher than the initial offer.',
    result: '18% salary increase',
  },
  {
    id: '3',
    author: 'Elena Rodriguez',
    company: 'Amazon',
    role: 'Engineer',
    quote: 'Public speaking was my biggest fear. After 10 practice sessions, I presented to 200 people without anxiety.',
    result: 'Confidence +87%',
  },
  {
    id: '4',
    author: 'James Liu',
    company: 'Stripe',
    role: 'Sales Lead',
    quote: 'The AI feedback on my argumentation was spot-on. My persuasion improved dramatically and I\'ve closed 40% more deals since using Refutation.',
    result: 'Sales up 40%',
  },
  {
    id: '5',
    author: 'Priya Patel',
    company: 'Meta',
    role: 'Manager',
    quote: 'Used Refutation to sharpen my persuasion and refutation skills for difficult discussions. It made me a better manager and my team engagement scores improved by 35%.',
    result: 'Team engagement +35%',
  },
  {
    id: '6',
    author: 'David Kim',
    company: 'OpenAI',
    role: 'Researcher',
    quote: 'Competing on the leaderboard with other users made practice fun and addictive. The streaks kept me consistent.',
    result: '30-day streak',
  },
];
