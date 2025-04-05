import fs from 'fs';
import path from 'path';
import { getMongoDb, formatDocument, formatDocuments } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define the data file path (for local development)
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// Check if we're running on a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Initialize data directory if it doesn't exist and not in production
if (!isProduction && !fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Define the content structure with proper typing
export interface AboutContent {
  title: string;
  subtitle: string;
  profileImage: string;
  greeting: string;
  paragraphs: string[];
  skills: {
    title: string;
    icon: string;
    description: string;
  }[];
  journey: {
    period: string;
    title: string;
    description: string;
  }[];
}

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  link: string;
  githubLink?: string;
  liveLink?: string;
}

export interface PortfolioContent {
  title: string;
  subtitle: string;
  projects: PortfolioProject[];
}

export interface SiteContent {
  about: AboutContent;
  portfolio: PortfolioContent;
}

// Default content
export const defaultContent: SiteContent = {
  about: {
    title: "About Me",
    subtitle: "Learn more about my background, skills, and what drives me creatively.",
    profileImage: "/photo/AirBrush_20220317102809.jpg",
    greeting: "Hello, I'm Shihab",
    paragraphs: [
      "I'm a passionate designer and developer with over 5 years of experience creating digital experiences that users love. Based in New York City, I specialize in building modern, responsive websites and applications that solve real problems.",
      "My journey in web development began during college, where I discovered my love for creating beautiful and functional interfaces. Since then, I've worked with clients ranging from small startups to established businesses, helping them establish their digital presence and reach their goals.",
      "When I'm not coding, you can find me exploring photography, hiking in nature, or experimenting with new design trends and technologies."
    ],
    skills: [
      {
        title: "Web Development",
        icon: "FiCode",
        description: "Creating responsive, accessible websites using modern frameworks and best practices."
      },
      {
        title: "UI/UX Design",
        icon: "FiMonitor",
        description: "Designing intuitive interfaces that balance aesthetics with functionality."
      },
      {
        title: "Photography",
        icon: "FiCamera",
        description: "Capturing moments and creating visual stories through a creative lens."
      },
      {
        title: "Graphic Design",
        icon: "FiPenTool",
        description: "Creating visual content that communicates messages effectively."
      }
    ],
    journey: [
      {
        period: "2018 - Present",
        title: "Senior Web Developer at Tech Solutions",
        description: "Leading development of client websites and applications, mentoring junior developers, and implementing modern development workflows."
      },
      {
        period: "2016 - 2018",
        title: "Web Developer at Creative Agency",
        description: "Collaborated with designers to build websites for various clients, improved development processes, and implemented responsive design principles."
      },
      {
        period: "2014 - 2016",
        title: "Freelance Designer & Developer",
        description: "Worked with small businesses and startups to establish their online presence through custom websites and branding materials."
      }
    ]
  },
  portfolio: {
    title: "My Portfolio",
    subtitle: "A showcase of my projects and work. Browse through my latest creations and explore the technologies I've worked with.",
    projects: [
      {
        id: 1,
        title: "E-commerce Website",
        description: "A modern e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product search, cart functionality, and payment processing.",
        tags: ["React", "Node.js", "MongoDB", "Express"],
        imageSrc: "/photo/IMG_20241008_125850_367.jpg",
        link: "/portfolio/project-1"
      },
      {
        id: 2,
        title: "Mobile Banking App",
        description: "A secure and user-friendly mobile banking application designed for iOS and Android. Implemented features for account management, transactions, and financial insights.",
        tags: ["React Native", "Firebase", "Redux"],
        imageSrc: "/photo/2022-03-17-11-26-56-726.jpg",
        link: "/portfolio/project-2"
      },
      {
        id: 3,
        title: "Portfolio Website",
        description: "A custom portfolio website designed and developed for a professional photographer. Features include image galleries, contact forms, and a blog section.",
        tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
        imageSrc: "/photo/IMG_0041-3.jpg",
        link: "/portfolio/project-3"
      },
      {
        id: 4,
        title: "Task Management App",
        description: "A productivity application for teams to manage tasks, track progress, and collaborate efficiently. Includes features for task assignment, deadlines, and progress tracking.",
        tags: ["Vue.js", "Laravel", "MySQL"],
        imageSrc: "/photo/Picsart_22-01-25_01-22-13-972.jpg",
        link: "/portfolio/project-4"
      },
      {
        id: 5,
        title: "Health & Fitness Tracker",
        description: "A comprehensive health and fitness tracking application that helps users monitor their exercise, nutrition, and wellness goals. Includes data visualization and progress reports.",
        tags: ["Flutter", "Firebase", "Charts.js"],
        imageSrc: "/photo/AirBrush_20220317102809.jpg",
        link: "/portfolio/project-5"
      },
      {
        id: 6,
        title: "Real Estate Platform",
        description: "A web platform for real estate listings, property searches, and agent connections. Features include property filtering, map integration, and contact functionality.",
        tags: ["Angular", "Node.js", "PostgreSQL"],
        imageSrc: "/photo/2021-12-12-11-42-26-981.jpg",
        link: "/portfolio/project-6"
      }
    ]
  }
};

// Initialize the content file if it doesn't exist and not in production
if (!isProduction && !fs.existsSync(CONTENT_FILE)) {
  try {
    fs.writeFileSync(
      CONTENT_FILE,
      JSON.stringify(defaultContent, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error creating content file:', error);
  }
}

// Initialize MongoDB content if needed
async function initializeMongoContent() {
  try {
    console.log('Attempting to initialize MongoDB content');
    const db = await getMongoDb();
    const contentCollection = db.collection('siteContent');
    
    // Check if content exists
    const existingContent = await contentCollection.findOne({ type: 'main' });
    
    if (!existingContent) {
      console.log('No content found in MongoDB, initializing default content');
      // Insert default content
      await contentCollection.insertOne({
        type: 'main',
        content: defaultContent,
        updatedAt: new Date()
      });
      console.log('Default content initialized in MongoDB');
    } else {
      console.log('Content already exists in MongoDB');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing MongoDB content:', error);
    return false;
  }
}

// Get site content from MongoDB
export async function getSiteContentFromMongo(): Promise<SiteContent> {
  try {
    console.log('Getting content from MongoDB');
    await initializeMongoContent();
    
    const db = await getMongoDb();
    const contentCollection = db.collection('siteContent');
    
    // Get the main content document
    const contentDoc = await contentCollection.findOne({ type: 'main' });
    
    if (contentDoc && contentDoc.content) {
      console.log('Retrieved content from MongoDB successfully');
      return contentDoc.content as SiteContent;
    } else {
      console.log('No content found in MongoDB, returning default');
      return defaultContent;
    }
  } catch (error) {
    console.error('Error reading content from MongoDB:', error);
    return defaultContent;
  }
}

// Get site content - wrapper function to handle different environments
export async function getSiteContent(): Promise<SiteContent> {
  console.log('Get site content called in environment:', process.env.NODE_ENV);
  
  // Always use MongoDB for consistency between admin and frontend
  return getSiteContentFromMongo();
}

export async function updateAboutContentInMongo(updates: Partial<AboutContent>): Promise<AboutContent> {
  try {
    const db = await getMongoDb();
    const contentCollection = db.collection('siteContent');
    
    // Get current content
    const contentDoc = await contentCollection.findOne({ type: 'main' });
    
    if (!contentDoc) {
      await initializeMongoContent();
      return defaultContent.about;
    }
    
    // Create updated content
    const currentContent = contentDoc.content || defaultContent;
    const updatedAbout = {
      ...currentContent.about,
      ...updates
    };
    
    // Update in MongoDB
    await contentCollection.updateOne(
      { type: 'main' },
      { 
        $set: {
          'content.about': updatedAbout,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('About content updated in MongoDB');
    return updatedAbout;
  } catch (error) {
    console.error('Error updating about content in MongoDB:', error);
    return defaultContent.about;
  }
}

export async function updatePortfolioContentInMongo(updates: Partial<PortfolioContent>): Promise<PortfolioContent> {
  try {
    const db = await getMongoDb();
    const contentCollection = db.collection('siteContent');
    
    // Get current content
    const contentDoc = await contentCollection.findOne({ type: 'main' });
    
    if (!contentDoc) {
      await initializeMongoContent();
      return defaultContent.portfolio;
    }
    
    // Create updated content
    const currentContent = contentDoc.content || defaultContent;
    
    // Don't overwrite projects if not provided in updates
    const updatedPortfolio = {
      ...currentContent.portfolio,
      ...updates,
      // Keep existing projects if not provided in updates
      projects: updates.projects || currentContent.portfolio.projects
    };
    
    // Update in MongoDB
    await contentCollection.updateOne(
      { type: 'main' },
      { 
        $set: {
          'content.portfolio': updatedPortfolio,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('Portfolio content updated in MongoDB');
    return updatedPortfolio;
  } catch (error) {
    console.error('Error updating portfolio content in MongoDB:', error);
    return defaultContent.portfolio;
  }
}

export async function updatePortfolioProjectInMongo(
  projectId: number, 
  updates: Partial<PortfolioProject>
): Promise<PortfolioProject | null> {
  try {
    const db = await getMongoDb();
    const contentCollection = db.collection('siteContent');
    
    // Get current content
    const contentDoc = await contentCollection.findOne({ type: 'main' });
    
    if (!contentDoc || !contentDoc.content) {
      console.log('No content found, initializing default content');
      await initializeMongoContent();
      return null;
    }
    
    const currentContent = contentDoc.content;
    const currentProjects = currentContent.portfolio.projects || [];
    
    // Find the project by ID
    const projectIndex = currentProjects.findIndex(
      (p: PortfolioProject) => p.id === projectId
    );
    
    if (projectIndex === -1) {
      console.log(`Project with ID ${projectId} not found`);
      return null;
    }
    
    // Create updated project
    const updatedProject = {
      ...currentProjects[projectIndex],
      ...updates
    };
    
    // Create a new projects array with the updated project
    const updatedProjects = [...currentProjects];
    updatedProjects[projectIndex] = updatedProject;
    
    // Update in MongoDB
    await contentCollection.updateOne(
      { type: 'main' },
      { 
        $set: {
          'content.portfolio.projects': updatedProjects,
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`Project ${projectId} updated in MongoDB`);
    return updatedProject;
  } catch (error) {
    console.error('Error updating project in MongoDB:', error);
    return null;
  }
}

// Legacy function aliases for backward compatibility
// Removed legacy Firebase function: getSiteContentFromFirebase
// Removed legacy Firebase function: updateAboutContentInFirebase
// Removed legacy Firebase function: updatePortfolioContentInFirebase
// Removed legacy Firebase function: updatePortfolioProjectInFirebase 