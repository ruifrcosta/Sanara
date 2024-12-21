import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sanara.com'),
  title: {
    default: 'Sanara - Sua Saúde em Primeiro Lugar',
    template: '%s | Sanara'
  },
  description: 'Plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família.',
  keywords: ['saúde familiar', 'telemedicina', 'farmácia online', 'seguros de saúde'],
  authors: [{ name: 'Sanara' }],
  creator: 'Sanara',
  publisher: 'Sanara',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://sanara.com',
    title: 'Sanara - Sua Saúde em Primeiro Lugar',
    description: 'Plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família.',
    siteName: 'Sanara'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanara - Sua Saúde em Primeiro Lugar',
    description: 'Plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família.',
    creator: '@sanara'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  usePageTracking();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
} 