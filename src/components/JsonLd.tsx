interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Schema builders ──────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'sicherheit.ai',
    url: 'https://sicherheit.ai',
    logo: 'https://sicherheit.ai/logo.png',
    description: 'Deutschlands führende Plattform für KI-Sicherheit und Cybersecurity.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['German', 'English'],
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'sicherheit.ai',
    url: 'https://sicherheit.ai',
    description: 'Deutschlands führende Plattform für KI-Sicherheit und Cybersecurity.',
    inLanguage: ['de', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://sicherheit.ai/api/glossar-search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema({
  title,
  description,
  author,
  publishedAt,
  slug,
  tags,
}: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  slug: string;
  tags: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Person', name: author },
    datePublished: publishedAt,
    dateModified: publishedAt,
    keywords: tags.join(', '),
    url: `https://sicherheit.ai/de/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'sicherheit.ai',
      url: 'https://sicherheit.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sicherheit.ai/logo.png',
      },
    },
    image: {
      '@type': 'ImageObject',
      url: `https://sicherheit.ai/api/og?title=${encodeURIComponent(title)}`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sicherheit.ai/de/blog/${slug}`,
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function definedTermSetSchema(
  terms: { term: string; abbr?: string; def: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'KI-Sicherheit & Cybersecurity Glossar',
    url: 'https://sicherheit.ai/de/glossar',
    hasDefinedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.abbr ? `${t.term} (${t.abbr})` : t.term,
      description: t.def,
      inDefinedTermSet: 'https://sicherheit.ai/de/glossar',
    })),
  };
}
