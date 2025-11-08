'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  message: string;
  rating: number;
  avatarId?: number;
  isActive: boolean;
  createdAt: string;
}

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    message: '',
    rating: 5,
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/cms/testimonials');
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.data);
      } else {
        console.error('Failed to fetch testimonials:', result.error);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing testimonial
        const response = await fetch(`/api/cms/testimonials/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Testimonial updated successfully!');
          resetForm();
          fetchTestimonials();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to update testimonial: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new testimonial
        const response = await fetch('/api/cms/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Testimonial created successfully!');
          resetForm();
          fetchTestimonials();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to create testimonial: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      position: testimonial.position || '',
      company: testimonial.company || '',
      message: testimonial.message,
      rating: testimonial.rating,
      isActive: testimonial.isActive,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Testimonial deleted successfully!');
        fetchTestimonials();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete testimonial: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      position: '',
      company: '',
      message: '',
      rating: 5,
      isActive: true,
    });
  };

  if (loading) {
    return <div className="p-8">Loading testimonials...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <CMSNavigation />
      
      <h1 className="mb-8 text-3xl font-bold">Testimonials Management</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., CEO, Manager"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Testimonial Message</Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                required
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
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
                {editingId ? 'Update Testimonial' : 'Create Testimonial'}
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
          <h2 className="mb-4 text-xl font-semibold">Existing Testimonials ({testimonials.length})</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position && testimonial.company 
                        ? `${testimonial.position} at ${testimonial.company}`
                        : testimonial.position || testimonial.company || 'Customer'
                      }
                    </p>
                    <p className="mt-2 text-sm line-clamp-3">{testimonial.message}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                      {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-gray-300">★</span>
                      ))}
                    </div>
                    {!testimonial.isActive && (
                      <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id)}
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
