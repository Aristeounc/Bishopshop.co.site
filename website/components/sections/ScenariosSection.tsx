'use client';

import { SCENARIOS } from '@/constants/scenarios';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ScenariosSection() {
  const difficultyColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  } as const;

  return (
    <section id="scenarios" className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary">Practice Scenarios</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Practice Any Difficult Conversation
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose from 6 carefully designed scenarios based on real-world situations. Each scenario teaches different techniques and builds specific skills.
          </p>
        </div>

        {/* Scenarios grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENARIOS.map((scenario, index) => (
            <Card
              key={scenario.id}
              className="flex flex-col h-full group cursor-pointer"
              hover={true}
            >
              {/* Icon and difficulty */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{scenario.icon}</div>
                <Badge variant={difficultyColors[scenario.difficulty]}>
                  {scenario.difficulty}
                </Badge>
              </div>

              {/* Title and description */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-brand-accent transition-colors">
                {scenario.title}
              </h3>
              <p className="text-slate-300 text-sm mb-4 flex-grow">
                {scenario.shortDescription}
              </p>

              {/* Topics taught */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.topicsTaught.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                  {scenario.topicsTaught.length > 2 && (
                    <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">
                      +{scenario.topicsTaught.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Time and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-sm text-slate-400">
                  ~{scenario.estimatedTime} min
                </span>
                <button className="text-brand-accent font-semibold text-sm hover:text-brand-primary transition-colors">
                  Try Free →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
