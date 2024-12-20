import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
}

const SEO = ({
  title = 'Sanara - Sua Saúde em Primeiro Lugar',
  description = 'Sanara é uma plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família.',
  keywords = ['saúde familiar', 'telemedicina', 'farmácia online', 'seguros de saúde'],
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  canonical,
  structuredData,
  noindex = false
}: SEOProps) => {
  const fullTitle = `${title} | Sanara`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical || 'https://sanara.com'} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Sanara" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#006397" />

      {/* Language Meta Tags */}
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* PWA Meta Tags */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Sanara" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO; 