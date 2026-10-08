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
