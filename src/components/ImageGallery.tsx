'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ImageGalleryProps = {
  images: GalleryImage[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0
      );
    } else {
      setSelectedImageIndex(prev => 
        prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev');
    } else if (e.key === 'ArrowRight') {
      navigateImage('next');
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div 
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <FiX size={24} />
            </button>
            
            <button
              className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
              onClick={() => navigateImage('prev')}
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button
              className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
              onClick={() => navigateImage('next')}
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
            
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={images[selectedImageIndex].src}
                alt={images[selectedImageIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            
            <div className="absolute bottom-4 text-white text-center">
              <p className="text-sm opacity-80">{selectedImageIndex + 1} / {images.length}</p>
              <p className="mt-1 text-xl">{images[selectedImageIndex].alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 