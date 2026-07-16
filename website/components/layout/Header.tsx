'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-light">
          Abacus
        </Link>
        <ul className="hidden md:flex gap-8">
          <li><Link href="/#how" className="text-slate-300 hover:text-brand-light transition">How it works</Link></li>
          <li><Link href="/#scenarios" className="text-slate-300 hover:text-brand-light transition">Scenarios</Link></li>
          <li><Link href="/#pricing" className="text-slate-300 hover:text-brand-light transition">Pricing</Link></li>
        </ul>
        <button className="bg-brand-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition">
          Download App
        </button>
      </nav>
    </header>
  );
}
