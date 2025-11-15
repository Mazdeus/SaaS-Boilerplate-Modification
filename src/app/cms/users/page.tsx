/**
 * CMS User Management Page
 */

'use client';

import { useState, useEffect } from 'react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import DataTable from '@/components/cms/DataTable';
import Modal from '@/components/cms/Modal';
import FormField from '@/components/cms/FormField';
import LoadingSpinner from '@/components/cms/LoadingSpinner';
import EmptyState from '@/components/cms/EmptyState';
import Badge from '@/components/cms/Badge';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/cms-users', {
        headers: {
          'Authorization': 'Bearer ' + (document.cookie.match(/auth_token=([^;]+)/)?.[1] || '')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'admin',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers(); // Refresh user list
        alert('Pengguna berhasil dibuat!');
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            errorMap[err.path[0]] = err.message;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || 'Gagal membuat pengguna');
        }
      }
    } catch (error) {
      alert('Error membuat pengguna');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name' as const, label: 'Nama', sortable: true },
    { key: 'email' as const, label: 'Email', sortable: true },
    { key: 'role' as const, label: 'Role' },
    { key: 'status' as const, label: 'Status' },
    { key: 'created_at' as const, label: 'Dibuat', sortable: true },
  ];

  const formatData = users.map((user) => ({
    id: user.id,
    name: user.name || '-',
    email: user.email,
    role: user.role,
    status: <Badge variant={user.is_active ? 'success' : 'default'}>{user.is_active ? 'Aktif' : 'Nonaktif'}</Badge>,
    created_at: new Date(user.created_at).toLocaleDateString('id-ID'),
  }));

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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengguna CMS</h1>
              <p className="text-gray-600 mt-1">Kelola akun pengguna CMS</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              + Tambah Pengguna
            </button>
          </div>

          {users.length === 0 ? (
            <EmptyState
              title="Belum ada pengguna"
              description="Buat akun pengguna untuk akses CMS"
              action={{
                label: 'Tambah Pengguna',
                onClick: handleCreate,
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={formatData}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pengguna"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nama"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            error={errors.name}
            placeholder="Nama lengkap"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            error={errors.email}
            placeholder="user@example.com"
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            error={errors.password}
            placeholder="Minimal 6 karakter"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
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
              {submitting ? 'Membuat...' : 'Buat Pengguna'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

