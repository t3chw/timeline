// Build-time Markdown plugins that make notes easier to read in small pieces.
//
//  rehypeChunks  wraps every "## concept" (and the text before the first one) in
//                <section class="chunk">, so CSS can draw a dashed "finished" line between
//                concepts and the focus mode can show one concept at a time.
//  rehypeBionic  wraps the start of each word in <b class="bn">. The bold is switched on/off
//                with CSS (html[data-bionic]), so the toggle needs no JavaScript work.

// ------------------------------------------------------------------ chunks

const isElement = (node, tag) => node.type === 'element' && node.tagName === tag;
const isBlankText = (node) => node.type === 'text' && !node.value.trim();

export function rehypeChunks() {
  return (tree) => {
    const chunks = [];
    let current = null;

    for (const node of tree.children) {
      if (isBlankText(node) && !current) continue;
      if (!current || isElement(node, 'h2')) {
        current = {
          type: 'element',
          tagName: 'section',
          properties: { className: ['chunk'] },
          children: [],
        };
        chunks.push(current);
      }
      current.children.push(node);
    }

    // The first chunk is visible before any JavaScript runs (focus mode starts there).
    if (chunks.length) chunks[0].properties.className.push('is-current');
    tree.children = chunks;
  };
}

// ------------------------------------------------------------------ bionic reading

// Never touch these: code, maths, headings (already bold), table headers, already-bold text.
const SKIP_TAGS = new Set([
  'pre', 'code', 'kbd', 'script', 'style', 'svg', 'input', 'textarea',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'th', 'strong', 'b',
]);

const WORD = /\p{L}[\p{L}\p{M}'’]*/gu;

const classNames = (node) => {
  const c = node.properties?.className;
  return Array.isArray(c) ? c.map(String) : typeof c === 'string' ? c.split(/\s+/) : [];
};

const skip = (node) => SKIP_TAGS.has(node.tagName) || classNames(node).some((c) => c.startsWith('katex'));

/** "Reading" -> [<b>Rea</b>, "ding"] */
function bionicize(text) {
  const out = [];
  let last = 0;
  for (const match of text.matchAll(WORD)) {
    const letters = Array.from(match[0]);
    const bold = Math.max(1, Math.ceil(letters.length * 0.45));
    if (match.index > last) out.push({ type: 'text', value: text.slice(last, match.index) });
    out.push({
      type: 'element',
      tagName: 'b',
      properties: { className: ['bn'] },
      children: [{ type: 'text', value: letters.slice(0, bold).join('') }],
    });
    if (letters.length > bold) out.push({ type: 'text', value: letters.slice(bold).join('') });
    last = match.index + match[0].length;
  }
  if (last === 0) return [{ type: 'text', value: text }];
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function walk(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      next.push(...bionicize(child.value));
    } else {
      if (child.type === 'element' && !skip(child)) walk(child);
      else if (child.type === 'root') walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export function rehypeBionic() {
  return (tree) => walk(tree);
}
