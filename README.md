# Studio — landing site

The public marketing site, live at **https://cameracraft.in**.

Every word, number and image on it is edited from the admin panel
([admin-suraj-landing](https://github.com/maanu111/admin-suraj-landing)) and
appears here immediately. The two apps share one Supabase table and no code.

## How content works

`public.site_content` holds one row per section, the whole section as `jsonb`.
On every request `lib/get-content.ts` reads the table and merges it over the
bundled defaults in `lib/content.ts`, so a section that has never been saved —
or a field added after the last save — still renders.

There is **no caching anywhere**, deliberately. An earlier version used
`cacheComponents` and `"use cache"`, which prerendered the pages at build time
and served frozen content forever while local dev looked fine. Every fetch is
`cache: "no-store"` and every route is dynamic.

**`lib/content.ts` is duplicated in the admin repo. Keep the two in step** —
the admin builds its entire form UI from the `SECTIONS` array.

## Running it

```bash
npm install
npm run dev
```

Then http://localhost:3000.

`.env` needs exactly two variables, and nothing else belongs in it:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deployment — Hostinger

Hostinger's Node.js hosting (hPanel → Websites → Web Apps) builds from this
repo on push to `main`. Settings: Node 22, build `npm run build`, no entry
file — Hostinger starts Next's standalone server itself.

Both Supabase variables must exist in hPanel → Environment variables **before**
a build runs. `NEXT_PUBLIC_*` values are inlined into the browser bundle during
the build, so adding them afterwards silently ships a site that serves bundled
defaults instead of the database.

Two things about this repo exist only because of that platform:

- **`output: "standalone"`** in `next.config.ts`, because Hostinger starts the
  standalone server.
- **`next build --webpack`** in `package.json`. Hostinger's build container
  kills the Node subprocess Turbopack spawns to evaluate the PostCSS loader, so
  every Turbopack build dies on `app/globals.css` with
  `evaluate_webpack_loader failed / node process exited before we could connect
  to it`. webpack runs postcss-loader in process. Only the build moved;
  `next dev` still uses Turbopack.

## SEO

Canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph and the JSON-LD listing
all derive from one origin. On Vercel that came from
`VERCEL_PROJECT_PRODUCTION_URL`; **Hostinger has no equivalent**, so the origin
comes from the admin, SEO tab → **Canonical domain** (`https://cameracraft.in`).
If that field is blank the site falls back to `http://localhost:3000` and says
so loudly in the runtime logs.

`app/opengraph-image.tsx` generates the social card when no image is uploaded.

## Notable

- **The admin has no login.** RLS allows anonymous write and delete. This was
  asked for, explained, and confirmed. Hardened policies sit commented in the
  admin repo's `supabase/schema.sql` if that ever changes.
- The WhatsApp enquiry form opens a pre-filled `wa.me` message; nothing is sent
  until the visitor taps send. The number comes from the admin only.
- Sliders animate frame by frame rather than using `scroll-behavior: smooth`,
  because Chrome cancels native smooth scrolling on a scroll-snap container.
- Several components carry timeout fallbacks because hidden tabs suspend
  `requestAnimationFrame` and suppress scroll events.
- Team portraits and client reviews are still placeholders. Swap both before
  launch — the reviews section says so on the page.
