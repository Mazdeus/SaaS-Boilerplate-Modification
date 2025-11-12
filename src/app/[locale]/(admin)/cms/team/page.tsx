'use client';

import React, { useEffect, useState } from 'react';
import CMSNavigation from '@/components/cms/CMSNavigation';

type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  linkedinUrl?: string;
  order: number;
  isActive: boolean;
};

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    bio: '',
    photoUrl: '',
    linkedinUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/cms/team');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        console.error('Failed to fetch team members:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/cms/team/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchMembers();
        setEditingId(null);
        setFormData({
          name: '',
          position: '',
          bio: '',
          photoUrl: '',
          linkedinUrl: '',
          isActive: true,
        });
        alert('Team member updated successfully!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to update team member: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update member:', error);
      alert('Failed to update team member');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await fetch(`/api/cms/team/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchMembers();
        alert('Team member deleted successfully!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to delete team member: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
      alert('Failed to delete team member');
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.position) {
      alert('Please fill in name and position');
      return;
    }

    try {
      const res = await fetch('/api/cms/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: members.length + 1,
        }),
      });

      if (res.ok) {
        await fetchMembers();
        setFormData({
          name: '',
          position: '',
          bio: '',
          photoUrl: '',
          linkedinUrl: '',
          isActive: true,
        });
        alert('Team member created successfully!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to create team member: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error('Failed to create member:', error);
      alert('Failed to create team member');
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
        <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-600">Manage your team profiles</p>
      </div>

      {/* Create New Form */}
      {!editingId && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Add New Team Member</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded border p-2"
              required
            />
            <input
              type="text"
              placeholder="Position *"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="rounded border p-2"
              required
            />
            <textarea
              placeholder="Bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="rounded border p-2"
              rows={3}
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={formData.photoUrl || ''}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="rounded border p-2"
            />
            <input
              type="text"
              placeholder="LinkedIn URL (optional)"
              value={formData.linkedinUrl || ''}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="rounded border p-2"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isActive">Active</label>
            </div>
            <button
              onClick={handleCreate}
              className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-white transition-all hover:from-amber-800 hover:to-brown-900 hover:shadow-lg"
            >
              Add Team Member
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            {editingId === member.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border p-2"
                  placeholder="Name *"
                  required
                />
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full rounded border p-2"
                  placeholder="Position *"
                  required
                />
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded border p-2"
                  rows={3}
                  placeholder="Bio"
                />
                <input
                  type="text"
                  value={formData.photoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full rounded border p-2"
                  placeholder="Photo URL"
                />
                <input
                  type="text"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full rounded border p-2"
                  placeholder="LinkedIn URL"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="editIsActive">Active</label>
                </div>
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
                      setFormData({
                        name: '',
                        position: '',
                        bio: '',
                        photoUrl: '',
                        linkedinUrl: '',
                        isActive: true,
                      });
                    }}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-start gap-4">
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-amber-700">{member.position}</p>
                    {member.bio && <p className="mt-2 text-sm text-gray-600">{member.bio}</p>}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-amber-700 hover:text-amber-900 hover:underline"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-sm text-white transition-all hover:from-amber-800 hover:to-brown-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Order: {member.order} | Active: {member.isActive ? '✓' : '✗'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
