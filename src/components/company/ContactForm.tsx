'use client';

/**
 * ContactForm Component
 * Public contact form for company profile
 * No authentication required - anyone can submit
 */

import { CheckCircle, XCircle, Mail, Phone, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
      else {
        setSubmitStatus('error');
        if (data.errors) {
          // Handle validation errors
          const newErrors: FormErrors = {};
          data.errors.forEach((error: { field: string; message: string }) => {
            newErrors[error.field] = error.message;
          });
          setErrors(newErrors);
          setSubmitMessage('Please fix the errors and try again.');
        }
        else {
          setSubmitMessage(data.message || 'Failed to submit form. Please try again.');
        }
      }
    }
    catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again later.');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Hubungi Kami</h3>
          <p className="text-sm text-gray-600">
            Punya pertanyaan? Isi form di bawah dan kami akan menghubungi Anda segera!
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 border-l-2 border-green-600 bg-green-50 p-4 text-green-900">
            <div className="flex items-start">
              <CheckCircle className="mr-3 size-5 shrink-0" />
              <div>
                <p className="font-semibold">Terima Kasih!</p>
                <p className="text-sm">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 border-l-2 border-red-600 bg-red-50 p-4 text-red-900">
            <div className="flex items-start">
              <XCircle className="mr-3 size-5 shrink-0" />
              <div>
                <p className="font-semibold">Oops!</p>
                <p className="text-sm">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
              Nama Lengkap <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border-b-2 bg-transparent px-2 py-3 transition-colors focus:outline-none ${
                errors.name
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-amber-700'
              }`}
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
              Email <span className="text-gray-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border-b-2 bg-transparent px-2 py-3 transition-colors focus:outline-none ${
                errors.email
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-amber-700'
              }`}
              placeholder="john@example.com"
              required
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">
              Nomor Telepon <span className="text-gray-400">(Opsional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 bg-transparent px-2 py-3 transition-colors focus:border-amber-700 focus:outline-none"
              placeholder="+62 812-3456-7890"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-900">
              Subjek <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full border-b-2 bg-transparent px-2 py-3 transition-colors focus:outline-none ${
                errors.subject
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-amber-700'
              }`}
              placeholder="Informasi Produk / Kolaborasi / Pertanyaan Umum"
              required
            />
            {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject}</p>}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900">
              Pesan <span className="text-gray-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full border-b-2 bg-transparent px-2 py-3 transition-colors focus:outline-none ${
                errors.message
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-amber-700'
              }`}
              placeholder="Tuliskan pesan Anda di sini..."
              required
            />
            {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
          </div>

          {/* Submit Button - Warm Brown Tone */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-900 px-6 py-4 font-medium text-white transition-all hover:from-amber-800 hover:to-brown-900 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Mengirim...
                </span>
              ) : (
                'Kirim Pesan'
              )}
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <p className="mb-5 text-center text-sm text-gray-600">
            Atau hubungi kami langsung:
          </p>
          <div className="flex flex-col gap-4 text-center text-sm text-gray-600 sm:flex-row sm:justify-center sm:gap-10">
            <div className="flex items-center justify-center gap-2">
              <Mail className="size-4 text-amber-700" />
              <a href="mailto:hello@bro.do" className="font-medium text-gray-900 transition-colors hover:text-amber-700">hello@bro.do</a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="size-4 text-amber-700" />
              <a href="tel:+622288115555" className="font-medium text-gray-900 transition-colors hover:text-amber-700">(022) 8811-5555</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
