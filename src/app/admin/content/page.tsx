'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiSave, FiRefreshCw, FiLogOut, FiPlus, FiTrash, FiEdit, FiUpload, FiCheck, FiImage } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

// Content interfaces
interface AboutContent {
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

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  link: string;
  githubLink?: string;
  liveLink?: string;
}

interface PortfolioContent {
  title: string;
  subtitle: string;
  projects: PortfolioProject[];
}

interface SiteContent {
  about: AboutContent;
  portfolio: PortfolioContent;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  createdAt: string;
}

export default function ContentEditorPage() {
  const [content, setContent] = useState<SiteContent | null>({
    about: {
      title: '',
      subtitle: '',
      profileImage: '',
      greeting: '',
      paragraphs: [],
      skills: [],
      journey: []
    },
    portfolio: {
      title: '',
      subtitle: '',
      projects: []
    }
  });
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'gallery'>('about');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCategory, setUploadCategory] = useState('new');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  
  // Check for authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
      fetchContent();
    }
  }, []);
  
  // Authentication using server-side validation with fallback
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First try the API endpoint
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        fetchContent();
        setError('');
      } else {
        // Fallback to hardcoded password as backup (temporary)
        if (password === 'UVMcKicoXU1buxUZ') {
          console.log('Using fallback authentication');
          setAuthenticated(true);
          localStorage.setItem('adminAuthenticated', 'true');
          fetchContent();
          setError('');
        } else {
          setError(data.error || 'Invalid password');
        }
      }
    } catch (err) {
      console.error('Authentication API error:', err);
      // Fallback to hardcoded password on API error
      if (password === 'UVMcKicoXU1buxUZ') {
        console.log('Using fallback authentication after API error');
        setAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        fetchContent();
        setError('');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };
  
  const fetchContent = async () => {
    setLoading(true);
    try {
      // Add timestamp to bust cache and force fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/content?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store' // Force Next.js to never cache this request
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const data = await response.json();
      console.log('Fetched fresh content at:', new Date().toISOString());
      setContent(data.content);
      setError('');
    } catch (err) {
      setError('Error fetching content. Please try again.');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshContent = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Add multiple cache busting techniques
      const timestamp = new Date().getTime();
      console.log('Manually refreshing content at:', new Date().toISOString());
      
      const response = await fetch(`/api/content?t=${timestamp}&refresh=true`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store',
        next: { revalidate: 0 } // Force revalidation in Next.js
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh content');
      }
      
      const data = await response.json();
      console.log('Received fresh content:', data.timestamp);
      setContent(data.content);
      setSuccess('Content refreshed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error refreshing content. Please try again.');
      console.error('Error refreshing content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateContent = async (section: 'about' | 'portfolio', updates: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, updates }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update ${section} content`);
      }
      
      const data = await response.json();
      
      // Update the local state
      setContent(prevContent => {
        if (!prevContent) return null;
        return {
          ...prevContent,
          [section]: data.content
        };
      });
      
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} content updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(`Error updating ${section} content. Please try again.`);
      console.error(`Error updating ${section} content:`, err);
    } finally {
      setSaving(false);
    }
  };
  
  const updateProject = async (projectId: number, updates: Partial<PortfolioProject>) => {
    setSaving(true);
    try {
      // Force cache bypassing by adding timestamp to the URL
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/content/project?t=${timestamp}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ projectId, updates }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.error || 'Failed to update project');
      }
      
      const data = await response.json();
      console.log('Project update response:', data);
      
      // Force a complete content refresh with cache busting
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure Firestore consistency
      const refreshTimestamp = new Date().getTime();
      await fetch(`/api/content?t=${refreshTimestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).then(res => res.json())
        .then(freshData => {
          console.log('Fresh content fetched after project update');
          setContent(freshData.content);
        });
      
      setEditingProjectId(null);
      setSuccess('Project updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error updating project. Please try again.');
      console.error('Error updating project:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleAboutUpdate = () => {
    if (!content) return;
    
    updateContent('about', content.about);
  };
  
  const handlePortfolioUpdate = () => {
    if (!content) return;
    
    updateContent('portfolio', {
      title: content.portfolio?.title || '',
      subtitle: content.portfolio?.subtitle || ''
    });
  };
  
  const handleProjectUpdate = (projectId: number) => {
    if (!content) return;
    
    const project = content.portfolio.projects.find(p => p.id === projectId);
    if (!project) return;
    
    updateProject(projectId, project);
  };
  
  const handleProjectTagsChange = (projectId: number, tagsString: string) => {
    if (!content) return;
    
    setContent(prevContent => {
      if (!prevContent) return null;
      
      const updatedProjects = (prevContent.portfolio?.projects || []).map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tags: tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
          };
        }
        return project;
      });
      
      return {
        ...prevContent,
        portfolio: {
          ...(prevContent.portfolio || {}),
          projects: updatedProjects
        }
      };
    });
  };
  
  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }
      
      const data = await response.json();
      setGalleryImages(data.images);
      setError('');
    } catch (err) {
      setError('Error fetching gallery images. Please try again.');
      console.error('Error fetching gallery images:', err);
    } finally {
      setLoadingGallery(false);
    }
  };
  
  // Load gallery images when switching to the gallery tab
  useEffect(() => {
    if (activeTab === 'gallery' && authenticated) {
      fetchGalleryImages();
    }
  }, [activeTab, authenticated]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('alt', uploadAlt || 'Gallery Image');
      formData.append('category', uploadCategory);
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json();
      
      // Add the new image to the gallery images
      setGalleryImages(prev => [data.image, ...prev]);
      
      // Reset form
      setUploadFile(null);
      setUploadAlt('');
      setSuccess('Image uploaded successfully!');
      
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }
      
      // Remove the deleted image from the list
      setGalleryImages(prev => prev.filter(img => img.id !== id));
      
      setSuccess('Image deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (!authenticated) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Access</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAuthenticate}>
                <div className="mb-4">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                  Content Editor
                </span>
              </h1>
              <p className="text-gray-400 mt-1">
                Edit your site content including About Me and Portfolio sections
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refreshContent}
                className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all"
                disabled={loading}
              >
                {loading ? <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FiRefreshCw size={16} />}
                Refresh
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md flex items-center gap-2 border border-red-700">
              <FiTrash />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-md flex items-center gap-2 border border-green-700">
              <FiCheck />
              <span>{success}</span>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'about'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About Me
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'portfolio'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'gallery'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-400">Loading content...</p>
            </div>
          ) : content ? (
            <>
              {/* About Me Tab */}
              {activeTab === 'about' && (
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                  <h2 className="text-xl font-bold mb-6 text-white">About Me Section</h2>
                  
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={content?.about?.title || ''}
                          onChange={(e) => setContent({
                            ...content,
                            about: { ...content.about, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={content?.about?.subtitle || ''}
                          onChange={(e) => setContent({
                            ...content,
                            about: { ...content.about, subtitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Greeting
                        </label>
                        <input
                          type="text"
                          value={content?.about?.greeting || ''}
                          onChange={(e) => setContent({
                            ...content,
                            about: { ...content.about, greeting: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Profile Image Path
                        </label>
                        <input
                          type="text"
                          value={content?.about?.profileImage || ''}
                          onChange={(e) => setContent({
                            ...content,
                            about: { ...content.about, profileImage: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Paragraphs
                      </label>
                      {content?.about?.paragraphs?.map((paragraph, index) => (
                        <div key={index} className="mb-2 flex gap-2">
                          <textarea
                            value={paragraph || ''}
                            onChange={(e) => {
                              const newParagraphs = [...(content?.about?.paragraphs || [])];
                              newParagraphs[index] = e.target.value;
                              setContent({
                                ...content!,
                                about: { ...(content?.about || {}), paragraphs: newParagraphs }
                              });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            rows={3}
                          />
                          <button
                            onClick={() => {
                              const newParagraphs = (content?.about?.paragraphs || []).filter((_, i) => i !== index);
                              setContent({
                                ...content!,
                                about: { ...(content?.about || {}), paragraphs: newParagraphs }
                              });
                            }}
                            className="bg-red-600 p-2 rounded-md self-start"
                          >
                            <FiTrash className="text-white" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setContent({
                            ...content!,
                            about: { 
                              ...(content?.about || {}), 
                              paragraphs: [...(content?.about?.paragraphs || []), ''] 
                            }
                          });
                        }}
                        className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300"
                      >
                        <FiPlus size={16} />
                        Add Paragraph
                      </button>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={handleAboutUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70"
                      >
                        {saving ? (
                          <>
                            <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave size={16} />
                            Save About Content
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-white">Portfolio Section</h2>
                    
                    <div className="grid gap-6 md:grid-cols-2 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={content?.portfolio?.title || ''}
                          onChange={(e) => setContent({
                            ...content,
                            portfolio: { ...content.portfolio, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={content?.portfolio?.subtitle || ''}
                          onChange={(e) => setContent({
                            ...content,
                            portfolio: { ...content.portfolio, subtitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePortfolioUpdate}
                      disabled={saving}
                      className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave size={16} />
                          Save Portfolio Section
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-white">Portfolio Projects</h2>
                    
                    <div className="space-y-6">
                      {content?.portfolio?.projects?.map(project => (
                        <div 
                          key={project.id} 
                          className="p-4 border border-gray-700 rounded-lg bg-gray-850 hover:border-gray-600"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-md overflow-hidden relative flex-shrink-0">
                                <Image
                                  src={project.imageSrc}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                            </div>
                            
                            <button
                              onClick={() => setEditingProjectId(editingProjectId === project.id ? null : project.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEdit size={18} />
                            </button>
                          </div>
                          
                          {editingProjectId === project.id && (
                            <div className="pt-2 border-t border-gray-700 mt-2 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Project Title
                                  </label>
                                  <input
                                    type="text"
                                    value={project.title}
                                    onChange={(e) => {
                                      const updatedProjects = content.portfolio.projects.map(p => 
                                        p.id === project.id ? { ...p, title: e.target.value } : p
                                      );
                                      setContent({
                                        ...content,
                                        portfolio: { ...content.portfolio, projects: updatedProjects }
                                      });
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Image Path
                                  </label>
                                  <input
                                    type="text"
                                    value={project.imageSrc}
                                    onChange={(e) => {
                                      const updatedProjects = content.portfolio.projects.map(p => 
                                        p.id === project.id ? { ...p, imageSrc: e.target.value } : p
                                      );
                                      setContent({
                                        ...content,
                                        portfolio: { ...content.portfolio, projects: updatedProjects }
                                      });
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={project.description}
                                  onChange={(e) => {
                                    const updatedProjects = content.portfolio.projects.map(p => 
                                      p.id === project.id ? { ...p, description: e.target.value } : p
                                    );
                                    setContent({
                                      ...content,
                                      portfolio: { ...content.portfolio, projects: updatedProjects }
                                    });
                                  }}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Tags (comma separated)
                                  </label>
                                  <input
                                    type="text"
                                    value={project.tags.join(', ')}
                                    onChange={(e) => handleProjectTagsChange(project.id, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Page Link
                                  </label>
                                  <input
                                    type="text"
                                    value={project.link}
                                    onChange={(e) => {
                                      const updatedProjects = content.portfolio.projects.map(p => 
                                        p.id === project.id ? { ...p, link: e.target.value } : p
                                      );
                                      setContent({
                                        ...content,
                                        portfolio: { ...content.portfolio, projects: updatedProjects }
                                      });
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    GitHub Link (optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={project.githubLink || ''}
                                    onChange={(e) => {
                                      const updatedProjects = content.portfolio.projects.map(p => 
                                        p.id === project.id ? { ...p, githubLink: e.target.value } : p
                                      );
                                      setContent({
                                        ...content,
                                        portfolio: { ...content.portfolio, projects: updatedProjects }
                                      });
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Live Site Link (optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={project.liveLink || ''}
                                    onChange={(e) => {
                                      const updatedProjects = content.portfolio.projects.map(p => 
                                        p.id === project.id ? { ...p, liveLink: e.target.value } : p
                                      );
                                      setContent({
                                        ...content,
                                        portfolio: { ...content.portfolio, projects: updatedProjects }
                                      });
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end pt-4">
                                <button
                                  onClick={() => handleProjectUpdate(project.id)}
                                  disabled={saving}
                                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70"
                                >
                                  {saving ? (
                                    <>
                                      <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <FiSave size={16} />
                                      Save Project
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-white">Upload New Image</h2>
                    
                    <form onSubmit={handleImageUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Image File
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            required
                          />
                          {uploadFile && (
                            <span className="text-green-400 text-sm flex items-center gap-1">
                              <FiCheck size={16} />
                              {uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Image Alt Text
                          </label>
                          <input
                            type="text"
                            value={uploadAlt}
                            onChange={(e) => setUploadAlt(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            placeholder="Description of the image"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                          >
                            <option value="new">New Photos</option>
                            <option value="original">Original Photos</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isUploading || !uploadFile}
                          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70"
                        >
                          {isUploading ? (
                            <>
                              <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FiUpload size={16} />
                              Upload Image
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">Gallery Images</h2>
                      
                      <button
                        onClick={fetchGalleryImages}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                        disabled={loadingGallery}
                      >
                        {loadingGallery ? (
                          <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                        ) : (
                          <FiRefreshCw size={16} />
                        )}
                        Refresh
                      </button>
                    </div>
                    
                    {loadingGallery ? (
                      <div className="text-center py-20">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                        <p className="text-gray-400">Loading gallery images...</p>
                      </div>
                    ) : galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((image) => (
                          <div key={image.id} className="group relative bg-gray-700 rounded-md overflow-hidden">
                            <div className="aspect-w-4 aspect-h-3 w-full">
                              <div className="relative h-48 w-full">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex flex-col justify-between p-3">
                              <div className="invisible group-hover:visible">
                                <span className="text-white text-xs px-2 py-1 bg-gray-800 rounded-md">{image.category}</span>
                              </div>
                              
                              <div className="invisible group-hover:visible flex justify-between items-center">
                                <span className="text-white text-sm truncate">{image.alt}</span>
                                
                                <button
                                  onClick={() => handleDeleteImage(image.id)}
                                  className="text-red-400 hover:text-red-300 bg-gray-800 rounded-full p-2"
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-600 rounded-lg">
                        <FiImage className="text-gray-500 mx-auto mb-2" size={32} />
                        <p className="text-gray-400">No gallery images found.</p>
                        <p className="text-gray-500 text-sm">Upload some images to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No content found. Try refreshing.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 