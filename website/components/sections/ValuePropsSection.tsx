'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

const valuePropps = [
  {
    icon: '🤖',
    title: 'AI Practice Partner',
    description: 'Powered by Claude, our AI adapts to your skill level and gives real-time feedback on your communication techniques.',
  },
  {
    icon: '👥',
    title: 'Peer Sparring',
    description: 'Match with real users for voice conversations. Get scored and see how you compare on the global leaderboard.',
  },
  {
    icon: '📈',
    title: 'Skill Progression',
    description: 'Track your progress with ELO-style rankings, streak tracking, and detailed analytics on your communication growth.',
  },
];

export function ValuePropsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {valuePropps.map((prop, i) => (
            <motion.div key={prop.title} variants={itemVariants}>
              <Card className="text-center space-y-4" hover={true}>
                <motion.div
                  className="text-6xl flex justify-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {prop.icon}
                </motion.div>
                <h3 className="text-2xl font-bold">{prop.title}</h3>
                <p className="text-slate-300 leading-relaxed">{prop.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
