'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CMSNavigation from '@/components/cms/CMSNavigation';

interface AboutSection {
  id: number;
  title: string;
  whoWeAre: string;
  whatWeDo: string;
  mission: string;
  vision: string;
  statsClients: number;
  statsProjects: number;
  statsYears: number;
  statsTeam: number;
  updatedAt: string;
}

export default function AboutManagementPage() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    whoWeAre: '',
    whatWeDo: '',
    mission: '',
    vision: '',
    statsClients: 0,
    statsProjects: 0,
    statsYears: 0,
    statsTeam: 0,
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/cms/about');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const aboutData = result.data[0];
        setAbout(aboutData);
        setFormData({
          title: aboutData.title || '',
          whoWeAre: aboutData.whoWeAre || '',
          whatWeDo: aboutData.whatWeDo || '',
          mission: aboutData.mission || '',
          vision: aboutData.vision || '',
          statsClients: aboutData.statsClients || 0,
          statsProjects: aboutData.statsProjects || 0,
          statsYears: aboutData.statsYears || 0,
          statsTeam: aboutData.statsTeam || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (about) {
        // Update existing about
        const response = await fetch(`/api/cms/about/${about.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('About section updated successfully!');
          fetchAbout();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to update about section: ${errorData.error || response.statusText}`);
        }
      } else {
        // Create new about
        const response = await fetch('/api/cms/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('About section created successfully!');
          fetchAbout();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to create about section: ${errorData.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error saving about:', error);
      alert('Failed to save about section');
    }
  };

  if (loading) {
    return <div className="p-8">Loading about content...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <CMSNavigation />
      
      <h1 className="mb-8 text-3xl font-bold">About Us Management</h1>
      
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {about ? 'Edit About Section' : 'Create About Section'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="About Us"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="whoWeAre">Who We Are</Label>
            <textarea
              id="whoWeAre"
              value={formData.whoWeAre}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, whoWeAre: e.target.value })}
              rows={4}
              placeholder="Describe who your company is..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="whatWeDo">What We Do</Label>
            <textarea
              id="whatWeDo"
              value={formData.whatWeDo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, whatWeDo: e.target.value })}
              rows={4}
              placeholder="Describe what your company does..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="mission">Mission</Label>
            <textarea
              id="mission"
              value={formData.mission}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, mission: e.target.value })}
              rows={3}
              placeholder="Your company mission..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="vision">Vision</Label>
            <textarea
              id="vision"
              value={formData.vision}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, vision: e.target.value })}
              rows={3}
              placeholder="Your company vision..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="statsClients">Happy Clients</Label>
              <Input
                id="statsClients"
                type="number"
                value={formData.statsClients}
                onChange={(e) => setFormData({ ...formData, statsClients: Number(e.target.value) })}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="statsProjects">Projects Completed</Label>
              <Input
                id="statsProjects"
                type="number"
                value={formData.statsProjects}
                onChange={(e) => setFormData({ ...formData, statsProjects: Number(e.target.value) })}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="statsYears">Years of Experience</Label>
              <Input
                id="statsYears"
                type="number"
                value={formData.statsYears}
                onChange={(e) => setFormData({ ...formData, statsYears: Number(e.target.value) })}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="statsTeam">Team Members</Label>
              <Input
                id="statsTeam"
                type="number"
                value={formData.statsTeam}
                onChange={(e) => setFormData({ ...formData, statsTeam: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            {about ? 'Update About Section' : 'Create About Section'}
          </Button>
        </form>

        {about && (
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-3 font-semibold text-muted-foreground">Current Content:</h3>
            <div className="rounded bg-muted p-4 space-y-3">
              <div><strong>Title:</strong> {about.title}</div>
              {about.whoWeAre && <div><strong>Who We Are:</strong> {about.whoWeAre}</div>}
              {about.whatWeDo && <div><strong>What We Do:</strong> {about.whatWeDo}</div>}
              {about.mission && <div><strong>Mission:</strong> {about.mission}</div>}
              {about.vision && <div><strong>Vision:</strong> {about.vision}</div>}
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <div><strong>Clients:</strong> {about.statsClients}</div>
                <div><strong>Projects:</strong> {about.statsProjects}</div>
                <div><strong>Years:</strong> {about.statsYears}</div>
                <div><strong>Team:</strong> {about.statsTeam}</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(about.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
