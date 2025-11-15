/**
 * CMS Collections Management Page
 * Manage product collections with images
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
import Badge from '@/components/cms/Badge';

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CollectionsManagementPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections', {
        headers: {
          'Authorization': 'Bearer ' + (document.cookie.match(/auth_token=([^;]+)/)?.[1] || '')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCollections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCreate = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      displayOrder: 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      imageUrl: collection.imageUrl,
      isActive: collection.isActive,
      displayOrder: collection.displayOrder,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = editingCollection
        ? `/api/collections/${editingCollection.id}`
        : '/api/collections';
      
      const method = editingCollection ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description || null,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive,
          displayOrder: formData.displayOrder,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchCollections();
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Failed to save collection');
        }
      }
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus koleksi ini?')) return;

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCollections();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  };

  const columns = [
    { 
      key: 'name' as keyof Collection, 
      label: 'Nama', 
      sortable: true 
    },
    { 
      key: 'slug' as keyof Collection, 
      label: 'Slug', 
      sortable: true 
    },
    { 
      key: 'isActive' as keyof Collection, 
      label: 'Status', 
      sortable: true,
      render: (collection: Collection) => (
        <Badge variant={collection.isActive ? 'success' : 'default'}>
          {collection.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    { 
      key: 'displayOrder' as keyof Collection, 
      label: 'Order', 
      sortable: true 
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Loading collections..." fullScreen />
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
              <h1 className="text-2xl font-bold text-gray-900">Koleksi</h1>
              <p className="text-gray-600 mt-1">Kelola koleksi produk dan galeri</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Tambah Koleksi
            </button>
          </div>

          {collections.length === 0 ? (
            <EmptyState
              title="Belum ada koleksi"
              description="Buat koleksi produk pertama Anda"
              action={{
                label: 'Tambah Koleksi',
                onClick: handleCreate,
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={collections}
              onEdit={handleEdit}
              onDelete={(collection: Collection) => handleDelete(collection.id)}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? 'Edit Koleksi' : 'Tambah Koleksi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nama Koleksi"
            name="name"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({ 
                ...formData, 
                name,
                slug: formData.slug || generateSlug(name)
              });
            }}
            required
            error={errors.name}
            placeholder="Masukkan nama koleksi"
          />

          <FormField
            label="URL Slug"
            name="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            error={errors.slug}
            placeholder="auto-generated-slug"
            description="Otomatis dibuat dari nama, atau sesuaikan"
          />

          <FormField
            label="Deskripsi"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            placeholder="Deskripsikan koleksi ini"
            rows={4}
          />

          <ImageSelector
            label="Gambar Koleksi"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            error={errors.imageUrl}
            description="Pilih gambar dari galeri atau masukkan URL"
            required
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktif (terlihat di website)
            </label>
          </div>

          <FormField
            label="Urutan Tampilan"
            name="displayOrder"
            type="number"
            value={formData.displayOrder.toString()}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            required
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : editingCollection ? 'Perbarui' : 'Buat'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

