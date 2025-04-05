import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getSiteContentFromMongo,
  updateAboutContentInMongo,
  updatePortfolioContentInMongo,
} from '@/models/content';

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

// GET - Get all site content
export async function GET(request: NextRequest) {
  try {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[${requestId}] GET /api/content - Received request at ${new Date().toISOString()}`);
    
    const url = new URL(request.url);
    const timestamp = url.searchParams.get('t');
    const isRefresh = url.searchParams.get('refresh') === 'true';
    console.log(`[${requestId}] Request params: timestamp=${timestamp}, refresh=${isRefresh}`);
    
    // Log the request headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log(`[${requestId}] Request headers:`, JSON.stringify(headers));
    
    console.log(`[${requestId}] Getting content directly from MongoDB`);
    const content = await getSiteContentFromMongo();
    console.log(`[${requestId}] Successfully fetched content from MongoDB`);
    
    // Return with timestamp and cache control headers
    return NextResponse.json({ 
      content, 
      timestamp: new Date().toISOString(),
      requestId
    }, { 
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch site content', 
        details: String(error),
        timestamp: new Date().toISOString()
      },
      { 
        status: 500, 
        headers: corsHeaders() 
      }
    );
  }
}

// PATCH - Update site content
export async function PATCH(request: NextRequest) {
  try {
    console.log('PATCH /api/content - Received request');
    
    const data = await request.json();
    const section = data.section; // 'about' or 'portfolio'
    const updates = data.updates;
    
    if (!section || !updates) {
      return NextResponse.json(
        { error: 'Section and updates are required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    if (section !== 'about' && section !== 'portfolio') {
      return NextResponse.json(
        { error: 'Invalid section. Must be "about" or "portfolio"' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    let result;
    if (section === 'about') {
      result = await updateAboutContentInMongo(updates);
    } else {
      result = await updatePortfolioContentInMongo(updates);
    }
    
    // Revalidate the related pages to update them
    try {
      // Revalidate the homepage and section pages
      revalidatePath('/', 'layout');
      revalidatePath(`/${section}`);
      
      console.log(`Revalidated paths for ${section} update`);
    } catch (revalidateError) {
      console.error('Error during revalidation:', revalidateError);
      // Continue even if revalidation fails
    }
    
    return NextResponse.json({ 
      success: true, 
      [section]: result,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json(
      { error: 'Failed to update site content', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
} 