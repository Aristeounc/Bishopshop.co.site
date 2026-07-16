'use client';

export function FAQSection() {
  return (
    <section className="py-16 px-4 bg-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">FAQ</h2>
        <div className="space-y-4">
          {['What is Abacus?', 'How does AI sparring work?', 'Is my data private?'].map((q) => (
            <div key={q} className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <h3 className="font-bold mb-2">{q}</h3>
              <p className="text-slate-300 text-sm">Answer coming soon...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
