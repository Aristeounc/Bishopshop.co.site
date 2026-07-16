'use client';

import { Card } from '@/components/ui/Card';

const valuePropps = [
  {
    icon: '🤖',
    title: 'AI Practice Partner',
    description: 'Powered by Claude, our AI adapts to your skill level and gives real-time feedback on your communication techniques.',
  },
  {
    icon: '👥',
    title: 'Peer Sparring',
    description: 'Match with real users for voice conversations. Get scored and see how you compare on the global leaderboard.',
  },
  {
    icon: '📈',
    title: 'Skill Progression',
    description: 'Track your progress with ELO-style rankings, streak tracking, and detailed analytics on your communication growth.',
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valuePropps.map((prop) => (
            <Card key={prop.title} className="text-center space-y-4" hover={true}>
              <div className="text-6xl flex justify-center">{prop.icon}</div>
              <h3 className="text-2xl font-bold">{prop.title}</h3>
              <p className="text-slate-300 leading-relaxed">{prop.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
