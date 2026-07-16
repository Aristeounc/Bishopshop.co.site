'use client';

export function ValuePropsSection() {
  return (
    <section className="py-16 px-4 bg-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Abacus?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['AI Practice Partner', 'Peer Sparring', 'Skill Progression'].map((prop) => (
            <div key={prop} className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-2">{prop}</h3>
              <p className="text-slate-300">Coming soon...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
