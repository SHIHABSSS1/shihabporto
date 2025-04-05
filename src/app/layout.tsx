import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FloatingMessageButton from '@/components/FloatingMessageButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Shihab | Portfolio',
  description: 'Personal portfolio website showcasing my work and skills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        {children}
        <FloatingMessageButton />
      </body>
    </html>
  );
} 