'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Textarea, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { validateEmail, validateRequired, validateMinLength } from '@/lib/validation';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameValidation = validateRequired(formData.name, 'Name');
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.error;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    const subjectValidation = validateRequired(formData.subject, 'Subject');
    if (!subjectValidation.valid) {
      newErrors.subject = subjectValidation.error;
    }

    const messageValidation = validateMinLength(formData.message, 10, 'Message');
    if (!messageValidation.valid) {
      newErrors.message = messageValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for reaching out! We'll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
      console.error('Contact form error:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={status === 'loading'}
          error={errors.name}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          disabled={status === 'loading'}
          error={errors.email}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          disabled={status === 'loading'}
          error={errors.subject}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us more about your message..."
          disabled={status === 'loading'}
          error={errors.message}
          rows={5}
        />
      </motion.div>

      {/* Status messages */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: status === 'success' || status === 'error' ? 1 : 0,
          height: status === 'success' || status === 'error' ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {status === 'success' && (
          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <span>✓</span>
              <span>{message}</span>
            </p>
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <span>✗</span>
              <span>{message}</span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Submit button */}
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </Button>
      </motion.div>

      <p className="text-xs text-slate-400 text-center">
        We'll respond within 24-48 hours. Never spam.
      </p>
    </motion.form>
  );
}
