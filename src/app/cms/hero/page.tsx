/**
 * CMS Hero Sections Management Page
 * Manage hero/banner sections for the homepage
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CMSSidebar from '@/components/cms/CMSSidebar';
import DataTable from '@/components/cms/DataTable';
import Modal from '@/components/cms/Modal';
import FormField from '@/components/cms/FormField';
import ImageSelector from '@/components/cms/ImageSelector';
import LoadingSpinner from '@/components/cms/LoadingSpinner';
import EmptyState from '@/components/cms/EmptyState';
import Badge from '@/components/cms/Badge';

interface HeroSection {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaLink: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HeroManagementPage() {
  const router = useRouter();
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hero-sections', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        setHeroSections(data.data || []);
      } else {
        console.error('Failed to fetch hero sections');
      }
    } catch (error) {
      console.error('Error fetching hero sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHero(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      ctaText: '',
      ctaLink: '',
      displayOrder: heroSections.length,
      isActive: true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (hero: HeroSection) => {
    setEditingHero(hero);
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      imageUrl: hero.imageUrl,
      ctaText: hero.ctaText || '',
      ctaLink: hero.ctaLink || '',
      displayOrder: hero.displayOrder,
      isActive: hero.isActive,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const url = editingHero
        ? `/api/hero-sections/${editingHero.id}`
        : '/api/hero-sections';
      
      const method = editingHero ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          ctaText: formData.ctaText || null,
          ctaLink: formData.ctaLink || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchHeroSections();
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Failed to save hero section');
        }
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      alert('Failed to save hero section');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/hero-sections/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (response.ok) {
        fetchHeroSections();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete hero section');
      }
    } catch (error) {
      console.error('Error deleting hero section:', error);
      alert('Failed to delete hero section');
    }
  };

  const columns = [
    { key: 'displayOrder', label: 'Order', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'subtitle', label: 'Subtitle' },
    { 
      key: 'isActive', 
      label: 'Status', 
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'actions', label: 'Actions' },
  ];

  const handleEditRow = (row: HeroSection) => {
    handleEdit(row);
  };

  const handleDeleteRow = (row: HeroSection) => {
    handleDelete(row.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Loading hero sections..." fullScreen />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CMSSidebar />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hero Sections</h1>
              <p className="text-sm text-gray-600 mt-1">Manage hero/banner sections for the homepage</p>
            </div>
            <button
              onClick={handleCreate}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + Add Hero Section
            </button>
          </div>

          {heroSections.length === 0 ? (
            <EmptyState
              title="No hero sections yet"
              description="Get started by creating your first hero section for the homepage"
              action={{
                label: 'Add Hero Section',
                onClick: handleCreate,
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={heroSections}
              onEdit={handleEditRow}
              onDelete={handleDeleteRow}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHero ? 'Edit Hero Section' : 'Add Hero Section'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            error={errors.title}
            placeholder="Enter hero title"
          />

          <FormField
            label="Subtitle"
            name="subtitle"
            type="textarea"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            error={errors.subtitle}
            placeholder="Enter hero subtitle (optional)"
            rows={2}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            placeholder="Enter hero description (optional)"
            rows={3}
          />

          <ImageSelector
            label="Hero Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            required
            error={errors.imageUrl}
            description="Pilih gambar dari database (recommended: 1920x1080px)"
          />

          <FormField
            label="CTA Button Text"
            name="ctaText"
            value={formData.ctaText}
            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            error={errors.ctaText}
            placeholder="e.g., Shop Now"
          />

          <FormField
            label="CTA Button Link"
            name="ctaLink"
            value={formData.ctaLink}
            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
            error={errors.ctaLink}
            placeholder="e.g., /collections atau https://..."
          />

          <FormField
            label="Display Order"
            name="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
            error={errors.displayOrder}
            description="Lower numbers appear first"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (visible on website)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingHero ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

