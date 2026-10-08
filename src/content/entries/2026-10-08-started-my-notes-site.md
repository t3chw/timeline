---
title: Started my notes site
date: 2026-10-08
time: "12:10"
subject: Meta
kind: build
tags: [astro, vercel, setup]
summary: Set up one place for everything I study and build, with a dated timeline so I can see what I learned on any given day.
duration: 30
---

I wanted a single home for everything I'm learning and building, and a way to look back and see **what I did on which day**. This site is that.

## How it works

- Every note is one Markdown file in `src/content/entries/`.
- The `date` (and optional `time`) in the file decides where it lands on the timeline.
- The `subject` groups notes together and gives them a colour automatically.
- Push to GitHub and Vercel rebuilds the site.

## Adding a note

Either tell Claude what you learned and ask it to update the log, or create the file yourself:

```bash
npm run new -- "What I learned" --subject Python --tags functions,basics --duration 45
```

That creates a file pre-filled with today's date and the current time. Write the note below the `---` line and save.

## What a note looks like

```md
---
title: Python decorators
date: 2026-10-09
time: "18:30"
subject: Python
kind: study            # study | build | practice | read | idea
tags: [functions, closures]
summary: A decorator wraps a function to add behaviour without editing it.
duration: 45           # minutes, optional
---

Your notes go here, in regular Markdown.
```

> This first note is only an example. Delete or rewrite it whenever you like.
