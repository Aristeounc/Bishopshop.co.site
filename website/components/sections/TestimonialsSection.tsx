'use client';

import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '@/constants/testimonials';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary">Success Stories</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-400">
            Real results from real users at top companies
          </p>
        </div>

        {/* Testimonial carousel */}
        <Card hover={false} className="bg-slate-800/80 border-2 border-brand-accent/30 space-y-6">
          {/* Quote */}
          <blockquote className="text-2xl font-light leading-relaxed text-slate-100">
            "{testimonial.quote}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full"></div>
            <div>
              <p className="font-bold">{testimonial.author}</p>
              {testimonial.company && (
                <p className="text-sm text-slate-400">
                  {testimonial.role} at {testimonial.company}
                </p>
              )}
            </div>
          </div>

          {/* Result badge */}
          <div className="pt-4 border-t border-slate-700">
            <Badge variant="success">{testimonial.result}</Badge>
          </div>
        </Card>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current ? 'bg-brand-accent w-8' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
