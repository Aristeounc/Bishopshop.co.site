'use client';

import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-primary/10 to-transparent rounded-3xl"></div>

        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Ready to Master <GradientText>Difficult Conversations?</GradientText>
        </h2>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Start practicing today. Free tier includes 3 practice rounds per month with full AI feedback. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary">
            Download Abacus Free
          </Button>
          <Button size="lg" variant="ghost">
            Try Free Preview
          </Button>
        </div>

        <p className="text-sm text-slate-400 mt-8">
          Available on iOS and Android. Premium subscription from $9.99/month.
        </p>
      </div>
    </section>
  );
}
