import type { APIRoute } from 'astro';
import { getNotes, plainText } from '../lib/notes';

// Note bodies as lower-cased plain text, fetched by the timeline the first time someone searches.
export const GET: APIRoute = async () => {
  const notes = await getNotes();
  const rows = notes.map((n) => ({ id: n.id, t: plainText(n.body ?? '', true).toLowerCase() }));
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};
