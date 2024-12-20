export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sanara',
  url: 'https://sanara.com',
  logo: 'https://sanara.com/images/logo.png',
  sameAs: [
    'https://facebook.com/sanara',
    'https://twitter.com/sanara',
    'https://instagram.com/sanara',
    'https://linkedin.com/company/sanara'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-1234-5678',
    contactType: 'customer service',
    areaServed: 'BR',
    availableLanguage: ['Portuguese', 'English']
  }
});

export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sanara',
  url: 'https://sanara.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://sanara.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
});

export const generateMedicalOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'Sanara',
  url: 'https://sanara.com',
  description: 'Plataforma completa de saúde que oferece telemedicina, farmácia online e seguros de saúde para toda a família.',
  medicalSpecialty: [
    'Telemedicina',
    'Farmácia Online',
    'Seguros de Saúde'
  ],
  availableService: [
    {
      '@type': 'MedicalService',
      name: 'Telemedicina',
      description: 'Consultas médicas online com profissionais qualificados'
    },
    {
      '@type': 'MedicalService',
      name: 'Farmácia Online',
      description: 'Medicamentos e produtos de saúde com entrega em todo o Brasil'
    },
    {
      '@type': 'MedicalService',
      name: 'Seguros de Saúde',
      description: 'Planos de saúde personalizados para você e sua família'
    }
  ]
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}); 