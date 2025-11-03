'use client';

/**
 * ContactForm Component
 * Public contact form for company profile
 * No authentication required - anyone can submit
 */

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
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">Hubungi Kami</h3>
          <p className="text-gray-600">
            Punya pertanyaan? Isi form di bawah dan kami akan menghubungi Anda segera!
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            <div className="flex items-start">
              <span className="mr-2 text-xl">✅</span>
              <div>
                <p className="font-semibold">Terima Kasih!</p>
                <p className="text-sm">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <div className="flex items-start">
              <span className="mr-2 text-xl">❌</span>
              <div>
                <p className="font-semibold">Oops!</p>
                <p className="text-sm">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="john@example.com"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              Nomor Telepon (Opsional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+62 812-3456-7890"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
              Subjek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.subject
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Informasi Produk / Kolaborasi / Pertanyaan Umum"
              required
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
              Pesan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.message
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Tuliskan pesan Anda di sini..."
              required
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="size-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Mengirim...
                </span>
              ) : (
                'Kirim Pesan'
              )}
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="mb-3 text-center text-sm font-semibold text-gray-700">
            Atau hubungi kami langsung:
          </p>
          <div className="flex flex-col gap-2 text-center text-sm text-gray-600 sm:flex-row sm:justify-center sm:gap-6">
            <div>
              📧 <a href="mailto:hello@bro.do" className="text-blue-600 hover:underline">hello@bro.do</a>
            </div>
            <div>
              📞 <a href="tel:+622288115555" className="text-blue-600 hover:underline">(022) 8811-5555</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
