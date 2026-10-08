import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Static site: `npm run build` writes plain HTML to dist/, which Vercel serves as-is.
export default defineConfig({
  markdown: {
    // The remark/rehype pipeline is needed for maths: $inline$ and $$display$$ are
    // rendered to HTML at build time with KaTeX.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    // Light + dark code themes; global.css picks one based on the site theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
});
