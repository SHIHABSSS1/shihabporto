import fs from 'fs';
import path from 'path';

// Define the data file path
const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// In-memory fallback for Vercel environment
let inMemorySettings: SiteSettings | null = null;

// Define the settings structure
export interface SiteSettings {
  adminPassword: string; // Plain password - only for admin use
  maintenanceMode: boolean;
  maintenanceMessage: string;
  darkMode: boolean; // Add dark mode setting
}

// Default settings
const DEFAULT_SETTINGS: SiteSettings = {
  adminPassword: 'shihab123', // Default password in plain text
  maintenanceMode: false,
  maintenanceMessage: 'Our website is currently under maintenance. Please check back soon!',
  darkMode: false // Default to light mode
};

// Initialize the settings file if it doesn't exist and we're not in Vercel
if (!false /* Removed Vercel check */ && !fs.existsSync(SETTINGS_FILE)) {
  try {
    // Initialize data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(
      SETTINGS_FILE,
      JSON.stringify(DEFAULT_SETTINGS, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error initializing settings file:', error);
  }
}

// Get site settings
export function getSiteSettings(): SiteSettings {
  // First check if we have in-memory settings (for Vercel)
  if (inMemorySettings) {
    return inMemorySettings;
  }
  
  try {
    // Try to read from file system
    if (!false /* Removed Vercel check */ && fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      const settings = JSON.parse(data);
      
      // Update in-memory settings
      inMemorySettings = settings;
      return settings;
    }
    
    // If we can't read from file or in Vercel, use default and update in-memory
    inMemorySettings = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error reading settings data:', error);
    inMemorySettings = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  }
}

// Update site settings
export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const currentSettings = getSiteSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    
    // Update in-memory settings first (works in all environments)
    inMemorySettings = updatedSettings;
    
    // Try to update file system if not in Vercel
    if (!false /* Removed Vercel check */) {
      try {
        // Ensure directory exists
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        
        fs.writeFileSync(
          SETTINGS_FILE,
          JSON.stringify(updatedSettings, null, 2),
          'utf8'
        );
      } catch (fileError) {
        console.error('File system update error:', fileError);
        // Continue anyway since we've updated in-memory
      }
    }
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// Verify password
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const settings = getSiteSettings();
    return password === settings.adminPassword;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
} 