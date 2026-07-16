'use client';

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4 bg-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Pick Scenario', 'Practice', 'Get Feedback', 'Improve'].map((step, i) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">{i + 1}</div>
              <h3 className="font-bold mb-2">{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
