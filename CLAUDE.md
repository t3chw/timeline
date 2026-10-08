# My Notes: personal learning log

This repo is the user's running record of **everything they study and build**. It is a static
[Astro](https://astro.build) site, deployed on Vercel. Every note is one Markdown file with a date
(and optional time), and the site turns those files into:

- `/` a day-by-day **timeline** (year > month > day) with a stats strip, a one-year activity heatmap,
  and search / subject filters
- `/subjects` and `/subjects/<subject>` notes grouped by subject
- `/notes/<file-name>` the full note, with reading aids (below)
- `/revise` notes due for spaced revision, plus a due-count badge in the header and a banner on `/`

The user adds material, then tells you to "update" (or "log this", "add this to my notes", ...).
**Doing that update is your main job in this repo.**

## The update workflow

1. **Get the time.** Run `date +"%Y-%m-%d %H:%M"` (the user is in IST). Use it for `date` and `time`
   unless they say otherwise ("yesterday", "on Monday", "at 6pm"); work those out from `date`.
2. **Gather the material.** It can be (a) what they just told you in chat, (b) pasted text, or
   (c) files in `inbox/` (read `.md`/`.txt`/PDF/images with the Read tool). Ignore `inbox/_processed/`
   and `inbox/README.md`.
3. **Reuse subject names.** List existing ones first so notes group together instead of splitting
   ("Python" vs "python3"):
   `grep -h -m1 '^subject:' src/content/entries/*.md | sort | uniq -c | sort -rn`
   (`-m1` takes only the front-matter line, not examples inside code blocks)
4. **Write the notes.** One file per distinct topic, even within a single day. Several things learned
   in one sitting become several notes, each with its own `time` or the same one. Do not merge unrelated
   topics into one note. File name: `src/content/entries/YYYY-MM-DD-short-slug.md`
   (`npm run new -- "Title" --subject X` scaffolds the front matter if useful).
5. **Handle attachments.** Images or PDFs that belong to a note go in `public/files/<note-file-name>/`
   and are referenced as `![alt](/files/<note-file-name>/pic.png)`. Move processed inbox files to
   `inbox/_processed/`. **Never delete the user's originals.**
6. **Verify.** Run `npm run build`. A bad front-matter value fails the build with a clear message; fix
   it. A broken build means a broken Vercel deploy.
7. **Report briefly:** which notes you created (file, subject, date), anything you inferred (subject,
   time, duration) that they may want to correct. **Do not commit, push or deploy unless asked.**

## Writing good notes

- **The user has ADHD and cannot read a lot in one go. Write notes in small pieces.** One idea per
  `##` section (the site draws a dashed "concept done" line between sections and has a focus mode that
  shows one section at a time, so section boundaries matter). Aim for sections of roughly 120 words or
  fewer: a one-line statement first, then short bullets or a small example. Short paragraphs, **bold**
  the key terms, no walls of text. If a pasted source is long, split it into more `##` sections rather
  than long ones. Use `###` only for a sub-step inside a concept.
- **End every study note with a `## Test yourself` section** of 3 to 6 recall questions, answered from
  the note's own content (see the template below). Re-reading is weak revision; recalling is strong.
  Skip it only for notes that are not study material (e.g. a project log).
- Keep the user's own ideas and voice. You may organise them, add headings, fix wording, and add a short
  worked example or explanation where it makes the note more useful, but **never invent things the user
  did** (projects, hours, results). If something they said is technically wrong, correct it in the note
  and mention that in your reply.
- Always fill `summary` with one or two sentences; it is the text shown on the timeline card.
- Use `##` headings to structure longer notes (3+ headings produce an "On this page" sidebar).
  Fenced code blocks need a language (` ```python `) for highlighting.
- **Maths:** write inline maths as `$x^2$` and display maths as a `$$ ... $$` block (KaTeX syntax, so
  `\boxed`, `\begin{bmatrix}` etc. work). If the user pastes LaTeX with `\( ... \)` or `\[ ... \]`,
  convert those to `$ ... $` and `$$ ... $$`; the site only understands the dollar forms.
- Add `links` for sources the user mentions (courses, docs, videos).
- Add `duration` (minutes) only if the user gave a time or it is clear; never guess.
- Keep `tags` short, lower-case, and few (2 to 5).
- Never rewrite or delete existing notes unless asked. Typo fixes are fine.

### "Test yourself" template

Click-to-reveal questions. Keep the `<summary>` line plain text (unicode like λ, Σ, ∩, ² is fine; no
`$...$` maths there, since it is raw HTML), and leave a blank line before the answer, which is normal
Markdown and may use maths:

```md
## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>Why can't mutually exclusive events with positive probability be independent?</summary>

$P(A\cap B)=0$, but independence would need $P(A)P(B)>0$. Contradiction.

</details>
```

## Reading aids and revision (already built, do not break)

- **Bionic reading** is on by default with a toggle on every note. At build time
  `src/lib/rehype-reading.mjs` wraps the start of each word in `<b class="bn">`; CSS
  (`html[data-bionic]`) decides whether it looks bold. Code, maths, headings and bold text are skipped.
- **Concept sections:** the same file wraps each `##` in `<section class="chunk">`. CSS draws the dashed
  line with a "concept done" label between them. **Focus mode** (toggle on every note) shows one section at
  a time with Back/Next, arrow keys, and a "Finish" that jumps to the revision card.
- **Spaced revision** (`src/lib/revision.ts`): a note is due the day after it is written, then after 3, 7,
  14, 30, 60 and 120 days. "I revised this" advances it, "Need to revisit" resets it to tomorrow. The
  state is in the reader's `localStorage` (key `reviews`), so it is per browser and does not sync between
  devices. `/revise` lists what is due; the header badge and home banner show the count. Every page embeds
  a small `#notes-data` JSON (id, title, subject, hue, date) that these features read.
- Preferences saved in `localStorage`: `theme`, `bionic`, `focus`, `reviews`.
- Because notes are wrapped and bionic-ised at build time, plugin order in `astro.config.mjs` matters:
  KaTeX first, then chunks, then bionic.

## Front matter reference

```yaml
---
title: Python decorators            # required
date: 2026-10-08                    # required, YYYY-MM-DD, the day it belongs to
time: "14:30"                       # optional, 24h, keep the quotes
subject: Python                     # required, reuse existing names exactly
kind: study                         # study | build | practice | read | idea   (default: study)
tags: [functions, closures]         # optional
summary: One or two sentences.      # strongly recommended
duration: 45                        # optional, minutes spent
links:                              # optional
  - title: Real Python guide
    url: https://realpython.com/primer-on-python-decorators/
draft: false                        # true = visible in `npm run dev`, left out of the deployed site
---
```

`kind` meanings: `study` learned something, `build` made or shipped something, `practice` exercises and
problems, `read` book/article/paper, `idea` something to explore later.

## Project layout

```
src/content/entries/   the notes (Markdown), the only thing that changes day to day
src/content.config.ts  front-matter schema (add fields here)
src/config.ts          site title/tagline, optional pinned subject colours
src/lib/notes.ts       grouping, stats, heatmap, formatting helpers
src/lib/revision.ts    spaced-revision schedule + localStorage (browser only)
src/lib/rehype-reading.mjs  build-time plugins: concept sections + bionic reading
src/pages/             index (timeline), subjects/, notes/, revise, search-index.json
src/components/        Timeline, EntryCard, Heatmap, Header, ...
src/styles/            global.css (layout + timeline), prose.css (note typography)
inbox/                 drop zone for raw material (see inbox/README.md)
public/files/          images and PDFs referenced by notes
scripts/new-note.mjs   `npm run new` scaffold
```

Notes about the code:

- `date` is a plain calendar day stored as UTC midnight; always format with `timeZone: 'UTC'`
  (the helpers in `src/lib/notes.ts` do this).
- Subject colours are assigned automatically, spread evenly in order of first appearance. Pin one in
  `src/config.ts` (`subjectHues`) if the user wants a specific colour.
- Files in `src/content/entries/` starting with `_` are ignored.
- Dark and light themes are handled with CSS variables in `global.css`; keep both in mind when changing
  styles. Check the timeline at ~375px wide as well as desktop.

## Commands

```bash
npm run dev      # local site at http://localhost:4321 (drafts included)
npm run build    # production build into dist/, run this after every update
npm run preview  # serve the built site
npm run new -- "Title" --subject Python --kind study --tags a,b --duration 45
```

## Deployment

Hosted on Vercel. It auto-detects Astro (build `npm run build`, output `dist`), so no extra config is
needed. Once the repo is connected to Vercel through Git, every push to the main branch redeploys the
site, which is how new notes go live. Do not change this setup without asking.
