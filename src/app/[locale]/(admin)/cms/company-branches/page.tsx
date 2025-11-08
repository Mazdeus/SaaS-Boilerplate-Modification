'use client';

import React, { useEffect, useState } from 'react';
import CMSNavigation from '@/components/cms/CMSNavigation';

type CompanyBranch = {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  operatingHours: string;
  mapUrl: string;
  imageUrl: string;
  instagramUsername: string;
  isActive: boolean;
  order: number;
};

export default function CompanyBranchesPage() {
  const [branches, setBranches] = useState<CompanyBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyBranch>>({
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/cms/company-branches');
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch company branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.address || !formData.city) return;

    try {
      const res = await fetch('/api/cms/company-branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setBranches([data.data, ...branches]);
        setFormData({ isActive: true, order: 0 });
      }
    } catch (error) {
      console.error('Failed to create company branch:', error);
    }
  };

  const handleEdit = (branch: CompanyBranch) => {
    setEditingId(branch.id);
    setFormData(branch);
  };

  const handleSave = async () => {
    if (!editingId || !formData.name || !formData.address || !formData.city) return;

    try {
      const res = await fetch(`/api/cms/company-branches/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setBranches(branches.map(b => (b.id === editingId ? data.data : b)));
        setEditingId(null);
        setFormData({ isActive: true, order: 0 });
      }
    } catch (error) {
      console.error('Failed to update company branch:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ isActive: true, order: 0 });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      const res = await fetch(`/api/cms/company-branches/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setBranches(branches.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete company branch:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Company Branches</h1>
        <p className="text-gray-600">Manage store locations and branch information</p>
      </div>

      {/* Create New Form */}
      {!editingId && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Add New Branch</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Name *</label>
              <input
                type="text"
                placeholder="Branch Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">City *</label>
              <input
                type="text"
                placeholder="City"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Address *</label>
              <textarea
                placeholder="Full Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded border p-2"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Province</label>
              <input
                type="text"
                placeholder="Province"
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Postal Code</label>
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Phone</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Operating Hours</label>
              <input
                type="text"
                placeholder="e.g., Mon-Fri: 9:00 AM - 9:00 PM, Sat-Sun: 10:00 AM - 10:00 PM"
                value={formData.operatingHours || ''}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Map URL</label>
              <input
                type="url"
                placeholder="Google Maps URL"
                value={formData.mapUrl || ''}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Image URL</label>
              <input
                type="url"
                placeholder="Branch Image URL"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Instagram Username</label>
              <input
                type="text"
                placeholder="Instagram username (without @)"
                value={formData.instagramUsername || ''}
                onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Order</label>
              <input
                type="number"
                placeholder="Display Order"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium">Active</label>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleCreate}
                className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branches List */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            {editingId === branch.id ? (
              // Edit Form
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium">City *</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Address *</label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded border p-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Province</label>
                    <input
                      type="text"
                      value={formData.province || ''}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={formData.operatingHours || ''}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Map URL</label>
                    <input
                      type="url"
                      value={formData.mapUrl || ''}
                      onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Order</label>
                    <input
                      type="number"
                      value={formData.order || 0}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">Active</label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{branch.name}</h3>
                    <p className="text-gray-600">{branch.city}, {branch.province}</p>
                    <p className="mt-2 text-sm text-gray-700">{branch.address}</p>
                    {branch.phone && <p className="text-sm text-gray-600">📞 {branch.phone}</p>}
                    {branch.email && <p className="text-sm text-gray-600">📧 {branch.email}</p>}
                    {branch.operatingHours && <p className="text-sm text-gray-600">🕒 {branch.operatingHours}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span><strong>Order:</strong> {branch.order}</span>
                  <span><strong>Status:</strong> {branch.isActive ? '✅ Active' : '❌ Inactive'}</span>
                  {branch.mapUrl && (
                    <a 
                      href={branch.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      🗺️ View on Map
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {branches.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No company branches found. Create your first branch above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
