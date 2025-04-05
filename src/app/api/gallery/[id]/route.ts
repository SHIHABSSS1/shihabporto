import { NextRequest, NextResponse } from 'next/server';
import { deleteGalleryImage } from '@/models/gallery';
import { unlink } from 'fs/promises';
import path from 'path';

// DELETE - Remove a gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }
    
    const deletedImage = deleteGalleryImage(id);
    
    if (!deletedImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Try to delete the file from disk if it's in the uploads folder
    if (deletedImage.src && deletedImage.src.includes('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', deletedImage.src);
        await unlink(filePath);
      } catch (err) {
        console.error('Error deleting file from disk:', err);
        // Continue anyway, as we've already removed from the data model
      }
    }
    
    return NextResponse.json({ 
      message: 'Image deleted successfully',
      image: deletedImage
    });
    
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 