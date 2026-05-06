import { NextResponse } from 'next/server';
import { GLOSSARY_TERMS } from '@/lib/glossary';
import { STATIC_POSTS } from '@/lib/posts';

export const revalidate = 3600;

export async function GET() {
  const lines: string[] = [];

  lines.push('# sicherheit.ai — Vollständiger Inhalt');
  lines.push('');
  lines.push('> Maschinenlesbare Zusammenfassung aller Inhalte auf sicherheit.ai');
  lines.push(`> Generiert: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // ── Blog Posts ──
  lines.push('## Blog-Artikel');
  lines.push('');

  for (const post of STATIC_POSTS) {
    lines.push(`### ${post.title}`);
    lines.push('');
    lines.push(`**URL:** https://sicherheit.ai/de/blog/${post.slug}`);
    lines.push(`**Kategorie:** ${post.category}`);
    lines.push(`**Autor:** ${post.author}${post.authorRole ? ` (${post.authorRole})` : ''}`);
    lines.push(`**Datum:** ${post.publishedAt}`);
    lines.push(`**Lesezeit:** ${post.readTime} Minuten`);
    if (post.badge) lines.push(`**Einschätzung:** ${post.badge}`);
    lines.push('');
    lines.push(`**Zusammenfassung:** ${post.excerpt}`);
    lines.push('');
    if (post.tags.length) {
      lines.push(`**Schlagworte:** ${post.tags.join(', ')}`);
      lines.push('');
    }
    if (post.faqs?.length) {
      lines.push('**FAQ:**');
      for (const faq of post.faqs) {
        lines.push(`- **F:** ${faq.q}`);
        lines.push(`  **A:** ${faq.a}`);
      }
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  // ── Glossary ──
  lines.push('## Glossar — KI-Sicherheit & Cybersecurity');
  lines.push('');
  lines.push(`${GLOSSARY_TERMS.length} definierte Begriffe aus KI-Sicherheit, Cybersecurity und Datenschutz.`);
  lines.push('');

  // Group by category
  const byCategory: Record<string, typeof GLOSSARY_TERMS> = {};
  for (const t of GLOSSARY_TERMS) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }

  for (const [cat, terms] of Object.entries(byCategory)) {
    lines.push(`### Kategorie: ${cat}`);
    lines.push('');
    for (const t of terms) {
      const name = t.abbr ? `**${t.term}** (${t.abbr})` : `**${t.term}**`;
      lines.push(`#### ${name}`);
      lines.push('');
      lines.push(t.def);
      if (t.extended) {
        lines.push('');
        lines.push(t.extended);
      }
      if (t.related?.length) {
        lines.push('');
        lines.push(`Verwandte Begriffe: ${t.related.join(', ')}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*Quelle: sicherheit.ai — Deutschlands Plattform für KI-Sicherheit und Cybersecurity*');

  const markdown = lines.join('\n');

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
