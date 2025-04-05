'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        setGalleryImages(data.images);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === filter);

  return (
    <>
      <Header />
      <main className="py-20 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Photo Gallery</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A collection of images showcasing my journey and adventures
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-800 rounded-full p-1 inline-flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Photos
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'new' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                New Photos
              </button>
              <button
                onClick={() => setFilter('original')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'original' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Original Photos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-900/20 rounded-lg border border-red-700 text-red-300 max-w-2xl mx-auto">
              <p>{error}</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className="overflow-hidden rounded-lg shadow-lg bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all"
                >
                  <div className="relative aspect-w-4 aspect-h-3">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 text-sm">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg text-gray-400 max-w-2xl mx-auto">
              <p>No images found for the selected filter.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 