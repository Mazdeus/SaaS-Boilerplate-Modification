/**
 * CMS Testimonials Management Page
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

interface Testimonial {
  id: number;
  customerName: string;
  customerPosition: string | null;
  customerCompany: string | null;
  customerImageUrl: string | null;
  rating: number;
  testimonialText: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPosition: '',
    customerCompany: '',
    customerImageUrl: '',
    rating: 5,
    testimonialText: '',
    isActive: true,
    displayOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials', {
        headers: {
          'Authorization': 'Bearer ' + (document.cookie.match(/auth_token=([^;]+)/)?.[1] || '')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      customerName: '',
      customerPosition: '',
      customerCompany: '',
      customerImageUrl: '',
      rating: 5,
      testimonialText: '',
      isActive: true,
      displayOrder: 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: Testimonial) => {
    setEditing(item);
    setFormData({
      customerName: item.customerName,
      customerPosition: item.customerPosition || '',
      customerCompany: item.customerCompany || '',
      customerImageUrl: item.customerImageUrl || '',
      rating: item.rating,
      testimonialText: item.testimonialText,
      isActive: item.isActive,
      displayOrder: item.displayOrder,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = editing ? `/api/testimonials/${editing.id}` : '/api/testimonials';
      const method = editing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Failed to save');
        }
      }
    } catch (error) {
      alert('Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return;
    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (response.ok) fetchTestimonials();
      else alert('Gagal menghapus testimoni');
    } catch (error) {
      alert('Gagal menghapus testimoni');
    }
  };

  const columns = [
    { 
      key: 'customerName' as keyof Testimonial, 
      label: 'Nama Pelanggan', 
      sortable: true 
    },
    { 
      key: 'rating' as keyof Testimonial, 
      label: 'Rating', 
      sortable: true,
      render: (testimonial: Testimonial) => `⭐ ${testimonial.rating}/5`,
    },
    { 
      key: 'isActive' as keyof Testimonial, 
      label: 'Status', 
      sortable: true,
      render: (testimonial: Testimonial) => (
        <Badge variant={testimonial.isActive ? 'success' : 'default'}>
          {testimonial.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
  ];

  const handleEditRow = (row: Testimonial) => {
    handleEdit(row);
  };

  const handleDeleteRow = (row: Testimonial) => {
    handleDelete(row.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Memuat testimoni..." fullScreen />
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
              <h1 className="text-2xl font-bold text-gray-900">Testimoni</h1>
              <p className="text-gray-600 mt-1">Ulasan dan masukan pelanggan</p>
            </div>
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              + Tambah Testimoni
            </button>
          </div>
          {testimonials.length === 0 ? (
            <EmptyState 
              title="Belum ada testimoni" 
              description="Tambahkan testimoni pelanggan pertama"
              action={{ label: 'Tambah Testimoni', onClick: handleCreate }} 
            />
          ) : (
            <DataTable columns={columns} data={testimonials} onEdit={handleEditRow} onDelete={handleDeleteRow} />
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Testimoni' : 'Tambah Testimoni'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField 
            label="Nama Pelanggan" 
            name="customerName" 
            value={formData.customerName} 
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} 
            required 
            error={errors.customerName} 
            placeholder="Nama lengkap pelanggan"
          />
          
          <FormField 
            label="Posisi/Jabatan" 
            name="customerPosition" 
            value={formData.customerPosition} 
            onChange={(e) => setFormData({ ...formData, customerPosition: e.target.value })} 
            error={errors.customerPosition} 
            placeholder="contoh: CEO, Pelanggan, dsb"
          />

          <FormField 
            label="Nama Perusahaan" 
            name="customerCompany" 
            value={formData.customerCompany} 
            onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })} 
            error={errors.customerCompany} 
            placeholder="Nama perusahaan (opsional)"
          />
          
          <FormField 
            label="Isi Testimoni" 
            name="testimonialText" 
            type="textarea" 
            value={formData.testimonialText} 
            onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })} 
            required 
            error={errors.testimonialText} 
            rows={4} 
            placeholder="Tulis ulasan pelanggan di sini..."
          />
          
          <FormField 
            label="Rating" 
            name="rating" 
            type="number" 
            value={formData.rating.toString()} 
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} 
            required 
            error={errors.rating} 
            description="1-5 bintang"
          />
          
          <ImageSelector
            label="Foto Pelanggan" 
            value={formData.customerImageUrl} 
            onChange={(url) => setFormData({ ...formData, customerImageUrl: url })} 
            description="Pilih gambar dari database atau kosongkan"
          />
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded" 
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktif (tampilkan di website)
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" 
              disabled={submitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" 
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Buat'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

