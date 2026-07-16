'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

const faqs = [
  {
    question: 'What is Abacus?',
    answer: 'Abacus is "The Conversation Gym" — a practice app for mastering difficult conversations. You practice with AI, get real-time feedback, compete with peers, and progress through skill levels.',
  },
  {
    question: 'How does AI sparring work?',
    answer: 'Our AI (powered by Claude) plays realistic personas in different scenarios. It adapts to your responses, challenges you realistically, and provides detailed feedback on your communication techniques.',
  },
  {
    question: 'Can I practice with real people?',
    answer: 'Yes! The Premium tier includes peer sparring. You\'re matched with other users for voice conversations, both get scored, and a transcript is analyzed by Claude.',
  },
  {
    question: 'Is my data private?',
    answer: 'Absolutely. We never sell user data. Conversations are encrypted and only used for your feedback. You control what information appears on your public profile.',
  },
  {
    question: 'What techniques does Abacus teach?',
    answer: 'We teach 47 evidence-based techniques from psychology, negotiation, public speaking, and behavioral science. Topics include active listening, STAR method, anchoring, and much more.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! The free tier includes 3 practice rounds per month with full access to all scenarios and AI feedback. Upgrade to Premium for unlimited practice.',
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-slate-800/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="primary">FAQ</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setOpenId(openId === index ? null : index)}
              className="w-full text-left bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-brand-accent transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <span className={`text-2xl text-brand-accent flex-shrink-0 transition-transform ${
                  openId === index ? 'rotate-180' : ''
                }`}>
                  ›
                </span>
              </div>

              {openId === index && (
                <p className="mt-4 text-slate-300 leading-relaxed">{faq.answer}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
