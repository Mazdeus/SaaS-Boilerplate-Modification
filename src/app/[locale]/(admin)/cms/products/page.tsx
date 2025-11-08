'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface Product {
  id: number;
  collectionId?: number;
  name: string;
  slug: string;
  description: string;
  price: number; // in cents
  imageUrl: string;
  productLink?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Collection {
  id: number;
  name: string;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    imageUrl: '',
    productLink: '',
    collectionId: '',
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/cms/products');
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/cms/collections');
      const result = await response.json();
      if (result.success) {
        setCollections(result.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      collectionId: formData.collectionId ? Number(formData.collectionId) : null,
      price: Number(formData.price) * 100, // Convert to cents
    };
    
    try {
      if (editingId) {
        // Update existing product
        const response = await fetch(`/api/cms/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
        
        if (response.ok) {
          alert('Product updated successfully!');
          resetForm();
          fetchProducts();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to update product: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new product
        const response = await fetch('/api/cms/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
        
        if (response.ok) {
          alert('Product created successfully!');
          resetForm();
          fetchProducts();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to create product: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Math.round(product.price / 100), // Convert from cents to rupiah
      imageUrl: product.imageUrl,
      productLink: product.productLink || '',
      collectionId: product.collectionId?.toString() || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/cms/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete product: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      imageUrl: '',
      productLink: '',
      collectionId: '',
      isFeatured: false,
      isActive: true,
    });
  };

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <CMSNavigation />
      
      <h1 className="mb-8 text-3xl font-bold">Products Management</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
              <Label htmlFor="price">Price (IDR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="collectionId">Collection</Label>
              <select
                id="collectionId"
                value={formData.collectionId}
                onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">No Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/assets/product-image.webp"
                required
              />
            </div>

            <div>
              <Label htmlFor="productLink">Product Link (Optional)</Label>
              <Input
                id="productLink"
                value={formData.productLink}
                onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                placeholder="https://example.com/product"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isFeatured">Featured Product</Label>
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
                {editingId ? 'Update Product' : 'Create Product'}
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
          <h2 className="mb-4 text-xl font-semibold">Existing Products ({products.length})</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {products.map((product) => (
              <div key={product.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Slug: {product.slug}</p>
                    <p className="mt-1 text-sm">Rp {Math.round(product.price / 100).toLocaleString('id-ID')}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    {product.collectionId && (
                      <p className="mt-1 text-xs text-blue-600">
                        Collection ID: {product.collectionId}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      {product.isFeatured && (
                        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          Featured
                        </span>
                      )}
                      {!product.isActive && (
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
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
