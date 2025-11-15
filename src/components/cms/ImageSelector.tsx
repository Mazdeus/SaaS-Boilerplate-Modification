/**
 * ImageSelector Component
 * Dropdown selector for choosing images from database
 */

'use client';

import { useState, useEffect } from 'react';

interface Image {
  id: number;
  fileName: string;
  url: string;
  altText: string | null;
  category: string | null;
}

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export default function ImageSelector({
  label,
  value,
  onChange,
  category,
  error,
  required,
  description,
}: ImageSelectorProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [category]);

  const fetchImages = async () => {
    try {
      const url = category 
        ? `/api/images?category=${category}`
        : '/api/images';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setImages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedImage = images.find(img => img.url === value);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={loading}
      >
        <option value="">-- Pilih Gambar --</option>
        {images.map((img) => (
          <option key={img.id} value={img.url}>
            {img.fileName} {img.altText ? `- ${img.altText}` : ''}
          </option>
        ))}
      </select>

      {/* Preview */}
      {selectedImage && (
        <div className="mt-3">
          <img
            src={selectedImage.url}
            alt={selectedImage.altText || 'Preview'}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Preview for manual input */}
      {value && !selectedImage && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'flex items-center justify-center h-48 bg-gray-100 rounded-lg border border-gray-200';
                errorDiv.innerHTML = '<span class="text-gray-400 text-sm">⚠️ Tidak dapat memuat preview</span>';
                parent.appendChild(errorDiv);
              }
            }}
          />
        </div>
      )}

      {/* Manual Input Option */}
      <div className="mt-3">
        <label className="text-xs text-gray-500">
          Atau masukkan URL manual:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/assets/image.jpg atau https://..."
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
