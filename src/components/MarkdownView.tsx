// Minimal Markdown renderer — intentionally tiny, no extra deps.
// Supports: headings (## ###), paragraphs, ordered/unordered lists,
// inline code, **bold**, *italic*, and fenced code blocks with a language hint.
import { useMemo } from 'react';

interface Props {
  source: string;
  className?: string;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s: string) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-slate-200/60 dark:bg-slate-700/50">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function render(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Fenced code
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(
        `<pre class="my-3 p-3 rounded bg-slate-900 text-slate-100 overflow-auto text-xs leading-relaxed"><code data-lang="${escapeHtml(lang)}">${escapeHtml(
          buf.join('\n'),
        )}</code></pre>`,
      );
      continue;
    }
    // Headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const sizes = ['', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];
      out.push(`<h${level} class="${sizes[level]} font-semibold mt-4 mb-2">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    // Unordered list
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*-\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ul class="list-disc pl-6 my-2 space-y-1">${items.join('')}</ul>`);
      continue;
    }
    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ol class="list-decimal pl-6 my-2 space-y-1">${items.join('')}</ol>`);
      continue;
    }
    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }
    // Paragraph (collect contiguous non-empty lines)
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|```|\s*-\s|\s*\d+\.\s)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p class="my-2 leading-relaxed">${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

export default function MarkdownView({ source, className }: Props) {
  const html = useMemo(() => render(source || ''), [source]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
