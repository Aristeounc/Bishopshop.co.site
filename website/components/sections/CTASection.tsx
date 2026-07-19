'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-primary/10 to-transparent rounded-3xl"></div>

        <motion.h2
          className="text-4xl lg:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          Ready to Master <GradientText>Difficult Conversations?</GradientText>
        </motion.h2>

        <motion.p
          className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          Start practicing today. Free tier includes 3 practice rounds per month with full AI feedback. No credit card required.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Button size="lg" variant="primary">
            Download Abacus Free
          </Button>
          <Button size="lg" variant="ghost">
            Try Free Preview
          </Button>
        </motion.div>

        <motion.p
          className="text-sm text-slate-400 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          Available on iOS and Android. Premium subscription from $9.99/month.
        </motion.p>
      </div>
    </section>
  );
}
