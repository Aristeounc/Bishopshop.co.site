import { SCENARIOS } from '@/constants/scenarios';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Scenarios — Practice Conversations | Refutation',
  description: 'Master 6 different conversation types: job interviews, negotiations, public speaking, and more.',
};

export default function ScenariosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-16">
            <Badge variant="primary" className="mb-4">
              Scenarios
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              Master Every Type of Conversation
            </h1>
            <p className="text-xl text-slate-300">
              Choose from 6 scientifically-designed scenarios covering the most important conversations you'll have in your career.
            </p>
          </div>

          {/* Scenarios grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SCENARIOS.map((scenario) => {
              const difficultyColors = {
                beginner: 'text-green-400',
                intermediate: 'text-yellow-400',
                advanced: 'text-red-400',
              };

              return (
                <Link key={scenario.id} href={`/scenarios/${scenario.id}`}>
                  <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl p-8 hover:border-brand-accent hover:shadow-xl hover:shadow-brand-accent/20 transition-all h-full cursor-pointer">
                    {/* Icon */}
                    <div className="text-6xl mb-6">{scenario.icon}</div>

                    {/* Title & difficulty */}
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-brand-accent transition-colors">
                        {scenario.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">{scenario.difficulty}</Badge>
                        <span className="text-sm text-slate-400">~{scenario.estimatedTime} min</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 mb-6">{scenario.description}</p>

                    {/* Topics */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">Key Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {scenario.topicsTaught.map((topic) => (
                          <span key={topic} className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-brand-accent font-semibold group-hover:translate-x-2 transition-transform">
                      Start Practicing <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Info section */}
          <div className="mt-20 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">How Scenarios Work</h3>
            <p className="text-slate-300 mb-6">
              Each scenario is designed to simulate a realistic conversation situation. When you practice:
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-brand-accent mt-1">✓</span>
                <span>You'll face realistic objections and responses from Claude AI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent mt-1">✓</span>
                <span>Get real-time feedback on your communication style</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent mt-1">✓</span>
                <span>Learn specific techniques to handle tough moments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent mt-1">✓</span>
                <span>Track progress and build a consistent practice habit</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
