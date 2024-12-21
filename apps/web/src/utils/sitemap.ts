interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemapXML = (urls: SitemapURL[]): string => {
  const xmlUrls = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlUrls}
</urlset>`;
};

export const getStaticPages = (): SitemapURL[] => [
  {
    loc: 'https://sanara.com',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    loc: 'https://sanara.com/telemedicina',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://sanara.com/farmacia',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: 'https://sanara.com/seguros',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://sanara.com/sobre',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://sanara.com/contato',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://sanara.com/blog',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    loc: 'https://sanara.com/ajuda',
    changefreq: 'weekly',
    priority: 0.6
  }
];

export const getDynamicPages = async (): Promise<SitemapURL[]> => {
  // Aqui você pode buscar páginas dinâmicas do seu CMS ou banco de dados
  // Por exemplo, posts do blog, produtos da farmácia, etc.
  return [];
};

export const generateSitemap = async (): Promise<string> => {
  const staticPages = getStaticPages();
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];

  return generateSitemapXML(allPages);
}; 