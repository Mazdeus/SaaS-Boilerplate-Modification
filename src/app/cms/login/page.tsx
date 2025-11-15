'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        // Show success toast with auto-dismiss
        const toastId = toast.success('Login successful!', {
          duration: 2000, // Show for 2 seconds
        });
        
        // Store token in localStorage as backup
        if (response.data.data.token) {
          localStorage.setItem('auth_token', response.data.data.token);
        }
        
        // Dismiss toast and navigate
        setTimeout(() => {
          toast.dismiss(toastId);
          router.push('/cms/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message, {
        duration: 4000, // Show error for 4 seconds
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          // Success toast style
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          // Error toast style
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-brodo-blue to-brodo-blue-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-card-lg shadow-brodo-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-brodo-blue mb-2">
                BRODO
              </h1>
              <p className="text-gray-600">Content Management System</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="admin@brodo.co.id"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="spinner mr-2"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            
          </div>
        </div>
      </div>
    </>
  );
}

