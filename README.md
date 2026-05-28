# Anita Prajapat — Official Artist Website

A premium, fully-dynamic devotional artist website + CMS for **Anita Prajapat**
(Rajasthani Devotional Singer). Built with the Next.js App Router, MongoDB,
NextAuth, Cloudinary, SCSS Modules and Framer Motion.

## Tech Stack

- **Next.js 16** (App Router, JavaScript only — no TypeScript)
- **MongoDB + Mongoose**
- **NextAuth (Auth.js v5)** — credentials auth, role-based, protected admin
- **Cloudinary** — image/video uploads
- **SCSS Modules** (7-1 architecture, no Tailwind)
- **Framer Motion** — page/scroll/hover animations
- Dynamic SEO: metadata, OG/Twitter, sitemap, robots, JSON-LD (Person,
  MusicGroup, VideoObject, BlogPosting, MusicEvent, Breadcrumb)

## Getting Started

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in values

# 3. Seed the database (creates admin user + sample content)
npm run seed

# 4. Run
npm run dev                  # http://localhost:3000
```

Admin login: **/admin/login** (credentials printed by `npm run seed`).

## Environment Variables

See `.env.example`. Required: `MONGODB_URI`, `AUTH_SECRET`. Cloudinary vars are
needed for uploads; without them you can still paste image URLs in the admin.

## Project Structure

```
app/
  (site)/            Public site (Navbar/Footer/floating CTAs layout)
    page.js          Home (all CMS sections)
    about, bhajans, events, gallery, media, blog, contact
  admin/
    login/           Public login (Suspense-wrapped)
    (panel)/         Protected dashboard + resource managers + settings
  api/               REST route handlers (CRUD, auth, upload, stats)
  sitemap.js, robots.js
components/           layout, home, cards, gallery, bhajan, contact, admin, ui, seo
context/             ThemeContext (dark mode)
hooks/               useDebounce
lib/                 db, auth(.config), cloudinary, apiHandler, crud, seo,
                     rateLimit, siteConfig, adminResources, serialize
models/              14 Mongoose models (+ MediaCoverage)
services/            content (RSC data access), apiClient (browser)
styles/              abstracts/ base/ themes/ + globals.scss + admin.scss
utils/               helpers (slug, youtube, pagination, dates)
proxy.js             Route protection for /admin (Next 16 "proxy" = middleware)
scripts/seed.mjs     Database seeder
```

## REST API

All under `/api`. List endpoints support `?page=&limit=&q=&category=&status=&sort=`.
Mutations (`POST/PUT/PATCH/DELETE`) require an authenticated admin session.

| Resource | Endpoints |
|---|---|
| bhajans, blogs, events, gallery, testimonials, quotes, banners, sponsors, categories, tags, media | `/<resource>` and `/<resource>/[id]` |
| contact | `POST` public (rate-limited), `GET`/`[id]` admin |
| settings | `GET` public, `PUT` admin (singleton) |
| upload | `POST`/`DELETE` admin (Cloudinary) |
| users | admin-only |
| admin/stats | dashboard analytics |

The CRUD layer is generated from a factory (`lib/crud.js`) — add a new resource by
creating a model and a 2-line route file.

## Admin CMS

`/admin` → dashboard, and config-driven managers (`lib/adminResources.js` +
`components/admin/ResourceManager.jsx`) for every content type, plus a Settings
page controlling branding, contact, social links, counters, theme colors and SEO.

## Notes

- Public content pages are `force-dynamic` and fail soft if the DB is offline.
- Dark mode is the cinematic default; toggle persists via `localStorage`.
- Replace the SVG placeholders in `/public` and add a real `og-default` image.
```
