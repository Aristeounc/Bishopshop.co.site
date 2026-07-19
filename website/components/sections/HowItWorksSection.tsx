'use client';

import { motion } from 'framer-motion';
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="how" className="py-20 px-4 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Badge variant="primary">How it Works</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Practice Like an Athlete
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Just like physical training, conversation skills improve with deliberate practice, feedback, and progression.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} className="relative" variants={itemVariants}>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-20 left-[60%] w-[200%] h-0.5 bg-gradient-to-r from-brand-primary to-transparent"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: 'left' }}
                />
              )}

              {/* Step card */}
              <motion.div
                className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-brand-accent transition-all"
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Number circle */}
                <motion.div
                  className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
                >
                  {step.number}
                </motion.div>

                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
