'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const tiers = [
  {
    name: 'Novice',
    price: '$0',
    description: 'Start your debate journey free',
    features: [
      '3 debate rounds per month',
      'All 6 debate types',
      'AI opponent feedback',
      'Fallacy detection guide',
      'Community leaderboards (view only)',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Champion',
    price: '$11.99',
    description: 'Unlimited debates and tournament access',
    features: [
      'Unlimited debate rounds',
      'Live peer-to-peer debate',
      'Tournament competitions',
      'ELO rating system',
      'Advanced argumentation analytics',
      'Technique mastery tracking',
      'Priority opponent matching',
      'Debate strategy coaching',
    ],
    cta: 'Download App',
    highlighted: true,
  },
];

export function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Badge variant="primary">Pricing</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Debate Levels for Every Competitor
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free as a Novice debater. Upgrade to Champion for unlimited tournaments and live peer debates.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {tiers.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              whileHover={tier.highlighted ? { scale: 1.02 } : {}}
            >
              <Card
                className={`flex flex-col ${
                  tier.highlighted ? 'ring-2 ring-brand-primary' : ''
                }`}
                hover={false}
              >
                {tier.highlighted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge variant="primary" className="mb-4">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <motion.span
                      className="text-4xl font-bold"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      {tier.price}
                    </motion.span>
                    {tier.price !== '$0' && (
                      <span className="text-slate-400">/month</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{tier.description}</p>
                </div>

                {/* Features list */}
                <div className="mb-8 flex-grow space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-3"
                      custom={featureIndex}
                      variants={featureVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <span className="text-brand-accent mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
