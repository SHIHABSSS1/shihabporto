import fs from 'fs';
import path from 'path';

// Define the data file path
const DATA_DIR = path.join(process.cwd(), 'data');
const SOCIAL_MEDIA_FILE = path.join(DATA_DIR, 'social_media.json');

// Initialize data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Define the social media structure
export interface SocialMediaAccount {
  platform: string;
  username: string;
  displayName: string;
  url: string;
  icon: string;
  color: string;
}

// Default social media accounts
const defaultSocialMedia: SocialMediaAccount[] = [
  {
    platform: 'instagram',
    username: '@shihab',
    displayName: 'Instagram',
    url: 'https://instagram.com',
    icon: 'FaInstagram',
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400'
  },
  {
    platform: 'facebook',
    username: 'Shihab Hossain',
    displayName: 'Facebook',
    url: 'https://facebook.com',
    icon: 'FaFacebook',
    color: 'bg-blue-600'
  },
  {
    platform: 'telegram',
    username: '@shihabuser',
    displayName: 'Telegram',
    url: 'https://t.me/shihabuser',
    icon: 'FaTelegram',
    color: 'bg-blue-500'
  },
  {
    platform: 'signal',
    username: '+8801745368299',
    displayName: 'Signal',
    url: 'https://signal.me/#p/+8801745368299',
    icon: 'SiSignal',
    color: 'bg-blue-700'
  },
  {
    platform: 'whatsapp',
    username: '+8801745368299',
    displayName: 'WhatsApp',
    url: 'https://wa.me/8801745368299',
    icon: 'FaWhatsapp',
    color: 'bg-green-500'
  },
  {
    platform: 'tiktok',
    username: '@shihab',
    displayName: 'TikTok',
    url: 'https://tiktok.com/@shihab',
    icon: 'FaTiktok',
    color: 'bg-black'
  }
];

// Initialize the social media file if it doesn't exist
if (!fs.existsSync(SOCIAL_MEDIA_FILE)) {
  fs.writeFileSync(
    SOCIAL_MEDIA_FILE,
    JSON.stringify(defaultSocialMedia, null, 2),
    'utf8'
  );
}

// Get all social media accounts
export function getSocialMediaAccounts(): SocialMediaAccount[] {
  try {
    const data = fs.readFileSync(SOCIAL_MEDIA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading social media data:', error);
    return defaultSocialMedia;
  }
}

// Update a social media account
export function updateSocialMediaAccount(
  platform: string,
  updates: Partial<SocialMediaAccount>
): SocialMediaAccount | null {
  try {
    const accounts = getSocialMediaAccounts();
    const index = accounts.findIndex(account => account.platform === platform);
    
    if (index === -1) {
      return null;
    }
    
    // Update only the provided fields
    accounts[index] = { ...accounts[index], ...updates };
    
    // Update the URL if username changed and it's part of the URL
    if (updates.username && accounts[index].url.includes(accounts[index].platform)) {
      // For platforms that use username in URL
      if (['telegram', 'tiktok'].includes(platform)) {
        const username = updates.username.startsWith('@')
          ? updates.username.substring(1)
          : updates.username;
        accounts[index].url = `https://${platform}.com/${username}`;
        
        // Special case for Telegram
        if (platform === 'telegram') {
          accounts[index].url = `https://t.me/${username}`;
        }
      }
      
      // For phone number based platforms
      if (['whatsapp', 'signal'].includes(platform) && updates.username) {
        const phoneNumber = updates.username.replace(/\D/g, '');
        if (platform === 'whatsapp') {
          accounts[index].url = `https://wa.me/${phoneNumber}`;
        } else if (platform === 'signal') {
          accounts[index].url = `https://signal.me/#p/+${phoneNumber}`;
        }
      }
    }
    
    // Save the updated accounts
    fs.writeFileSync(
      SOCIAL_MEDIA_FILE,
      JSON.stringify(accounts, null, 2),
      'utf8'
    );
    
    return accounts[index];
  } catch (error) {
    console.error('Error updating social media account:', error);
    return null;
  }
} 