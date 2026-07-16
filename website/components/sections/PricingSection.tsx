'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with limited practice',
    features: [
      '3 practice rounds per month',
      'All 6 scenarios',
      'AI feedback on responses',
      'Community leaderboards (view only)',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    description: 'Unlimited practice and peer sparring',
    features: [
      'Unlimited practice rounds',
      'Peer sparring (voice)',
      'Detailed analytics & progress tracking',
      'Belt ranks and skill progression',
      'Advanced feedback on techniques',
      'Global & skill-based leaderboards',
      'Priority matching in sparring queue',
    ],
    cta: 'Download App',
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary">Pricing</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when you want unlimited practice and peer sparring.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.highlighted ? 'ring-2 ring-brand-primary scale-105' : ''
              }`}
              hover={false}
            >
              {tier.highlighted && (
                <Badge variant="primary" className="mb-4">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== '$0' && (
                    <span className="text-slate-400">/month</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{tier.description}</p>
              </div>

              {/* Features list */}
              <div className="mb-8 flex-grow space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="text-brand-accent mt-1">✓</span>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
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
          ))}
        </div>
      </div>
    </section>
  );
}
