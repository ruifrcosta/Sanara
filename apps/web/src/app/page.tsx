import React from 'react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import Features from '@/components/home/Features';
import Clients from '@/components/home/Clients';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/home/Footer';
import SEO from '@/components/seo/SEO';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateMedicalOrganizationSchema
} from '@/utils/schema';

export default function HomePage() {
  const structuredData = {
    organization: generateOrganizationSchema(),
    website: generateWebSiteSchema(),
    medical: generateMedicalOrganizationSchema()
  };

  return (
    <>
      <SEO
        title="Sanara - Sua Saúde em Primeiro Lugar"
        description="Plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família. Cuide da sua saúde com praticidade e segurança."
        keywords={[
          'saúde familiar',
          'telemedicina',
          'farmácia online',
          'seguros de saúde',
          'consulta médica online',
          'medicamentos online',
          'plano de saúde',
          'saúde digital'
        ]}
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Benefits />
        <Features />
        <Clients />
        <FAQ />
        <Footer />
      </main>
    </>
  );
} 