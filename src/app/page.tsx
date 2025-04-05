import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCode, FiImage, FiMail } from 'react-icons/fi';
import { 
  FaInstagram, 
  FaFacebook, 
  FaTelegram, 
  FaWhatsapp, 
  FaTiktok 
} from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/photo/replicate-prediction-fijg3fjbln65j4a2ovggxn4eu4.png"
                alt="Background"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>

          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slideUp">
              Welcome to Shihab's Portfolio
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-slideUp">
              A showcase of my creative work, projects, and professional journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade">
              <Link href="/portfolio" className="btn btn-primary">
                View My Work
              </Link>
              <Link href="/about" className="btn btn-outline flex items-center justify-center gap-2">
                About Me <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-gray-600 dark:text-gray-400">
                I'm a passionate creative professional specializing in web development, 
                design and visual storytelling. With a strong background in both technical 
                implementation and artistic expression, I create beautiful and functional 
                digital experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <div className="relative w-full aspect-square">
                    <Image 
                      src="/photo/Picsart_22-01-25_01-22-13-972.jpg"
                      alt="Shihab's Profile"
                      width={600}
                      height={600}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">My Story</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  With over 5 years of experience in web development and design, I've worked 
                  on a variety of projects ranging from small business websites to large 
                  enterprise applications. My approach combines technical expertise with an 
                  eye for design to create solutions that are both beautiful and functional.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                      <FiCode className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Web Development</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Specializing in modern frameworks and responsive design
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary-100 dark:bg-secondary-900 p-3 rounded-full">
                      <FiImage className="text-secondary-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Photography</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Capturing beautiful moments and creating visual stories
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href="/about" className="btn btn-outline flex items-center gap-2 w-fit">
                    Learn More <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Check out some of my recent projects and creative work
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card overflow-hidden group">
                <div className="relative h-60 mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src="/photo/IMG_20241008_125850_367.jpg"
                    alt="Project 1" 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">E-commerce Platform</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  A responsive online store built with Next.js and Tailwind CSS.
                </p>
                <Link 
                  href="/portfolio/project-1"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2 group"
                >
                  View Project 
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="card overflow-hidden group">
                <div className="relative h-60 mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src="/photo/2022-03-17-11-26-56-726.jpg"
                    alt="Project 2" 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Photography Portfolio</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  A minimalist gallery design to showcase photography work.
                </p>
                <Link 
                  href="/portfolio/project-2"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2 group"
                >
                  View Project 
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="card overflow-hidden group">
                <div className="relative h-60 mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src="/photo/IMG_0041-3.jpg"
                    alt="Project 3" 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Mobile Application</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  A React Native app for fitness tracking and health monitoring.
                </p>
                <Link 
                  href="/portfolio/project-3"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2 group"
                >
                  View Project 
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/portfolio" className="btn btn-primary">
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Social Media Connect Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Premium background with animated gradient */}
          <div className="absolute inset-0 bg-[#111827] z-0">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-70 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900"></div>
            
            {/* Premium pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundPosition: 'center'
            }}></div>
            
            {/* Radial glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Let's Connect</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto text-gray-200">
                  Follow me on social media to see my latest updates or reach out directly through these platforms
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transition-all">
                    <FaInstagram className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">Instagram</h3>
                  <p className="opacity-80 text-sm text-gray-300">Follow me</p>
                </a>
                
                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(37,99,235,0.5)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.7)] transition-all">
                    <FaFacebook className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">Facebook</h3>
                  <p className="opacity-80 text-sm text-gray-300">Connect with me</p>
                </a>
                
                {/* Telegram */}
                <a 
                  href="https://t.me/shihabuser" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all">
                    <FaTelegram className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">Telegram</h3>
                  <p className="opacity-80 text-sm text-gray-300">Chat with me</p>
                </a>
                
                {/* Signal */}
                <a 
                  href="https://signal.me/#p/+8801745368299" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(29,78,216,0.5)] group-hover:shadow-[0_0_25px_rgba(29,78,216,0.7)] transition-all">
                    <SiSignal className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">Signal</h3>
                  <p className="opacity-80 text-sm text-gray-300">Message securely</p>
                </a>
                
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/8801745368299" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-green-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] transition-all">
                    <FaWhatsapp className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">WhatsApp</h3>
                  <p className="opacity-80 text-sm text-gray-300">Chat anytime</p>
                </a>
                
                {/* TikTok */}
                <a 
                  href="https://tiktok.com/@shihab" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/5 group"
                >
                  <div className="bg-black p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(0,0,0,0.7)] transition-all">
                    <FaTiktok className="text-white text-3xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">TikTok</h3>
                  <p className="opacity-80 text-sm text-gray-300">Watch my videos</p>
                </a>
              </div>
              
              <div className="text-center mt-12">
                <p className="text-white text-opacity-90 mb-4 text-lg">
                  Prefer to chat directly? Click the button below!
                </p>
                <a 
                  href="https://wa.me/8801745368299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6 rounded-full font-bold text-lg hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] shadow-[0_0_15px_rgba(147,51,234,0.3)] text-white transition-all"
                >
                  <FaWhatsapp size={20} />
                  Message Me
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Have a project in mind or just want to connect? I'd love to hear from you!
                Reach out and let's start a conversation.
              </p>
              <Link href="/contact" className="btn btn-primary flex items-center gap-2 mx-auto w-fit">
                <FiMail />
                Contact Me
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const revalidate = 0; 