import { SCENARIOS, getScenario } from '@/constants/scenarios';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SCENARIOS.map((scenario) => ({ id: scenario.id }));
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const scenario = getScenario(params.id);

  if (!scenario) {
    return { title: 'Not Found' };
  }

  return {
    title: `${scenario.title} Practice — Refutation`,
    description: scenario.description,
  };
}

export default async function ScenarioDetailPage(props: Props) {
  const params = await props.params;
  const scenario = getScenario(params.id);

  if (!scenario) {
    notFound();
  }

  const relatedScenarios = SCENARIOS.filter(
    (s) => s.difficulty === scenario.difficulty && s.id !== scenario.id
  ).slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link href="/scenarios" className="text-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2 mb-8">
            ← Back to Scenarios
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="text-6xl">{scenario.icon}</div>
              <Badge variant="primary">{scenario.difficulty}</Badge>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-4">{scenario.title}</h1>
            <p className="text-xl text-slate-300 mb-6">{scenario.description}</p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="primary">
                Download App to Practice
              </Button>
              <Button size="lg" variant="ghost">
                Try Free Preview
              </Button>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-12">
            {/* Overview */}
            <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">About This Scenario</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                {scenario.description}
              </p>
              <p className="text-slate-300 leading-relaxed">
                This scenario is designed for {scenario.difficulty} learners and typically takes {scenario.estimatedTime} minutes to complete. You'll face realistic objections and learn to handle high-pressure situations with confidence.
              </p>
            </section>

            {/* Key Techniques */}
            <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Key Techniques You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenario.topicsTaught.map((topic) => (
                  <div key={topic} className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                    <p className="font-semibold text-slate-100">{topic}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What to Expect */}
            <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                  <div>
                    <h3 className="font-bold mb-2">Setup</h3>
                    <p className="text-slate-300">Read the scenario brief and context to understand the situation you're entering.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                  <div>
                    <h3 className="font-bold mb-2">Practice</h3>
                    <p className="text-slate-300">Chat with Claude AI who takes on a realistic role. Respond naturally to their messages.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                  <div>
                    <h3 className="font-bold mb-2">Feedback</h3>
                    <p className="text-slate-300">Get detailed feedback on your communication style, technique usage, and areas to improve.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                  <div>
                    <h3 className="font-bold mb-2">Iterate</h3>
                    <p className="text-slate-300">Practice again with new variations. Build confidence through repetition.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Pro Tips for Success</h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-brand-accent">💡</span>
                  <span>Be authentic and natural - the AI responds to genuine conversation style</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent">💡</span>
                  <span>Take your time - rushing makes mistakes, speaking deliberately shows confidence</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent">💡</span>
                  <span>Practice multiple times - each attempt builds muscle memory and reduces anxiety</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent">💡</span>
                  <span>Study the feedback - understand why certain approaches work better than others</span>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border-2 border-brand-accent/30 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Practice?</h3>
              <p className="text-slate-300 mb-6">Download Refutation and start practicing this scenario today. Free tier includes 3 practice rounds per month.</p>
              <Button size="lg" variant="primary">
                Download Refutation Now
              </Button>
            </div>
          </div>

          {/* Related scenarios */}
          {relatedScenarios.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Similar Scenarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedScenarios.map((s) => (
                  <Link key={s.id} href={`/scenarios/${s.id}`} className="group">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-brand-accent transition-all">
                      <div className="text-4xl mb-4">{s.icon}</div>
                      <h4 className="font-bold mb-2 group-hover:text-brand-accent transition-colors">{s.title}</h4>
                      <p className="text-sm text-slate-400">{s.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
