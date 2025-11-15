/**
 * CMS Settings Page - Company Info & SEO
 */

'use client';

import { useState, useEffect } from 'react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import FormField from '@/components/cms/FormField';
import LoadingSpinner from '@/components/cms/LoadingSpinner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    tagline: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
  });
  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [companyRes, seoRes] = await Promise.all([
        fetch('/api/company-info'),
        fetch('/api/seo-settings'),
      ]);

      if (companyRes.ok) {
        const data = await companyRes.json();
        if (data.data) {
          setCompanyInfo(data.data);
        }
      }

      if (seoRes.ok) {
        const data = await seoRes.json();
        if (data.data) {
          setSeoSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/company-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyInfo),
      });

      if (response.ok) {
        alert('Company info saved successfully!');
      } else {
        alert('Failed to save company info');
      }
    } catch (error) {
      alert('Error saving company info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/seo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings),
      });

      if (response.ok) {
        alert('SEO settings saved successfully!');
      } else {
        alert('Failed to save SEO settings');
      }
    } catch (error) {
      alert('Error saving SEO settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" fullScreen />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CMSSidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage company information and SEO settings</p>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <form onSubmit={handleCompanySubmit} className="space-y-4">
              <FormField
                label="Company Name"
                name="company_name"
                value={companyInfo.company_name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                required
              />
              <FormField
                label="Tagline"
                name="tagline"
                value={companyInfo.tagline}
                onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
              />
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                rows={4}
              />
              <FormField
                label="Address"
                name="address"
                type="textarea"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Phone"
                  name="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                />
              </div>

              <h3 className="text-lg font-medium mt-6 mb-2">Social Media</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Instagram"
                  name="instagram_url"
                  type="text"
                  value={companyInfo.instagram_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, instagram_url: e.target.value })}
                  placeholder="URL atau username"
                />
                <FormField
                  label="Facebook"
                  name="facebook_url"
                  type="text"
                  value={companyInfo.facebook_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, facebook_url: e.target.value })}
                  placeholder="URL atau username"
                />
                <FormField
                  label="Twitter"
                  name="twitter_url"
                  type="text"
                  value={companyInfo.twitter_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, twitter_url: e.target.value })}
                  placeholder="URL atau username"
                />
                <FormField
                  label="LinkedIn"
                  name="linkedin_url"
                  type="text"
                  value={companyInfo.linkedin_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, linkedin_url: e.target.value })}
                  placeholder="URL atau username"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Company Info'}
              </button>
            </form>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
            <form onSubmit={handleSeoSubmit} className="space-y-4">
              <FormField
                label="Meta Title"
                name="meta_title"
                value={seoSettings.meta_title}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                description="Recommended: 50-60 characters"
              />
              <FormField
                label="Meta Description"
                name="meta_description"
                type="textarea"
                value={seoSettings.meta_description}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                rows={3}
                description="Recommended: 150-160 characters"
              />
              <FormField
                label="Meta Keywords"
                name="meta_keywords"
                value={seoSettings.meta_keywords}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_keywords: e.target.value })}
                description="Comma-separated keywords"
              />
              <FormField
                label="OG Image URL"
                name="og_image_url"
                type="text"
                value={seoSettings.og_image_url}
                onChange={(e) => setSeoSettings({ ...seoSettings, og_image_url: e.target.value })}
                description="Image for social media sharing (1200x630px recommended)"
                placeholder="/assets/og-image.jpg atau https://..."
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

