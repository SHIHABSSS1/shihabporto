import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi';
import { getSiteContent, defaultContent } from '@/models/content';

// Add export const revalidate = 0 to force page to check for updated content on each request
export const revalidate = 0;

export default async function PortfolioPage() {
  // Get content from MongoDB or fallback to default
  let content;
  try {
    content = await getSiteContent();
  } catch (error) {
    console.error('Error fetching content:', error);
    content = defaultContent;
  }
  
  const { portfolio } = content;
  
  return (
    <>
      <Header />
      <main>
        <section className="py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">{portfolio.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {portfolio.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="card overflow-hidden group">
                  <div className="relative h-60 mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href={project.link}
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-2 group"
                    >
                      View Details
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    
                    <div className="flex gap-3">
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          aria-label="View on GitHub"
                        >
                          <FiGithub size={18} />
                        </a>
                      )}
                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          aria-label="Visit live site"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 