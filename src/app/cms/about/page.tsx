/**
 * CMS About Page Management
 */

'use client';

import { useState, useEffect } from 'react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import FormField from '@/components/cms/FormField';
import ImageSelector from '@/components/cms/ImageSelector';
import LoadingSpinner from '@/components/cms/LoadingSpinner';

export default function AboutManagementPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    introText: '',
    storyTitle: '',
    storyContent: '',
    missionTitle: '',
    missionContent: '',
    visionTitle: '',
    visionContent: '',
    imageUrl: '',
    statsLabel1: '',
    statsValue1: 0,
    statsLabel2: '',
    statsValue2: 0,
    statsLabel3: '',
    statsValue3: 0,
    statsLabel4: '',
    statsValue4: 0,
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          // Map the data from API to form
          setFormData({
            title: data.data.title || '',
            introText: data.data.introText || '',
            storyTitle: data.data.storyTitle || '',
            storyContent: data.data.storyContent || '',
            missionTitle: data.data.missionTitle || '',
            missionContent: data.data.missionContent || '',
            visionTitle: data.data.visionTitle || '',
            visionContent: data.data.visionContent || '',
            imageUrl: data.data.imageUrl || '',
            statsLabel1: data.data.statsLabel1 || '',
            statsValue1: data.data.statsValue1 || 0,
            statsLabel2: data.data.statsLabel2 || '',
            statsValue2: data.data.statsValue2 || 0,
            statsLabel3: data.data.statsLabel3 || '',
            statsValue3: data.data.statsValue3 || 0,
            statsLabel4: data.data.statsLabel4 || '',
            statsValue4: data.data.statsValue4 || 0,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Halaman About berhasil disimpan!');
        fetchAbout();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menyimpan halaman About');
      }
    } catch (error) {
      alert('Error menyimpan halaman About');
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Halaman About</h1>
            <p className="text-gray-600 mt-1">Kelola konten halaman tentang kami</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Judul & Intro</h3>
                <FormField
                  label="Judul Halaman"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Tentang Brodo"
                />

                <FormField
                  label="Teks Intro"
                  name="introText"
                  type="textarea"
                  value={formData.introText}
                  onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                  rows={3}
                  placeholder="Intro singkat tentang perusahaan..."
                />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Cerita Kami</h3>
                <FormField
                  label="Judul Cerita"
                  name="storyTitle"
                  value={formData.storyTitle}
                  onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                  placeholder="Cerita Kami"
                />

                <FormField
                  label="Konten Cerita"
                  name="storyContent"
                  type="textarea"
                  value={formData.storyContent}
                  onChange={(e) => setFormData({ ...formData, storyContent: e.target.value })}
                  rows={5}
                  placeholder="Cerita lengkap tentang perusahaan..."
                />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Misi</h3>
                <FormField
                  label="Judul Misi"
                  name="missionTitle"
                  value={formData.missionTitle}
                  onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                  placeholder="Misi Kami"
                />

                <FormField
                  label="Konten Misi"
                  name="missionContent"
                  type="textarea"
                  value={formData.missionContent}
                  onChange={(e) => setFormData({ ...formData, missionContent: e.target.value })}
                  rows={4}
                  placeholder="Jelaskan misi perusahaan..."
                />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Visi</h3>
                <FormField
                  label="Judul Visi"
                  name="visionTitle"
                  value={formData.visionTitle}
                  onChange={(e) => setFormData({ ...formData, visionTitle: e.target.value })}
                  placeholder="Visi Kami"
                />

                <FormField
                  label="Konten Visi"
                  name="visionContent"
                  type="textarea"
                  value={formData.visionContent}
                  onChange={(e) => setFormData({ ...formData, visionContent: e.target.value })}
                  rows={4}
                  placeholder="Jelaskan visi perusahaan..."
                />
              </div>

              <div className="border-t pt-6">
                <ImageSelector
                  label="Gambar About"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  description="Pilih gambar dari database atau kosongkan"
                />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Statistik (Opsional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Label Statistik 1"
                    name="statsLabel1"
                    value={formData.statsLabel1}
                    onChange={(e) => setFormData({ ...formData, statsLabel1: e.target.value })}
                    placeholder="Tahun Berdiri"
                  />
                  <FormField
                    label="Nilai Statistik 1"
                    name="statsValue1"
                    type="number"
                    value={formData.statsValue1.toString()}
                    onChange={(e) => setFormData({ ...formData, statsValue1: parseInt(e.target.value) || 0 })}
                    placeholder="2010"
                  />
                  
                  <FormField
                    label="Label Statistik 2"
                    name="statsLabel2"
                    value={formData.statsLabel2}
                    onChange={(e) => setFormData({ ...formData, statsLabel2: e.target.value })}
                    placeholder="Jumlah Toko"
                  />
                  <FormField
                    label="Nilai Statistik 2"
                    name="statsValue2"
                    type="number"
                    value={formData.statsValue2.toString()}
                    onChange={(e) => setFormData({ ...formData, statsValue2: parseInt(e.target.value) || 0 })}
                    placeholder="50"
                  />
                  
                  <FormField
                    label="Label Statistik 3"
                    name="statsLabel3"
                    value={formData.statsLabel3}
                    onChange={(e) => setFormData({ ...formData, statsLabel3: e.target.value })}
                    placeholder="Pelanggan Puas"
                  />
                  <FormField
                    label="Nilai Statistik 3"
                    name="statsValue3"
                    type="number"
                    value={formData.statsValue3.toString()}
                    onChange={(e) => setFormData({ ...formData, statsValue3: parseInt(e.target.value) || 0 })}
                    placeholder="10000"
                  />
                  
                  <FormField
                    label="Label Statistik 4"
                    name="statsLabel4"
                    value={formData.statsLabel4}
                    onChange={(e) => setFormData({ ...formData, statsLabel4: e.target.value })}
                    placeholder="Produk"
                  />
                  <FormField
                    label="Nilai Statistik 4"
                    name="statsValue4"
                    type="number"
                    value={formData.statsValue4.toString()}
                    onChange={(e) => setFormData({ ...formData, statsValue4: parseInt(e.target.value) || 0 })}
                    placeholder="500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Halaman About'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

