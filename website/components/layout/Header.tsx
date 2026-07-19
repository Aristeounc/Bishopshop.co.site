'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-light">
          Abacus
        </Link>

        <ul className="hidden md:flex gap-8">
          <li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#scenarios" className="text-slate-300 hover:text-brand-light transition">
              Scenarios
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#how" className="text-slate-300 hover:text-brand-light transition">
              How it Works
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#pricing" className="text-slate-300 hover:text-brand-light transition">
              Pricing
            </a>
          </li>
          <li>
            <Link href="/blog" className="text-slate-300 hover:text-brand-light transition">
              Blog
            </Link>
          </li>
        </ul>

        <Button size="md" variant="primary">
          Download App
        </Button>
      </nav>
    </header>
  );
}
