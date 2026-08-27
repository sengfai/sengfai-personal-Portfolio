# MERSENGFAI Personal Portfolio

A dark editorial portfolio for MERSENGFAI, built with Next.js, TypeScript, React, and Cloudflare Vinext. It includes a password-protected content backoffice, D1 content storage, and R2 image uploads.

## Features

- Responsive portfolio inspired by an editorial poster layout
- Large MERSENGFAI hero identity and animated portrait presentation
- Editable hero, biography, services, process, projects, tools, and contact links
- Password-protected `/admin` backoffice
- Portrait and project image upload/replacement
- Cloudflare D1 database and R2 object storage
- Reduced-motion accessibility support

## Local development

Requirements:

- Node.js 22.13 or newer
- npm

```bash
npm install
npm run dev
```

The local development URL is shown in the terminal.

## Environment variables

Create a local `.env` file. Never commit it.

```env
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=generate-a-long-random-secret
```

The D1 database and R2 bucket use the bindings declared in `.openai/hosting.json`.

## Database

After changing `db/schema.ts`, generate a migration:

```bash
npm run db:generate
```

Migration files are stored in `drizzle/`.

## Production build

```bash
npm run build
npm run start
```

## Main folders

- `app/` — portfolio, backoffice, and API routes
- `lib/portfolio/` — content defaults, authentication, and database access
- `db/` — D1 database schema
- `drizzle/` — generated SQL migrations
- `public/` — static portfolio assets

## Live website

[mersengfai-portfolio.sengfai2016.chatgpt.site](https://mersengfai-portfolio.sengfai2016.chatgpt.site)
