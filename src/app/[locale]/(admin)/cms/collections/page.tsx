'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productLink?: string;
  createdAt: string;
}

export default function CollectionsManagementPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    productLink: '',
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Update slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ 
      ...formData, 
      name, 
      slug: generateSlug(name)
    });
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/public/collections');
      const result = await response.json();
      if (result.success) {
        setCollections(result.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing collection
        const response = await fetch(`/api/cms/collections/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Collection updated successfully!');
          resetForm();
          fetchCollections();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Update error:', response.status, errorData);
          alert(`Failed to update collection: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new collection
        const response = await fetch('/api/cms/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Collection created successfully!');
          resetForm();
          fetchCollections();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Create error:', response.status, errorData);
          alert(`Failed to create collection: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      imageUrl: collection.imageUrl,
      productLink: collection.productLink || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      const response = await fetch(`/api/cms/collections/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Collection deleted successfully!');
        fetchCollections();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error:', response.status, errorData);
        alert(`Failed to delete collection: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      productLink: '',
    });
  };

  if (loading) {
    return <div className="p-8">Loading collections...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CMSNavigation />
      
      <div className="container mx-auto p-8">
        <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? 'Edit Collection' : 'Add New Collection'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/assets/collection-image.webp"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="productLink">Product Link (Optional)</Label>
              <Input
                id="productLink"
                value={formData.productLink}
                onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                placeholder="https://example.com/products"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Collection' : 'Create Collection'}
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
          <h2 className="mb-4 text-xl font-semibold">Existing Collections ({collections.length})</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {collections.map((collection) => (
              <div key={collection.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Slug: {collection.slug}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(collection)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(collection.id)}
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
    </div>
  );
}
