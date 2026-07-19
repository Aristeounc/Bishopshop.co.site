'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Badge variant="primary">Success Stories</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-400">
            Real results from real users at top companies
          </p>
        </motion.div>

        {/* Testimonial carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Card hover={false} className="bg-slate-800/80 border-2 border-brand-accent/30 space-y-6">
              {/* Quote */}
              <blockquote className="text-2xl font-light leading-relaxed text-slate-100">
                "{testimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                />
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
              <motion.div
                className="pt-4 border-t border-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Badge variant="success">{testimonial.result}</Badge>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current ? 'bg-brand-accent' : 'bg-slate-600'
              }`}
              animate={{
                width: index === current ? 32 : 8,
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
