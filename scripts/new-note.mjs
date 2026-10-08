#!/usr/bin/env node
// Create a new note pre-filled with today's date and the current time.
//   npm run new -- "Python decorators" --subject Python --kind study --tags functions,closures --duration 45
import { existsSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const KINDS = ['study', 'build', 'practice', 'read', 'idea'];

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    subject: { type: 'string', short: 's', default: 'General' },
    kind: { type: 'string', short: 'k', default: 'study' },
    tags: { type: 'string', short: 't', default: '' },
    duration: { type: 'string', short: 'd' },
    summary: { type: 'string' },
    date: { type: 'string', description: 'YYYY-MM-DD (default: today)' },
    time: { type: 'string', description: 'HH:MM (default: now)' },
  },
});

const title = positionals.join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Title" [--subject Python] [--kind study] [--tags a,b] [--duration 45]');
  process.exit(1);
}
if (!KINDS.includes(values.kind)) {
  console.error(`--kind must be one of: ${KINDS.join(', ')}`);
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = values.date ?? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const time = values.time ?? `${pad(now.getHours())}:${pad(now.getMinutes())}`;

const slug =
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'note';

let file = `src/content/entries/${date}-${slug}.md`;
for (let i = 2; existsSync(file); i++) file = `src/content/entries/${date}-${slug}-${i}.md`;

const q = (s) => JSON.stringify(s); // JSON strings are valid YAML strings
const tags = values.tags.split(',').map((t) => t.trim()).filter(Boolean);
const lines = [
  '---',
  `title: ${q(title)}`,
  `date: ${date}`,
  `time: "${time}"`,
  `subject: ${q(values.subject)}`,
  `kind: ${values.kind}`,
  `tags: [${tags.map(q).join(', ')}]`,
  `summary: ${q(values.summary ?? '')}`,
];
if (values.duration) lines.push(`duration: ${Number(values.duration)}`);
lines.push('---', '', 'Write your note here.', '');

writeFileSync(file, lines.join('\n'));
console.log(`Created ${file}`);
