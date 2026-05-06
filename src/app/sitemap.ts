import { MetadataRoute } from 'next';
import { STATIC_POSTS } from '@/lib/posts';
import { GLOSSARY_TERMS } from '@/lib/glossary';

const BASE_URL = 'https://sicherheit.ai';
const LOCALES = ['de', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = LOCALES.flatMap(locale => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/glossar`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/tools`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  const blogPages = LOCALES.flatMap(locale =>
    STATIC_POSTS.map(post => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // One entry per glossary term (anchor links)
  const glossarPages = LOCALES.flatMap(locale =>
    GLOSSARY_TERMS.map(term => ({
      url: `${BASE_URL}/${locale}/glossar#term-${term.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...blogPages, ...glossarPages];
}
