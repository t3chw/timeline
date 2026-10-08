# My Notes

A personal log of everything I study and build, shown as a day-by-day timeline. Static site built with
[Astro](https://astro.build), hosted on Vercel.

## Adding notes

**The easy way:** tell Claude what you learned (or drop files into `inbox/`) and say *"update"*. It
writes the notes, checks the site builds, and tells you what it added.

**By hand:**

```bash
npm run new -- "Python decorators" --subject Python --kind study --tags functions,closures --duration 45
```

That creates `src/content/entries/<today>-python-decorators.md` stamped with today's date and the current
time. Fill in the body (Markdown) and save. The full list of front-matter fields is in
[CLAUDE.md](CLAUDE.md#front-matter-reference).

## Reading and revising

Built to make notes easy to take in a little at a time:

- **Bionic reading** is on by default (toggle at the top of every note).
- A **dashed "concept done" line** separates each concept, and **focus mode** shows one concept at a time.
- Every study note ends with **Test yourself** questions: try to answer before you open them.
- **Revise** (`/revise`) schedules each note for review after 1, 3, 7, 14, 30, 60 and 120 days. Press
  "I revised this" at the end of a note. The header shows how many are due. Progress is saved in your
  browser only, so it does not sync between devices.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build -> dist/
```

Needs Node 22.12 or newer.

## Deploying to Vercel

1. Put the project on GitHub (create an empty repo, then `git init`, commit, add the remote, push).
2. On [vercel.com/new](https://vercel.com/new), import that repo. Vercel detects Astro on its own; leave
   the defaults (build command `npm run build`, output directory `dist`) and deploy.
3. From then on, every push to `main` rebuilds and redeploys the site, so new notes go live as soon as
   you push them.

## Customising

- Site name and tagline: `src/config.ts`
- Pin a subject to a colour: `subjectHues` in `src/config.ts`
- Look and feel: `src/styles/global.css` (layout, timeline) and `src/styles/prose.css` (note text)
