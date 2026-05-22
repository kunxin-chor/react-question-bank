// Matches scripts/build-questions.mjs hashId/slugify so client-side
// hashing of titles produces identical ids.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/^\d+[-_\s]*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hashId(s: string): string {
  let h = 5381n;
  for (const ch of s) h = ((h << 5n) + h + BigInt(ch.charCodeAt(0))) & 0xffffffffn;
  return h.toString(16).padStart(8, '0');
}

export function titleToId(title: string): string {
  return hashId(slugify(title));
}
