import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings, verifyPassword } from '@/models/settings';
import { cookies } from 'next/headers';

// GET - Get site settings (returns non-sensitive data only)
export async function GET() {
  try {
    const settings = getSiteSettings();
    
    // Return everything except the password
    const { adminPassword, ...publicSettings } = settings;
    
    return NextResponse.json({ settings: publicSettings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update site settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, updates } = body;
    
    // Require current password for any updates
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }
    
    // Verify the current password
    const isPasswordValid = await verifyPassword(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }
    
    // Update settings
    const updatedSettings = await updateSiteSettings(updates);
    
    // Create the response first
    const { adminPassword, ...publicSettings } = updatedSettings;
    const response = NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: publicSettings
    });
    
    // Set or clear maintenance mode cookies on the response object
    try {
      if (updates.maintenanceMode !== undefined) {
        response.cookies.set('maintenance_mode', String(updates.maintenanceMode), {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      
      if (updates.maintenanceMessage) {
        response.cookies.set('maintenance_message', encodeURIComponent(updates.maintenanceMessage), {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      
      // Set dark mode cookie if that setting was updated
      if (updates.darkMode !== undefined) {
        response.cookies.set('darkMode', String(updates.darkMode), {
          path: '/',
          httpOnly: false, // Allow JavaScript access
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 365, // 1 year
        });
      }
    } catch (cookieError) {
      console.error('Error setting cookies:', cookieError);
      // Continue anyway - the settings are still updated in memory
    }
    
    return response;
    
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
} 