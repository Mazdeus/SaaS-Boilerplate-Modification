'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface CompanyInfo {
  id: number;
  name: string;
  tagline: string;
  description: string;
  foundedYear: number;
  location: string;
  industry: string;
  employees: number;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  isActive: boolean;
  updatedAt: string;
}

export default function CompanyInfoManagementPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    foundedYear: new Date().getFullYear(),
    location: '',
    industry: '',
    employees: 0,
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/cms/company-info');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const info = result.data[0];
        setCompanyInfo(info);
        setFormData({
          name: info.name || '',
          tagline: info.tagline || '',
          description: info.description || '',
          foundedYear: info.foundedYear || new Date().getFullYear(),
          location: info.location || '',
          industry: info.industry || '',
          employees: info.employees || 0,
          email: info.email || '',
          phone: info.phone || '',
          address: info.address || '',
          logoUrl: info.logoUrl || '',
          isActive: info.isActive !== undefined ? info.isActive : true,
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (companyInfo) {
        // Update existing company info
        const response = await fetch(`/api/cms/company-info/${companyInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Company information updated successfully!');
          fetchCompanyInfo();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to update company information: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new company info
        const response = await fetch('/api/cms/company-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('Company information created successfully!');
          fetchCompanyInfo();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to create company information: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      alert('Failed to save company information');
    }
  };

  if (loading) {
    return <div className="p-8">Loading company information...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <CMSNavigation />
      
      <h1 className="mb-8 text-3xl font-bold">Company Information Management</h1>
      
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {companyInfo ? 'Edit Company Information' : 'Create Company Information'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="/assets/logo.png"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Your company tagline"
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

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.foundedYear}
                onChange={(e) => setFormData({ ...formData, foundedYear: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Technology, Fashion"
              />
            </div>

            <div>
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                type="number"
                min="0"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          
          <Button type="submit" className="w-full">
            {companyInfo ? 'Update Company Information' : 'Create Company Information'}
          </Button>
        </form>

        {companyInfo && (
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-3 font-semibold text-muted-foreground">Current Information:</h3>
            <div className="space-y-2 rounded bg-muted p-4 text-sm">
              <p><strong>Name:</strong> {companyInfo.name}</p>
              <p><strong>Tagline:</strong> {companyInfo.tagline}</p>
              <p><strong>Industry:</strong> {companyInfo.industry}</p>
              <p><strong>Founded:</strong> {companyInfo.foundedYear}</p>
              <p><strong>Location:</strong> {companyInfo.location}</p>
              <p><strong>Employees:</strong> {companyInfo.employees}</p>
              <p><strong>Email:</strong> {companyInfo.email}</p>
              <p><strong>Phone:</strong> {companyInfo.phone}</p>
              <p><strong>Address:</strong> {companyInfo.address}</p>
              <p><strong>Status:</strong> {companyInfo.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(companyInfo.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
