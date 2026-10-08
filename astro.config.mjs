import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeChunks, rehypeBionic } from './src/lib/rehype-reading.mjs';

// Static site: `npm run build` writes plain HTML to dist/, which Vercel serves as-is.
export default defineConfig({
  markdown: {
    // The remark/rehype pipeline is needed for maths ($inline$ and $$display$$ are rendered to
    // HTML at build time with KaTeX) and for the reading aids: notes are split into one
    // <section class="chunk"> per "## concept", and word starts are wrapped for bionic reading.
    // Order matters: maths first, so the bionic pass can leave it alone.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeChunks, rehypeBionic],
    }),
    // Light + dark code themes; global.css picks one based on the site theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
});
