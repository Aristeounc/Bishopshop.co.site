import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const outfit = Outfit({ variable: '--font-outfit', weight: ['400', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Abacus — Master High-Stakes Conversations',
  description: 'The conversation gym. Practice difficult conversations with AI, peer with others, progress through skill levels. Master job interviews, negotiation, and influence.',
  keywords: ['conversation practice', 'interview prep', 'negotiation training', 'public speaking', 'communication skills'],
  authors: [{ name: 'Bishop Shop Enterprises' }],
  openGraph: {
    type: 'website',
    url: 'https://bishopshop.co.site',
    title: 'Abacus — Master High-Stakes Conversations',
    description: 'The conversation gym. Practice with AI. Compete with peers. Progress through skill levels.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abacus — Master High-Stakes Conversations',
    description: 'Practice difficult conversations with AI and peers. Progress through skill levels.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body className="bg-slate-900 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
