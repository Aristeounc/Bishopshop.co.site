import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact Us — Refutation',
  description: 'Get in touch with the Refutation team. We would love to hear from you.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="primary">Get In Touch</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              We'd Love to Hear from You
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Have questions, feedback, or partnership inquiries? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm />

          {/* Additional info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-slate-400 text-sm">hello@abacus.app</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold mb-2">Response Time</h3>
              <p className="text-slate-400 text-sm">24-48 hours typically</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-bold mb-2">Based In</h3>
              <p className="text-slate-400 text-sm">Remote, serving globally</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
