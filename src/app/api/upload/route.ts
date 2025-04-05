import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
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
    
    // Save to public/uploads folder
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      fileName,
      url: `/uploads/${fileName}`
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 