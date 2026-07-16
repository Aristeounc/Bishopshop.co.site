'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen pt-24 pb-16 px-4 overflow-hidden flex items-center justify-center">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-brand-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            {/* Eyebrow badge */}
            <div className="inline-block">
              <Badge variant="primary">✨ Master difficult conversations</Badge>
            </div>

            {/* Main headline */}
            <div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                Master High-Stakes
                <br />
                <GradientText>Conversations</GradientText>
              </h1>
              <p className="text-xl text-slate-300 max-w-lg font-light leading-relaxed">
                Practice difficult conversations with AI, compete with peers, and progress through skill levels. The conversation gym for ambitious communicators.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" variant="primary">
                Download App
              </Button>
              <Button size="lg" variant="ghost">
                Try Free Preview
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700">
              <div>
                <div className="text-3xl font-bold text-brand-accent">10K+</div>
                <p className="text-sm text-slate-400 mt-2">Active Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-accent">6</div>
                <p className="text-sm text-slate-400 mt-2">Scenarios</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-accent">47</div>
                <p className="text-sm text-slate-400 mt-2">Techniques</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual mockup */}
          <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Phone mockup frame */}
            <div className="relative w-72 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-20"></div>

              {/* Screen content */}
              <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col justify-between overflow-hidden">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Job Interview</h3>
                    <span className="bg-brand-primary/20 text-brand-accent text-xs px-2 py-1 rounded-full">ADVANCED</span>
                  </div>

                  {/* Mock chat bubble */}
                  <div className="bg-brand-primary/20 border border-brand-primary/40 rounded-lg p-3 text-xs text-slate-200">
                    <p className="text-brand-accent font-semibold mb-1">Interviewer:</p>
                    <p>"Tell me about your biggest failure."</p>
                  </div>

                  {/* Response bubble */}
                  <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-3 text-xs text-slate-200 ml-4">
                    <p className="text-slate-300 font-semibold mb-1">You:</p>
                    <p>"I missed a deadline and learned to communicate better..."</p>
                  </div>
                </div>

                {/* Feedback badge */}
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-center">
                  <p className="text-green-300 text-xs font-semibold">✓ Good recovery</p>
                  <p className="text-green-300/70 text-xs mt-1">Show vulnerability strategically</p>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-accent rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
            </div>

            {/* Floating card behind phone */}
            <div className="absolute -right-8 -bottom-8 w-48 h-40 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-2xl border border-brand-accent/20 shadow-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
