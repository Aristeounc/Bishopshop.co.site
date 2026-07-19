import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const outfit = Outfit({ variable: '--font-outfit', weight: ['400', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Refutation — Master Persuasive Debate',
  description: 'The ultimate debate practice platform. Master argumentation with AI opponents, compete with peers, and win high-stakes discussions. Practice refutations, counterarguments, and logical reasoning.',
  keywords: ['debate practice', 'argumentation training', 'debate skills', 'logical reasoning', 'persuasive speaking', 'refutation'],
  authors: [{ name: 'Bishop Shop Enterprises' }],
  openGraph: {
    type: 'website',
    url: 'https://bishopshop.co.site',
    title: 'Refutation — Master Persuasive Debate',
    description: 'Practice debate with AI. Compete with peers. Master argumentation. Win discussions.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refutation — Master Persuasive Debate',
    description: 'Master persuasive debate with AI opponents and peer competition. Progress through debate levels.',
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
