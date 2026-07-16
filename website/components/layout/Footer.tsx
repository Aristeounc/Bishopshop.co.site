'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">Abacus</h3>
            <p className="text-sm text-slate-400">
              The conversation gym. Practice difficult conversations, compete with peers, master communication.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/#scenarios" className="hover:text-brand-accent transition">
                  Scenarios
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-brand-accent transition">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-accent transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
          <p>&copy; 2024 Bishop Shop Enterprises LLC. All rights reserved.</p>
          <p>Abacus — The Conversation Gym</p>
        </div>
      </div>
    </footer>
  );
}
