import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePortfolioProjectInMongo } from '@/models/content';

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('PATCH /api/content/project - Received request');
    
    const { projectId, updates } = await request.json();
    
    if (!projectId || !updates) {
      return NextResponse.json(
        { error: 'Project ID and updates are required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    console.log(`Processing update for project ID: ${projectId}`);
    
    // Update the project using MongoDB function
    const updatedProject = await updatePortfolioProjectInMongo(projectId, updates);
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found or could not be updated' },
        { status: 404, headers: corsHeaders() }
      );
    }
    
    // Revalidate the related pages
    try {
      // Revalidate the homepage and portfolio section
      revalidatePath('/', 'layout');
      revalidatePath('/portfolio');
      
      console.log(`Revalidated paths for project ${projectId} update`);
    } catch (revalidateError) {
      console.error('Error during revalidation:', revalidateError);
      // Continue even if revalidation fails
    }
    
    return NextResponse.json({
      success: true,
      project: updatedProject,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
} 