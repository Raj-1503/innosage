# Innosage

The Innosage marketing site: a static [Astro](https://astro.build) build styled with [Tailwind CSS v4](https://tailwindcss.com), with [Keystatic](https://keystatic.com) as a local CMS. There is no database. Content lives in this repo as files.

## Commands

Run everything through [Bun](https://bun.sh).

| Command           | What it does                              |
| :---------------- | :---------------------------------------- |
| `bun install`     | Install dependencies                      |
| `bun run dev`     | Dev server at `http://127.0.0.1:4321`     |
| `bun run build`   | Static build into `dist/`                 |
| `bun run preview` | Preview the production build              |
| `bun run check`   | Type-check Astro and TypeScript files     |
| `bun run format`  | Format the code and sort Tailwind classes |

## Editing content

Start the dev server and open `http://127.0.0.1:4321/keystatic` to add or edit **Projects** and **Blogs**. Saving writes files you then commit:

- Entries: `src/content/projects/` and `src/content/blogs/`
- Images: `src/assets/projects/` and `src/assets/blogs/`
- Videos: `public/videos/projects/`

Keystatic only runs in development, so it is never part of the published site. Fixed page copy (services, team, testimonials, navigation) lives in `src/data/`.

## Project structure

```
src/
  components/   UI components
  content/      Keystatic entries, validated by content.config.ts
  data/         Fixed page copy and logos
  layouts/      Base.astro: document head, header, footer, cursor, grain
  lib/          Content queries and shared class maps
  pages/        Routes
  scripts/      Cursor, grain, reveal and testimonial pin
  styles/       global.css: Tailwind theme and base styles
```

## Styling conventions

- **Tokens live in `@theme`** in `src/styles/global.css`. Use them (`bg-navy`, `text-h3`, `rounded-card`, `tablet:`) rather than hard-coding values.
- **Style with utilities in the markup.** Don't use `@apply`. Repeated classes become a component, or a small variant map.
- **Write whole class names.** Tailwind only finds complete strings, so use a map such as `{ pale: 'bg-pill text-ink' }`, never `` `bg-${tone}` ``.
- **`@layer components` is the exception**, for what utilities can't reach: Markdoc-rendered HTML (`.case-study`, `.post-body`), script-toggled states (`.reveal`) and generated content (`.accordion`).
- **Breakpoints:** `tablet` 810px, `lap` 1100px, `desk` 1280px, `wide` 1440px, `nav` 1441px.

## Motion

- **Preloader and page transitions:** `PageCurtain.astro` and `src/scripts/curtain.ts`. The preloader plays once per browser session. An inline script in `Base.astro` covers the page before first paint, and everything is skipped for visitors who prefer reduced motion.
- **To replay the preloader:** run `sessionStorage.clear()` in the browser console and reload.
- **Works page:** thumbnail rows pick evenly spaced images from each case study automatically, so new projects need no extra setup.

## Browser support

Tailwind v4 sets the baseline: Safari 16.4+, Chrome 111+ and Firefox 128+. Videos are WebM only, so browsers without WebM support won't play them. The accordion opens without its height animation where `interpolate-size` isn't supported.

## Deployment

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`, at `https://raj-1503.github.io/innosage/`. That copy is marked `noindex`.

To launch on `innosage.in`: remove `BASE_PATH` and `PUBLIC_NOINDEX` from the workflow, set `SITE_URL` to the domain, and add the domain under the repo's Pages settings. In code, use `withBase()` from `src/lib/url.ts` for any new root-relative link so it works in both setups.

## Before deploying

- Set `PUBLIC_FORM_ENDPOINT` to a form service. Without it, the contact form opens the visitor's email app.
- `public/_redirects` holds 301s from the old WordPress URLs. It works on Cloudflare Pages and Netlify. GitHub Pages ignores it, so old URLs would return 404 there.
