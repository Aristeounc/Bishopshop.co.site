import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { LeaderboardSection } from '@/components/sections/LeaderboardSection';
import { TESTIMONIALS } from '@/constants/testimonials';

export const metadata = {
  title: 'Community — Refutation Leaderboard & Stories',
  description: 'Join 10K+ users building communication skills. See who\'s climbing the ranks and read their success stories.',
};

export default function CommunityPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-16">
            <Badge variant="primary" className="mb-4">
              Community
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">Join the Conversation Community</h1>
            <p className="text-xl text-slate-300">
              10K+ users worldwide are mastering difficult conversations. See who's climbing the ranks and read their success stories.
            </p>
          </div>

          {/* Leaderboard */}
          <LeaderboardSection />

          {/* Success Stories */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold mb-12 text-center">Success Stories</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-brand-accent transition-all"
                >
                  {/* Author avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full mb-4"></div>

                  {/* Quote */}
                  <p className="text-slate-200 italic mb-4">"{testimonial.quote}"</p>

                  {/* Result */}
                  <div className="bg-brand-primary/20 border border-brand-primary/40 rounded-lg p-3 mb-4">
                    <p className="text-brand-accent font-semibold text-sm">✓ {testimonial.result}</p>
                  </div>

                  {/* Author */}
                  <div>
                    <p className="font-bold text-slate-100">{testimonial.author}</p>
                    {testimonial.company && (
                      <p className="text-sm text-slate-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-brand-accent mb-2">10K+</div>
              <p className="text-slate-300">Active Users</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-brand-accent mb-2">50K+</div>
              <p className="text-slate-300">Practice Sessions</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-brand-accent mb-2">6</div>
              <p className="text-slate-300">Scenarios</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-brand-accent mb-2">47</div>
              <p className="text-slate-300">Techniques Taught</p>
            </div>
          </div>

          {/* Join CTA */}
          <div className="mt-16 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border-2 border-brand-accent/30 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Community?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Start practicing today and climb the global leaderboard. Compete with thousands of ambitious communicators.
            </p>
            <button className="bg-brand-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-colors text-lg">
              Download Refutation Free
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
