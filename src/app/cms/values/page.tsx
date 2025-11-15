'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import CMSSidebar from '@/components/cms/CMSSidebar';
import Button from '@/components/cms/Button';
import DataTable from '@/components/cms/DataTable';
import Modal from '@/components/cms/Modal';
import FormField from '@/components/cms/FormField';
import Badge from '@/components/cms/Badge';
import LoadingSpinner from '@/components/cms/LoadingSpinner';
import EmptyState from '@/components/cms/EmptyState';

interface CompanyValue {
  id: number;
  icon: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyValuesPage() {
  const router = useRouter();
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    subtitle: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/company-values', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        timeout: 15000, // 15 seconds timeout
      });
      setValues(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch company values:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Koneksi database timeout. Silakan coba lagi.'
        : error.response?.data?.message || 'Gagal memuat company values. Silakan refresh halaman.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingValue) {
        await axios.patch(`/api/company-values/${editingValue.id}`, formData);
        toast.success('Company value berhasil diupdate');
      } else {
        await axios.post('/api/company-values', formData);
        toast.success('Company value berhasil ditambahkan');
      }
      
      setShowModal(false);
      resetForm();
      fetchValues();
    } catch (error: any) {
      console.error('Failed to save company value:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan company value');
    }
  };

  const handleEdit = (value: CompanyValue) => {
    setEditingValue(value);
    setFormData({
      icon: value.icon || '',
      title: value.title,
      subtitle: value.subtitle || '',
      description: value.description || '',
      displayOrder: value.displayOrder,
      isActive: value.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus company value ini?')) return;

    try {
      await axios.delete(`/api/company-values/${id}`);
      toast.success('Company value berhasil dihapus');
      fetchValues();
    } catch (error) {
      console.error('Failed to delete company value:', error);
      toast.error('Gagal menghapus company value');
    }
  };

  const resetForm = () => {
    setFormData({
      icon: '',
      title: '',
      subtitle: '',
      description: '',
      displayOrder: 0,
      isActive: true,
    });
    setEditingValue(null);
  };

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (value: CompanyValue) => (
        <span className="text-2xl">{value.icon}</span>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value: CompanyValue) => (
        <div>
          <div className="font-semibold">{value.title}</div>
          {value.subtitle && (
            <div className="text-sm text-gray-500">{value.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: CompanyValue) => (
        <div className="max-w-md truncate text-sm text-gray-600">
          {value.description}
        </div>
      ),
    },
    {
      key: 'displayOrder',
      label: 'Order',
      render: (value: CompanyValue) => (
        <Badge variant="default">{value.displayOrder}</Badge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: CompanyValue) => (
        <Badge variant={value.isActive ? 'success' : 'danger'}>
          {value.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Memuat company values..." fullScreen />
        </main>
      </div>
    );
  }

  if (error && values.length === 0) {
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
                onClick={() => fetchValues(true)}
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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Company Values</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage core values yang ditampilkan di About page
                </p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                + Add Value
              </Button>
            </div>

            {/* Data Table */}
            {values.length === 0 ? (
              <EmptyState
                title="No company values"
                description="Mulai dengan menambahkan company value pertama"
              />
            ) : (
              <DataTable
                data={values}
                columns={columns}
                onEdit={handleEdit}
                onDelete={(value) => handleDelete(value.id)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingValue ? 'Edit Company Value' : 'Add Company Value'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Icon (Emoji)"
            name="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="✨ (opsional)"
          />

          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Keaslian (Authenticity)"
            required
          />

          <FormField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Menjadi diri sendiri adalah kekuatan terbesar"
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Setiap produk dibuat dengan karakter dan kejujuran..."
            rows={4}
          />

          <FormField
            label="Display Order"
            name="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingValue ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

