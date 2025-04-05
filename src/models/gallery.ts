import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the data file path
const DATA_DIR = path.join(process.cwd(), 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

// Initialize data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Define the gallery image structure
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  createdAt: string;
}

// Get hardcoded gallery images
const getHardcodedGalleryImages = (): GalleryImage[] => [
  // New images
  {
    id: '10',
    src: '/photo/new/IMG_0121.JPG',
    alt: 'New Gallery Image 1',
    width: 1200,
    height: 1600,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '11',
    src: '/photo/new/IMG_0130.JPG',
    alt: 'New Gallery Image 2',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '12',
    src: '/photo/new/IMG_0131.JPG',
    alt: 'New Gallery Image 3',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '13',
    src: '/photo/new/IMG20221206194029.jpg',
    alt: 'New Gallery Image 4',
    width: 1200,
    height: 1600,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '14',
    src: '/photo/new/IMG_0041.JPG',
    alt: 'New Gallery Image 5',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '15',
    src: '/photo/new/IMG_0108.JPG',
    alt: 'New Gallery Image 6',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '16',
    src: '/photo/new/IMG_0110.JPG',
    alt: 'New Gallery Image 7',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: '17',
    src: '/photo/new/IMG_0121 (2).JPG',
    alt: 'New Gallery Image 8',
    width: 1200,
    height: 900,
    category: 'new',
    createdAt: new Date().toISOString()
  },
  // Existing images
  {
    id: '1',
    src: '/photo/IMG_20241008_125850_367.jpg',
    alt: 'Gallery Image 1',
    width: 1200,
    height: 1600,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    src: '/photo/_storage_emulated_0_Android_data_com.miui.gallery_cache_SecurityShare_1705671865459.JPG',
    alt: 'Gallery Image 2',
    width: 1200,
    height: 900,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    src: '/photo/replicate-prediction-fijg3fjbln65j4a2ovggxn4eu4.png',
    alt: 'Gallery Image 3',
    width: 1024,
    height: 1024,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    src: '/photo/IMG_0041-3.jpg',
    alt: 'Gallery Image 4',
    width: 1200,
    height: 1200,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    src: '/photo/2022-03-17-11-26-56-726.jpg',
    alt: 'Gallery Image 5',
    width: 1200,
    height: 900,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    src: '/photo/AirBrush_20220317102809.jpg',
    alt: 'Gallery Image 6',
    width: 1024,
    height: 1536,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    src: '/photo/Picsart_22-01-25_01-22-13-972.jpg',
    alt: 'Gallery Image 7',
    width: 1200,
    height: 1200,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    src: '/photo/Snapchat-1762726516.jpg',
    alt: 'Gallery Image 8',
    width: 1200,
    height: 900,
    category: 'original',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    src: '/photo/2021-12-12-11-42-26-981.jpg',
    alt: 'Gallery Image 9',
    width: 1024,
    height: 1536,
    category: 'original',
    createdAt: new Date().toISOString()
  }
];

// Initialize the gallery file if it doesn't exist
if (!fs.existsSync(GALLERY_FILE)) {
  fs.writeFileSync(
    GALLERY_FILE,
    JSON.stringify(getHardcodedGalleryImages(), null, 2),
    'utf8'
  );
}

// Get all gallery images
export function getGalleryImages(): GalleryImage[] {
  try {
    const data = fs.readFileSync(GALLERY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return getHardcodedGalleryImages();
  }
}

// Add a new gallery image
export function addGalleryImage(image: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
  try {
    const images = getGalleryImages();
    
    const newImage: GalleryImage = {
      ...image,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    images.unshift(newImage); // Add to the beginning for newest first
    
    fs.writeFileSync(
      GALLERY_FILE,
      JSON.stringify(images, null, 2),
      'utf8'
    );
    
    return newImage;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
}

// Update a gallery image
export function updateGalleryImage(id: string, updates: Partial<GalleryImage>): GalleryImage | null {
  try {
    const images = getGalleryImages();
    const index = images.findIndex(img => img.id === id);
    
    if (index === -1) {
      return null;
    }
    
    images[index] = { ...images[index], ...updates };
    
    fs.writeFileSync(
      GALLERY_FILE,
      JSON.stringify(images, null, 2),
      'utf8'
    );
    
    return images[index];
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
}

// Delete a gallery image
export function deleteGalleryImage(id: string): GalleryImage | null {
  try {
    const images = getGalleryImages();
    const imageToDelete = images.find(img => img.id === id);
    
    if (!imageToDelete) {
      return null; // No image found with this id
    }
    
    const filteredImages = images.filter(img => img.id !== id);
    
    fs.writeFileSync(
      GALLERY_FILE,
      JSON.stringify(filteredImages, null, 2),
      'utf8'
    );
    
    return imageToDelete;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
} 