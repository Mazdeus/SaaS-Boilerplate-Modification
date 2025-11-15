/**
 * CMS Contact Messages Management
 */

'use client';

import { useState, useEffect } from 'react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import DataTable from '@/components/cms/DataTable';
import Modal from '@/components/cms/Modal';
import LoadingSpinner from '@/components/cms/LoadingSpinner';
import EmptyState from '@/components/cms/EmptyState';
import Badge from '@/components/cms/Badge';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    
    // Mark as read
    if (!msg.isRead) {
      try {
        await fetch(`/api/contact-messages/${msg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        fetchMessages();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
      if (response.ok) fetchMessages();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const columns = [
    { 
      key: 'isRead' as keyof ContactMessage, 
      label: 'Status',
      render: (msg: ContactMessage) => (
        <Badge variant={msg.isRead ? 'default' : 'info'}>
          {msg.isRead ? 'Dibaca' : 'Baru'}
        </Badge>
      ),
    },
    { key: 'name' as keyof ContactMessage, label: 'Nama', sortable: true },
    { key: 'email' as keyof ContactMessage, label: 'Email', sortable: true },
    { 
      key: 'subject' as keyof ContactMessage, 
      label: 'Subjek',
      render: (msg: ContactMessage) => msg.subject || '-',
    },
    { 
      key: 'createdAt' as keyof ContactMessage, 
      label: 'Tanggal', 
      sortable: true,
      render: (msg: ContactMessage) => {
        try {
          return new Date(msg.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (error) {
          return '-';
        }
      },
    },
  ];

  const handleViewRow = (row: ContactMessage) => {
    handleView(row);
  };

  const handleDeleteRow = (row: ContactMessage) => {
    handleDelete(row.id);
  };

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pesan Kontak</h1>
            <p className="text-gray-600 mt-1">Lihat dan kelola pesan dari pelanggan</p>
          </div>
          {messages.length === 0 ? (
            <EmptyState title="Belum ada pesan" description="Pesan dari formulir kontak akan muncul di sini" />
          ) : (
            <DataTable
              columns={columns}
              data={messages}
              onEdit={handleViewRow}
              onDelete={handleDeleteRow}
            />
          )}
        </div>
      </main>

      {selectedMessage && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Pesan">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Dari</label>
              <p className="mt-1 text-gray-900">{selectedMessage.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{selectedMessage.email}</p>
            </div>
            {selectedMessage.subject && (
              <div>
                <label className="text-sm font-medium text-gray-700">Subjek</label>
                <p className="mt-1 text-gray-900">{selectedMessage.subject}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Pesan</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Diterima</label>
              <p className="mt-1 text-gray-900">
                {new Date(selectedMessage.createdAt).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Pertanyaan Anda'}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
              >
                Balas via Email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

