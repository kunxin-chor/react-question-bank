// Build script: walk ./questions, parse markdown, emit public/questions.json
// Question MD layout (single-file form):
//
// ---
// title: Hello World
// aliases: []          # optional: older titles whose hash should map here
// ---
// ## Requirements
// ...markdown...
// ## Files
// ```jsx file=App.jsx default
// ...code...
// ```
// ## Tests
// ```js
// ...test code...
// ```
// ## Solution
// ```jsx file=App.jsx
// ...code...
// ```
// ## Walkthrough
// 1. ...
//
// Folder form: directory containing question.md + files/ + tests/
// where files/ holds default starter files and tests/ holds *.test.js
//
// IDs are hash(slugify(title)) so reordering or renaming files never breaks
// saved solutions. Leading "NN-" in filenames only controls display order.

import { readFile, readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'questions');
const OUT = path.join(ROOT, 'public', 'questions.json');

// djb2 hash -> 8 hex chars. Stable, no deps, good enough for ids.
function hashId(s) {
  let h = 5381n;
  for (const ch of s) h = ((h << 5n) + h + BigInt(ch.charCodeAt(0))) & 0xffffffffn;
  return h.toString(16).padStart(8, '0');
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/^\d+[-_\s]*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function leadingOrder(name) {
  const m = name.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 9999;
}

function stripLeadingNumber(name) {
  return name.replace(/^\d+[-_\s]*/, '');
}

// Parse fenced code blocks with optional info-string metadata.
// Returns array of { lang, meta: {file?, default?}, code }.
function parseCodeBlocks(md) {
  const blocks = [];
  const re = /```([^\n]*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const info = m[1].trim();
    const code = m[2];
    const parts = info.split(/\s+/);
    const lang = parts.shift() || '';
    const meta = {};
    for (const p of parts) {
      if (p === 'default') meta.default = true;
      else if (p.startsWith('file=')) meta.file = p.slice(5).replace(/^["']|["']$/g, '');
      else meta[p] = true;
    }
    blocks.push({ lang, meta, code });
  }
  return blocks;
}

// Split markdown into top-level ## sections.
function splitSections(md) {
  const sections = {};
  const lines = md.split('\n');
  let current = '__preamble';
  let buf = [];
  const flush = () => {
    sections[current] = buf.join('\n').trim();
    buf = [];
  };
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      flush();
      current = m[1].trim().toLowerCase();
    } else {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

async function readQuestionMd(mdPath) {
  const raw = await readFile(mdPath, 'utf8');
  const { data: frontmatter, content } = matter(raw);
  const sections = splitSections(content);

  const requirements = sections['requirements'] || '';
  const walkthrough = sections['walkthrough'] || '';

  // Files
  const filesBlocks = parseCodeBlocks(sections['files'] || '');
  const files = {};
  let entry = null;
  for (const b of filesBlocks) {
    if (!b.meta.file) continue;
    files[b.meta.file] = b.code.replace(/\n$/, '');
    if (b.meta.default) entry = b.meta.file;
  }
  if (!entry && Object.keys(files).length) entry = Object.keys(files)[0];

  // Tests: take first js block in Tests section, or join all
  const testsBlocks = parseCodeBlocks(sections['tests'] || '');
  const tests = testsBlocks.map((b) => b.code.replace(/\n$/, '')).join('\n\n');

  // Solution files
  const solutionBlocks = parseCodeBlocks(sections['solution'] || '');
  const solution = {};
  for (const b of solutionBlocks) {
    const name = b.meta.file || entry || 'App.jsx';
    solution[name] = b.code.replace(/\n$/, '');
  }

  return { frontmatter, requirements, walkthrough, files, entry, tests, solution };
}

async function readQuestionFolder(dir) {
  // question.md plus optional files/ and tests/ siblings
  const mdPath = path.join(dir, 'question.md');
  const base = await readQuestionMd(mdPath);
  const filesDir = path.join(dir, 'files');
  if (existsSync(filesDir)) {
    for (const f of await readdir(filesDir)) {
      const code = await readFile(path.join(filesDir, f), 'utf8');
      base.files[f] = code.replace(/\n$/, '');
      if (!base.entry) base.entry = f;
    }
  }
  const testsDir = path.join(dir, 'tests');
  if (existsSync(testsDir)) {
    const parts = [];
    for (const f of await readdir(testsDir)) {
      parts.push(await readFile(path.join(testsDir, f), 'utf8'));
    }
    if (parts.length) base.tests = parts.join('\n\n');
  }
  const solutionDir = path.join(dir, 'solution');
  if (existsSync(solutionDir)) {
    for (const f of await readdir(solutionDir)) {
      const code = await readFile(path.join(solutionDir, f), 'utf8');
      base.solution[f] = code.replace(/\n$/, '');
    }
  }
  return base;
}

async function buildQuestion(entryName, fullPath) {
  const st = await stat(fullPath);
  const parsed = st.isDirectory()
    ? await readQuestionFolder(fullPath)
    : await readQuestionMd(fullPath);

  const title = parsed.frontmatter.title || stripLeadingNumber(entryName.replace(/\.md$/, ''));
  const id = hashId(slugify(title));
  const aliases = Array.isArray(parsed.frontmatter.aliases)
    ? parsed.frontmatter.aliases.map((a) => hashId(slugify(a)))
    : [];

  return {
    id,
    aliases,
    title,
    order: leadingOrder(entryName),
    requirements: parsed.requirements,
    walkthrough: parsed.walkthrough,
    files: parsed.files,
    entry: parsed.entry || 'App.jsx',
    tests: parsed.tests,
    solution: parsed.solution,
  };
}

async function buildCategory(name, dir) {
  const entries = await readdir(dir);
  const questions = [];
  for (const e of entries) {
    if (e.startsWith('.') || e.startsWith('_')) continue;
    const p = path.join(dir, e);
    const st = await stat(p);
    if (st.isDirectory() || e.endsWith('.md')) {
      try {
        questions.push(await buildQuestion(e, p));
      } catch (err) {
        console.error(`[questions] Failed to parse ${p}:`, err.message);
      }
    }
  }
  questions.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return {
    name: stripLeadingNumber(name),
    order: leadingOrder(name),
    questions,
  };
}

async function main() {
  if (!existsSync(QUESTIONS_DIR)) {
    console.warn(`[questions] No questions/ directory found at ${QUESTIONS_DIR}`);
  }
  const categories = [];
  const entries = existsSync(QUESTIONS_DIR) ? await readdir(QUESTIONS_DIR) : [];
  for (const e of entries) {
    if (e.startsWith('.') || e.startsWith('_')) continue;
    const p = path.join(QUESTIONS_DIR, e);
    const st = await stat(p);
    if (st.isDirectory()) categories.push(await buildCategory(e, p));
  }
  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ categories }, null, 2));
  const total = categories.reduce((n, c) => n + c.questions.length, 0);
  console.log(`[questions] Wrote ${total} question(s) across ${categories.length} categor(ies) -> ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
