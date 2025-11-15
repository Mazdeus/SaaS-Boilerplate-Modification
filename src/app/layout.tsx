import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import PageTransition from '@/components/PageTransition';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const rexton = localFont({
  src: '../../public/font/rexton-black.otf',
  variable: '--font-rexton',
  display: 'swap',
  weight: '900',
});

export const metadata: Metadata = {
  title: 'Brodo - Authentic Indonesian Footwear',
  description: 'Discover Brodo, the premier Indonesian footwear brand crafting authentic, high-quality shoes that blend traditional craftsmanship with modern design.',
  keywords: 'brodo, footwear, shoes, indonesian brand, authentic, handcrafted',
  authors: [{ name: 'Brodo' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brodo.co.id',
    siteName: 'Brodo',
    title: 'Brodo - Authentic Indonesian Footwear',
    description: 'Discover Brodo, the premier Indonesian footwear brand crafting authentic, high-quality shoes.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${rexton.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Toaster position="top-right" />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
