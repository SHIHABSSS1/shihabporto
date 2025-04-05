import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiCode, FiMonitor, FiCamera, FiPenTool } from 'react-icons/fi';
import Image from 'next/image';
import { getSiteContent, defaultContent } from '@/models/content';

// Add export const revalidate = 0 to force page to check for updated content on each request
export const revalidate = 0;

export default async function AboutPage() {
  // Get content from MongoDB or fallback to default
  let content;
  try {
    content = await getSiteContent();
  } catch (error) {
    console.error('Error fetching content:', error);
    content = defaultContent;
  }
  
  const { about } = content;
  
  // Map icon string to component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FiCode':
        return <FiCode className="text-primary-600" size={32} />;
      case 'FiMonitor':
        return <FiMonitor className="text-secondary-600" size={32} />;
      case 'FiCamera':
        return <FiCamera className="text-primary-600" size={32} />;
      case 'FiPenTool':
        return <FiPenTool className="text-secondary-600" size={32} />;
      default:
        return <FiCode className="text-primary-600" size={32} />;
    }
  };
  
  return (
    <>
      <Header />
      <main>
        <section className="py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">{about.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {about.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start mb-16">
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <div className="w-full aspect-square">
                    <Image
                      src={about.profileImage}
                      alt="Shihab's Profile"
                      width={600}
                      height={600}
                      className="object-cover w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-2/3">
                <h2 className="text-3xl font-bold mb-6">{about.greeting}</h2>
                
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">My Skills & Expertise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {about.skills.map((skill, index) => (
                  <div key={index} className="card text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 ${index % 2 === 0 ? 'bg-primary-100 dark:bg-primary-900' : 'bg-secondary-100 dark:bg-secondary-900'} rounded-full`}>
                        {getIconComponent(skill.icon)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-center mb-12">My Journey</h2>
              
              <div className="space-y-12 max-w-3xl mx-auto">
                {about.journey.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {index < about.journey.length - 1 && (
                        <div className="w-1 flex-grow bg-primary-200 dark:bg-primary-800 mt-2"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.period}</h3>
                      <h4 className="text-lg text-primary-600 mb-2">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 