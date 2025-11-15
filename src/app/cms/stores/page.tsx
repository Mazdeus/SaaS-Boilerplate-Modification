/**
 * CMS Stores Management Page
 * Manage physical store locations
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

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  phoneNumber: string | null;
  email: string | null;
  operatingHours: string | null;
  mapUrl: string | null;
  imageUrl: string | null;
  instagramUsername: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function StoresManagementPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    operatingHours: '',
    mapUrl: '',
    imageUrl: '',
    instagramUsername: '',
    latitude: '',
    longitude: '',
    isActive: true,
    displayOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores', {
        headers: {
          'Authorization': 'Bearer ' + (document.cookie.match(/auth_token=([^;]+)/)?.[1] || '')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phoneNumber: '',
      email: '',
      operatingHours: '',
      mapUrl: '',
      imageUrl: '',
      instagramUsername: '',
      latitude: '',
      longitude: '',
      isActive: true,
      displayOrder: 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      province: store.province,
      postalCode: store.postalCode || '',
      phoneNumber: store.phoneNumber || '',
      email: store.email || '',
      operatingHours: store.operatingHours || '',
      mapUrl: store.mapUrl || '',
      imageUrl: store.imageUrl || '',
      instagramUsername: store.instagramUsername || '',
      latitude: store.latitude || '',
      longitude: store.longitude || '',
      isActive: store.isActive,
      displayOrder: store.displayOrder,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = editingStore ? `/api/stores/${editingStore.id}` : '/api/stores';
      const method = editingStore ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchStores();
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Failed to save store');
        }
      }
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Failed to save store');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus toko ini?')) return;

    try {
      const response = await fetch(`/api/stores/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchStores();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus toko');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Gagal menghapus toko');
    }
  };

  const columns = [
    { key: 'name' as keyof Store, label: 'Nama Toko', sortable: true },
    { key: 'city' as keyof Store, label: 'Kota', sortable: true },
    { key: 'province' as keyof Store, label: 'Provinsi', sortable: true },
    { 
      key: 'phoneNumber' as keyof Store, 
      label: 'Telepon',
      render: (store: Store) => store?.phoneNumber || '-',
    },
    {
      key: 'isActive' as keyof Store,
      label: 'Status',
      render: (store: Store) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          store.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {store.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ];

  const handleEditRow = (store: Store) => {
    handleEdit(store);
  };

  const handleDeleteRow = (store: Store) => {
    handleDelete(store.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CMSSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 cms-main-content">
          <LoadingSpinner size="lg" text="Memuat toko..." fullScreen />
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
              <h1 className="text-2xl font-bold text-gray-900">Lokasi Toko</h1>
              <p className="text-gray-600 mt-1">Kelola cabang toko fisik</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + Tambah Toko
            </button>
          </div>

          {stores.length === 0 ? (
            <EmptyState
              title="Belum ada toko"
              description="Tambahkan lokasi toko pertama Anda"
              action={{ label: 'Tambah Toko', onClick: handleCreate }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={stores}
              onEdit={handleEditRow}
              onDelete={handleDeleteRow}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStore ? 'Edit Toko' : 'Tambah Toko'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nama Toko"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            error={errors.name}
            placeholder="contoh: Brodo Jakarta Selatan"
          />

          <FormField
            label="Alamat"
            name="address"
            type="textarea"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            error={errors.address}
            placeholder="Alamat lengkap"
            rows={3}
          />

          <FormField
            label="Kota"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            error={errors.city}
            placeholder="Nama kota"
          />

          <FormField
            label="Provinsi"
            name="province"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            required
            error={errors.province}
            placeholder="Nama provinsi"
          />

          <FormField
            label="Kode Pos"
            name="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            error={errors.postalCode}
            placeholder="12345"
          />

          <FormField
            label="Telepon"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            error={errors.phoneNumber}
            placeholder="+62 21 xxx xxxx"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="store@brodo.com"
          />

          <FormField
            label="URL Google Maps"
            name="mapUrl"
            type="text"
            value={formData.mapUrl}
            onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
            error={errors.mapUrl}
            placeholder="https://maps.google.com/... atau path apa saja"
          />

          <FormField
            label="Jam Operasional"
            name="operatingHours"
            type="textarea"
            value={formData.operatingHours}
            onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            error={errors.operatingHours}
            placeholder="Senin-Jumat: 10:00-21:00&#10;Sabtu-Minggu: 09:00-22:00"
            rows={3}
          />

          <ImageSelector
            label="Gambar Toko"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            error={errors.imageUrl}
            description="Pilih gambar dari galeri atau masukkan URL"
          />

          <FormField
            label="Username Instagram"
            name="instagramUsername"
            value={formData.instagramUsername}
            onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
            error={errors.instagramUsername}
            placeholder="@brodo_jakarta"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              error={errors.latitude}
              placeholder="-6.2088"
            />

            <FormField
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              error={errors.longitude}
              placeholder="106.8456"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Urutan Tampil"
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              error={errors.displayOrder}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Aktif
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {formData.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>
          </div>

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
              {submitting ? 'Menyimpan...' : editingStore ? 'Perbarui' : 'Buat'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

