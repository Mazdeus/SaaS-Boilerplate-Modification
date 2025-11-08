'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  iconUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: '',
    iconUrl: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/cms/services');
      const result = await response.json();
      if (result.success) {
        setServices(result.data);
      } else {
        console.error('Failed to fetch services:', result.error);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing service
        const response = await fetch(`/api/cms/services/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Service updated successfully!');
          resetForm();
          fetchServices();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to update service: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new service
        const response = await fetch('/api/cms/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            order: services.length + 1,
          }),
        });
        
        if (response.ok) {
          alert('Service created successfully!');
          resetForm();
          fetchServices();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to create service: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      subtitle: service.subtitle || '',
      description: service.description,
      icon: service.icon || '',
      iconUrl: service.iconUrl || '',
      order: service.order,
      isActive: service.isActive,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service/value?')) return;
    
    try {
      const response = await fetch(`/api/cms/services/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Service/Value deleted successfully!');
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service/value');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      icon: '',
      iconUrl: '',
      order: 0,
      isActive: true,
    });
  };

  if (loading) {
    return <div className="p-8">Loading services...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <CMSNavigation />
      
      <h1 className="mb-8 text-3xl font-bold">Services & Values Management</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? 'Edit Service/Value' : 'Add New Service/Value'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Short tagline or subtitle"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icon (emoji or icon class)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🎨 or icon-class-name"
              />
            </div>

            <div>
              <Label htmlFor="iconUrl">Icon URL (optional)</Label>
              <Input
                id="iconUrl"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="/assets/icon.svg"
              />
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Service' : 'Create Service'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Existing Services/Values ({services.length})</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {services.map((service) => (
              <div key={service.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        {service.subtitle && (
                          <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
