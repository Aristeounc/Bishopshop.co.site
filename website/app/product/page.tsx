import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Product — Abacus | The Conversation Gym',
  description: 'Learn about Abacus features: AI practice, peer sparring, skill progression, analytics, and community.',
};

const features = [
  {
    icon: '🤖',
    title: 'AI Practice Partner',
    description: 'Practice with Claude, an advanced AI that plays realistic personas. Get real-time feedback on your technique.',
  },
  {
    icon: '👥',
    title: 'Peer Sparring',
    description: 'Voice conversations with real users matched by skill level. Both participants get AI-generated scorecards.',
  },
  {
    icon: '📊',
    title: 'Skill Analytics',
    description: 'Track progress with ELO ratings, streak tracking, and detailed performance analytics across all 6 scenarios.',
  },
  {
    icon: '🏆',
    title: 'Global Leaderboards',
    description: 'Compete globally and by scenario type. Earn belt ranks (white through black) as you progress.',
  },
  {
    icon: '📚',
    title: 'Technique Library',
    description: '47 evidence-based communication techniques from psychology and negotiation. Learn the theory behind each.',
  },
  {
    icon: '💾',
    title: 'Capture Cards',
    description: 'Set implementation intentions for real-life conversations. Get prompted to reflect on how you used new techniques.',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Great for trying Abacus',
    features: [
      '3 practice rounds per month',
      'All 6 scenarios',
      'AI feedback',
      'Basic analytics',
    ],
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'For serious communicators',
    features: [
      'Unlimited practice rounds',
      'Peer sparring (voice)',
      'Advanced analytics',
      'Belt rank progression',
      'Capture card system',
      'Priority matching',
      'Ad-free experience',
    ],
    highlighted: true,
  },
];

export default function ProductPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-16">
            <Badge variant="primary" className="mb-4">
              Product
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              Everything You Need to Master Conversations
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Abacus combines AI practice, peer competition, and habit-building tools to transform how you communicate.
            </p>
          </div>

          {/* Features grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-brand-accent transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-20">
            <h2 className="text-3xl font-bold mb-8">How Abacus Works</h2>

            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pick a Scenario</h3>
                  <p className="text-slate-300">
                    Choose from job interviews, negotiations, public speaking, difficult conversations, and more.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Practice with AI or Peers</h3>
                  <p className="text-slate-300">
                    Have a realistic conversation with Claude or match with another user for live sparring.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Detailed Feedback</h3>
                  <p className="text-slate-300">
                    Receive comprehensive analysis of your communication style, techniques used, and areas to improve.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Track Progress & Compete</h3>
                  <p className="text-slate-300">
                    Build streaks, earn belt ranks, and climb global leaderboards. Make practice a habit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`border-2 rounded-xl p-8 ${
                    tier.highlighted
                      ? 'border-brand-primary bg-brand-primary/10 scale-105'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-slate-400">{tier.period}</span>}
                  </div>

                  <Button
                    size="lg"
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    className="w-full mb-8"
                  >
                    Download App
                  </Button>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-brand-accent mt-1">✓</span>
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border-2 border-brand-accent/30 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Communication?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Download Abacus free today. No credit card required. Premium available in-app.
            </p>
            <Button size="lg" variant="primary">
              Download Abacus for Free
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
