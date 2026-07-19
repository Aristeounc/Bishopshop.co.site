'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email.');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const error = await response.json();
        setStatus('error');
        setMessage(error.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Badge variant="primary" className="inline-block">
        📧 Weekly Tips
      </Badge>

      <h3 className="text-2xl font-bold">Get Weekly Communication Tips</h3>

      <p className="text-slate-300">
        Join 5,000+ ambitious communicators getting practical tips, technique breakdowns, and success stories.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>

      {status === 'success' && (
        <p className="text-green-400 text-sm">✓ {message}</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm">✗ {message}</p>
      )}

      <p className="text-xs text-slate-400">
        We'll never spam you. Unsubscribe anytime.
      </p>
    </form>
  );
}
