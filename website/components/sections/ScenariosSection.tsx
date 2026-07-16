'use client';

import { SCENARIOS } from '@/constants/scenarios';

export function ScenariosSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Practice Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENARIOS.map((scenario) => (
            <div key={scenario.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-brand-accent transition">
              <div className="text-3xl mb-3">{scenario.icon}</div>
              <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
              <p className="text-slate-300 text-sm mb-4">{scenario.shortDescription}</p>
              <button className="text-brand-accent hover:text-brand-primary transition">Learn more →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
