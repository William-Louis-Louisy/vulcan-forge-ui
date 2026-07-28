# VulcanForge UI

VulcanForge UI is a multilingual SaaS for authoring accessible, exportable and AI-ready design systems from one structured project.

## Requirements

- Node.js version defined in `.nvmrc`;
- npm;
- PostgreSQL for persistence-backed development flows.

## Local development

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

The application is then available at `http://localhost:3000`.

Database helpers:

```bash
npm run db:up
npm run db:generate
npm run db:migrate
```

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

## Stack

- Next.js App Router;
- React and TypeScript strict mode;
- Tailwind CSS;
- next-intl;
- NextAuth;
- Prisma and PostgreSQL;
- Vitest and Testing Library.
