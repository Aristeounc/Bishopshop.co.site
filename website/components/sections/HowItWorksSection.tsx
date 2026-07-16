'use client';

import { Badge } from '@/components/ui/Badge';

const steps = [
  {
    number: 1,
    title: 'Pick a Scenario',
    description: 'Choose from job interviews, difficult conversations, negotiations, and more',
  },
  {
    number: 2,
    title: 'Practice with AI',
    description: 'Have a realistic conversation with Claude playing the other person',
  },
  {
    number: 3,
    title: 'Get Feedback',
    description: 'Receive detailed analysis of your communication style and technique usage',
  },
  {
    number: 4,
    title: 'Track Progress',
    description: 'Build streaks, earn belt ranks, and compete on the global leaderboard',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-20 px-4 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary">How it Works</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Practice Like an Athlete
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Just like physical training, conversation skills improve with deliberate practice, feedback, and progression.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[60%] w-[200%] h-0.5 bg-gradient-to-r from-brand-primary to-transparent"></div>
              )}

              {/* Step card */}
              <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-brand-accent transition-all">
                {/* Number circle */}
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
