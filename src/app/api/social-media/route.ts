import { NextRequest, NextResponse } from 'next/server';
import { getSocialMediaAccounts, updateSocialMediaAccount } from '@/models/socialMedia';

// GET - Get all social media accounts
export async function GET() {
  try {
    const accounts = getSocialMediaAccounts();
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching social media accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media accounts' },
      { status: 500 }
    );
  }
}

// PATCH - Update a social media account
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { platform, updates } = data;
    
    if (!platform || !updates) {
      return NextResponse.json(
        { error: 'Platform and updates are required' },
        { status: 400 }
      );
    }
    
    const updatedAccount = updateSocialMediaAccount(platform, updates);
    
    if (!updatedAccount) {
      return NextResponse.json(
        { error: 'Account not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      account: updatedAccount
    });
  } catch (error) {
    console.error('Error updating social media account:', error);
    return NextResponse.json(
      { error: 'Failed to update social media account' },
      { status: 500 }
    );
  }
} 