import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages, addGalleryImage } from '@/models/gallery';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sizeOf from 'image-size';

// GET - Get all gallery images
export async function GET() {
  try {
    const images = getGalleryImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST - Add a new gallery image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'new';
    const alt = formData.get('alt') as string || 'Gallery Image';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a unique filename
    const originalName = file.name;
    const fileExtension = path.extname(originalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Ensure directory exists
    const uploadsDir = path.join(process.cwd(), 'public/photo/uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.log('Directory already exists or cannot be created');
    }
    
    // Save file to disk
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Determine image dimensions
    let width = 1200;
    let height = 1200;
    
    try {
      const dimensions = sizeOf(buffer);
      if (dimensions.width && dimensions.height) {
        width = dimensions.width;
        height = dimensions.height;
      }
    } catch (err) {
      console.error('Error determining image dimensions:', err);
      // Use default dimensions
    }
    
    // Create gallery image entry
    const newImage = addGalleryImage({
      src: `/photo/uploads/${fileName}`,
      alt,
      width,
      height,
      category
    });
    
    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      image: newImage
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 