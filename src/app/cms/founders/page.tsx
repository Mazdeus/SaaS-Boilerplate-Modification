/**
 * CMS Founders Management Page
 * Manage company founders/team information
 */

'use client';

import { useState, useEffect } from 'react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import DataTable from '@/components/cms/DataTable';
import Modal from '@/components/cms/Modal';
import FormField from '@/components/cms/FormField';
import ImageSelector from '@/components/cms/ImageSelector';
import LoadingSpinner from '@/components/cms/LoadingSpinner';
import EmptyState from '@/components/cms/EmptyState';

interface Founder {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FoundersManagementPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/founders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        signal: AbortSignal.timeout(15000), // 15 seconds timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setFounders(data.data || []);
      } else {
        throw new Error('Failed to fetch founders');
      }
    } catch (error: any) {
      console.error('Error fetching founders:', error);
      const errorMsg = error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'Koneksi database timeout. Silakan coba lagi.'
        : 'Gagal memuat founders. Silakan refresh halaman.';
      setError(errorMsg);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleCreate = () => {
    setEditingFounder(null);
    setFormData({
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      displayOrder: founders.length,
      isActive: true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (founder: Founder) => {
    setEditingFounder(founder);
    setFormData({
      name: founder.name,
      position: founder.position,
      bio: founder.bio || '',
      imageUrl: founder.imageUrl || '',
      linkedinUrl: founder.linkedinUrl || '',
      instagramUrl: founder.instagramUrl || '',
      displayOrder: founder.displayOrder,
      isActive: founder.isActive,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = editingFounder
        ? `/api/founders/${editingFounder.id}`
        : '/api/founders';
      
      const method = editingFounder ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bio: formData.bio || null,
          imageUrl: formData.imageUrl || null,
          linkedinUrl: formData.linkedinUrl || null,
          instagramUrl: formData.instagramUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchFounders();
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Failed to save founder');
        }
      }
    } catch (error) {
      console.error('Error saving founder:', error);
      alert('Failed to save founder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this founder?')) return;

    try {
      const response = await fetch(`/api/founders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFounders();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete founder');
      }
    } catch (error) {
      console.error('Error deleting founder:', error);
      alert('Failed to delete founder');
    }
  };

  const columns = [
    { key: 'displayOrder', label: 'Order', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'actions', label: 'Actions' },
  ];

  const handleEditRow = (row: Founder) => {
    handleEdit(row);
  };

  const handleDeleteRow = (row: Founder) => {
    handleDelete(row.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Memuat founders..." fullScreen />
        </main>
      </div>
    );
  }

  if (error && founders.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-red-600 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => fetchFounders(true)}
                disabled={retrying}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retrying ? 'Mencoba lagi...' : '🔄 Coba Lagi'}
              </button>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Founders</h1>
              <p className="text-gray-600 mt-1">Manage company founders and team members</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + Add Founder
            </button>
          </div>

          {founders.length === 0 ? (
            <EmptyState
              title="No founders yet"
              description="Add your company founders and team members"
              action={{
                label: 'Add Founder',
                onClick: handleCreate,
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={founders}
              onEdit={handleEditRow}
              onDelete={handleDeleteRow}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFounder ? 'Edit Founder' : 'Add Founder'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            error={errors.name}
            placeholder="Enter founder name"
          />

          <FormField
            label="Position"
            name="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
            error={errors.position}
            placeholder="e.g., CEO & Co-Founder"
          />

          <FormField
            label="Bio"
            name="bio"
            type="textarea"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            error={errors.bio}
            placeholder="Brief bio or description"
            rows={4}
          />

          <ImageSelector
            label="Photo"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            error={errors.imageUrl}
            description="Pilih gambar dari database atau kosongkan"
          />

          <FormField
            label="LinkedIn URL"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            error={errors.linkedinUrl}
            placeholder="https://linkedin.com/in/... atau username"
          />

          <FormField
            label="Instagram URL"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
            error={errors.instagramUrl}
            placeholder="https://instagram.com/... atau @username"
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
              {submitting ? 'Saving...' : editingFounder ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

