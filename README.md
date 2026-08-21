# VulcanForge UI

VulcanForge UI is a multilingual SaaS for authoring accessible, exportable and AI-ready design systems from one structured project.

## Requirements

- Node.js version defined in `.nvmrc`;
- npm;
- PostgreSQL for persistence-backed development flows;
- Docker Compose for the local PostgreSQL and Mailpit services.

## Local development

Create the local environment file, install dependencies and start PostgreSQL together with the local email inbox:

```bash
cp .env.example .env
npm ci
npm run dev:up
npm run db:migrate
```

Then start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:3000`. Mailpit captures local verification messages at `http://localhost:8025`; no external email provider is required for development.

Service helpers:

```bash
npm run dev:up
npm run dev:down
npm run db:up
npm run db:generate
npm run db:migrate
npm run mail:up
npm run mail:logs
```

## Authentication configuration

The authentication flow requires PostgreSQL persistence for users, workspaces and abuse-control buckets.

Production deployments must provide:

- `DATABASE_URL`;
- a high-entropy `AUTH_SECRET`;
- preferably a distinct high-entropy `AUTH_RATE_LIMIT_SECRET`.

Forwarded client-address headers are trusted automatically on Vercel. Self-hosted deployments must keep `AUTH_TRUST_PROXY_HEADERS=false` unless their reverse proxy strips spoofed forwarding headers and supplies a controlled value.

Authentication throttling fails closed by default. `AUTH_RATE_LIMIT_FAIL_OPEN=true` is an emergency operational override and must not remain enabled as normal configuration.

See:

- `.env.example`;
- `docs/product/ds-170-auth-01-foundations.md`;
- `docs/product/ds-170-auth-signup-signin-audit.md`.

## Quality checks

Run the complete preflight before opening or updating a pull request:

```bash
npm run quality
```

The quality command includes Prisma generation, linting, strict TypeScript checking, formatting verification, the UI-debt audit, tests and a production build.

The focused visual-debt guard can also be run independently:

```bash
npm run audit:ui
```

## UI foundations

The product uses the validated MVP foundations globally:

- **Fraunces** for rare editorial display levels;
- **Inter Tight** for application and marketing interface typography;
- **JetBrains Mono** for token paths, code-like values and technical metadata;
- the approved Stone, Clay, Ink, Moss, Amber and Rust palette;
- semantic light/dark roles instead of page-local colors.

The visual source of truth and implementation rules are documented under `docs/product/`.

## Product roadmap

The post-DS-170 product-completion sequence, including Learn, Components Workspace V2, targeted Theme extensibility, SEO/social reach and eventual release qualification, is documented in:

- `docs/product/ds-180-product-completion-roadmap.md`.

The roadmap is the continuity source of truth for the next phases and intentionally favors small, independently qualified iterations over broad feature rewrites.

## Stack

- Next.js App Router;
- React and TypeScript strict mode;
- Tailwind CSS;
- next-intl;
- Auth.js;
- Prisma and PostgreSQL;
- Vitest and Testing Library.

## Email verification

New accounts and changed email addresses receive a single-use verification link that expires after 30 minutes. Only a SHA-256 token fingerprint is stored in PostgreSQL.

Verification is intentionally non-blocking for the current workspace: an authenticated pending account can use the application and sees a persistent reminder with a resend action. Email ownership can later be required for selected sensitive or collaborative capabilities without making the core design-system editor unavailable.

Local development uses Mailpit by default. Start it with `npm run mail:up` and inspect captured messages at `http://localhost:8025`.

Production delivery uses the Resend HTTP API. Configure `AUTH_EMAIL_TRANSPORT=resend`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, and `AUTH_EMAIL_BASE_URL` from `.env.example`. The sending address must use a verified Resend domain, and the production base URL must use HTTPS.
