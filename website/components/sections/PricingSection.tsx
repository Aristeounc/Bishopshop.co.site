'use client';

export function PricingSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Free</h3>
            <p className="text-slate-300 mb-6">3 practice rounds per month</p>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition">Get Started</button>
          </div>
          <div className="bg-brand-primary/10 p-8 rounded-lg border border-brand-primary">
            <h3 className="text-xl font-bold mb-4">Premium</h3>
            <p className="text-slate-300 mb-6">Unlimited practice + sparring</p>
            <button className="w-full bg-brand-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">Download App</button>
          </div>
        </div>
      </div>
    </section>
  );
}
