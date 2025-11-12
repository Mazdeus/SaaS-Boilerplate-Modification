'use client';

import React, { useEffect, useState } from 'react';
import CMSNavigation from '@/components/cms/CMSNavigation';

type HeroSection = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

export default function HeroManagementPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<HeroSection>>({});

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/cms/hero');
      const data = await res.json();
      if (data.success) {
        setHeroes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch heroes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (hero: HeroSection) => {
    setEditingId(hero.id);
    setFormData(hero);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/cms/hero/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchHeroes();
        setEditingId(null);
        setFormData({});
      }
    } catch (error) {
      console.error('Failed to update hero:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      const res = await fetch(`/api/cms/hero/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchHeroes();
      }
    } catch (error) {
      console.error('Failed to delete hero:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/cms/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: heroes.length + 1,
        }),
      });

      if (res.ok) {
        await fetchHeroes();
        setFormData({});
      }
    } catch (error) {
      console.error('Failed to create hero:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CMSNavigation />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Sections</h1>
        <p className="text-gray-600">Manage slideshow banners</p>
      </div>

      {/* Create New Form */}
      {!editingId && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Create New Hero Section</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded border p-2"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="rounded border p-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded border p-2"
              rows={3}
            />
            <input
              type="text"
              placeholder="CTA Text"
              value={formData.ctaText || ''}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="rounded border p-2"
            />
            <input
              type="text"
              placeholder="CTA Link"
              value={formData.ctaLink || ''}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="rounded border p-2"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="rounded border p-2"
            />
            <button
              onClick={handleCreate}
              className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-white transition-all hover:from-amber-800 hover:to-brown-900 hover:shadow-lg"
            >
              Create Hero Section
            </button>
          </div>
        </div>
      )}

      {/* Hero List */}
      <div className="space-y-4">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            {editingId === hero.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full rounded border p-2"
                />
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded border p-2"
                  rows={3}
                />
                <input
                  type="text"
                  value={formData.ctaText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  value={formData.ctaLink || ''}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded border p-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-white transition-all hover:from-amber-800 hover:to-brown-900"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({});
                    }}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{hero.title}</h3>
                    <p className="text-gray-600">{hero.subtitle}</p>
                    <p className="mt-2 text-sm text-gray-500">{hero.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-white transition-all hover:from-amber-800 hover:to-brown-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hero.id)}
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>CTA:</strong> {hero.ctaText} → {hero.ctaLink}</p>
                  <p><strong>Image:</strong> {hero.imageUrl}</p>
                  <p><strong>Order:</strong> {hero.order} | <strong>Active:</strong> {hero.isActive ? '✓' : '✗'}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
