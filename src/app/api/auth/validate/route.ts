import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Get the admin password from environment variables
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if env variable is set
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error' 
        }, 
        { status: 500 }
      );
    }
    
    // Validate password
    const isValid = password === adminPassword;
    
    if (isValid) {
      return NextResponse.json({ 
        success: true,
        message: 'Authentication successful'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid password' 
        }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in auth validation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed' 
      }, 
      { status: 500 }
    );
  }
} 