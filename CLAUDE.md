# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

hub4youth is a marketing + lead-generation website for online IT courses, aimed at both students and working professionals. It is built on the **Payload CMS website template** (Payload 3 running inside Next.js 16 App Router). The public site showcases courses, captures enquiries, and supports online enrollment + payment. Course content is managed by non-technical staff through the Payload admin panel. Courses are delivered off-platform (Zoom/Classroom etc.) — the site sells and onboards.

## Commands

```bash
npm run dev               # Start Next.js dev server (http://localhost:3000, admin at /admin)
npm run build             # Production build (next build + next-sitemap)
npm run generate:types    # Regenerate src/payload-types.ts from the Payload config
npm run generate:importmap# Regenerate the admin import map (src/app/(payload)/admin/importMap.js)
npm run lint              # ESLint
npx tsc --noEmit          # Full TypeScript type check (faster correctness gate than a build)
npm run test:int          # Vitest integration tests
npm run test:e2e          # Playwright e2e tests (single test: npx playwright test <file> -g "<name>")
npx tsx scripts/seed.ts   # Seed admin user + sample courses (see Seeding gotchas below)
```

The project is git-initialized on `main`. There is no `vercel.json`/`vercel.ts` — Vercel auto-detects the Next.js app. See `DEPLOYMENT.md` for the full deploy runbook.

## Critical workflows

- **After changing any collection/global/field**, run `npm run generate:types` so `payload-types.ts` stays in sync — the typed local API and frontend depend on it.
- **After adding admin-custom React components** (field components, dashboard widgets), run `npm run generate:importmap`. A stale import map causes the `/admin` route to 500 with "export X doesn't exist" errors.
- The SQLite adapter uses **push mode in dev** — schema changes apply automatically on next init. Only one process may push at a time (see Seeding gotchas). After adding a collection, the first request following a restart can occasionally 500 with `index ... already exists` (a push race during concurrent route compilation) — just retry; the schema settles and subsequent requests succeed.

## Architecture

- **Single app, two route groups** under `src/app/`:
  - `(frontend)` — the public marketing site. The root layout swaps the template's CMS-driven Header/Footer for branded `SiteHeader`/`SiteFooter` (`src/components/site/`).
  - `(payload)` — the admin panel (`/admin`) and Payload REST/GraphQL API (`/api`). Do not hand-edit `importMap.js`; regenerate it.
- **Payload config**: `src/payload.config.ts` registers collections, globals, plugins, and the DB adapter. The **DB adapter is env-driven**: Postgres (`@payloadcms/db-postgres`) when `DATABASE_URL` starts with `postgres`, otherwise SQLite (`@payloadcms/db-sqlite`, file at `./hub4youth.db`) for local dev. Postgres `push` is on by default (toggle with `PAYLOAD_DB_PUSH=false`). **Media storage** is also env-driven: Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, otherwise local `public/media`. **Vercel Analytics + Speed Insights** are mounted in the frontend layout (no-op off-Vercel).
- **Collections** (`src/collections/`):
  - `Courses` — the core content type. Tabs for Overview (richtext), Curriculum (modules → lessons array, outcomes), and SEO. Sidebar holds price/currency/duration/level/mode/icon/`featured`/categories. `featured: true` surfaces a course on the homepage. Has draft/autosave versions and revalidate hooks.
  - `Enquiries` — contact/enquiry submissions. `create` access is `() => false`; rows are inserted only server-side via the contact server action with `overrideAccess: true`. Admin staff read/manage leads here.
  - `Enrollments` — paid-course orders. `create` access is `() => false`; rows are created/updated only server-side (checkout action + webhooks) with `overrideAccess: true`. Tracks customer, amount snapshot, provider, provider order/payment ids, and `status` (pending → paid/failed/refunded).
  - `Pages`, `Posts`, `Media`, `Categories`, `Users` come from the template.
- **Frontend course pages**: the homepage (`(frontend)/page.tsx`) and `/courses` query the `courses` collection directly via `getPayload`; `/courses/[slug]` renders detail with `generateStaticParams`. All use `force-static` + `revalidate`; course `afterChange`/`afterDelete` hooks call `revalidatePath` for `/`, `/courses`, and the course path.
- **Enquiry flow**: `(frontend)/contact/page.tsx` → client `EnquiryForm` (React `useActionState`) → `submitEnquiry` server action (`contact/actions.ts`) → `payload.create` into `enquiries`, then `sendEnquiryEmails` (confirmation to enquirer + optional staff notification).
- **Theming**: shadcn-style OKLCH CSS variables in `(frontend)/globals.css`. The brand color is a **placeholder purple** set on `--primary` (light + dark) — swap when real branding arrives. Course-card icons map a stored string to a lucide icon in `src/components/site/CourseIcon.tsx`.
- Reuse `@/components/RichText` (Lexical → JSX), `@/components/Media`, and `@/components/ui/*` (Button/Input/Label/Textarea) rather than re-implementing.

## Payments (Phase 2)

- **Provider-agnostic layer** in `src/payments/`: a `PaymentProvider` interface (`types.ts`) with `stripe.ts` and `razorpay.ts` implementations. Both SDK clients are **lazily initialized** — the app runs fine with no keys (checkout degrades to an "enquire to enroll" fallback). `index.ts` exposes `isPaymentEnabled()`, `resolveProviderName(currency)`, and `getPaymentProvider(currency)`.
- **Provider selection** via `PAYMENT_PROVIDER` env: `razorpay`, `stripe`, or `auto` (INR → Razorpay, else Stripe, with fallbacks to whatever has keys).
- **Flow**: course Enroll button → `/enroll?course=<slug>` → client `CheckoutForm` → `createCheckout` server action (`enroll/actions.ts`). The action loads the course server-side (price/currency are **never trusted from the client**), creates a `pending` enrollment, then calls the provider. Stripe returns a hosted-redirect URL; Razorpay returns order details for the client-side modal (`checkout.razorpay.com/v1/checkout.js`). Free courses (price ≤ 0) skip payment and are marked paid immediately. Returns to `/enroll/success` or `/enroll/cancelled`.
- **Webhooks** (signature-verified, mark enrollment paid idempotently via `recordPayment.ts`):
  - Stripe → `POST /payments/webhooks/stripe` (`checkout.session.completed`), needs `STRIPE_WEBHOOK_SECRET`.
  - Razorpay → `POST /payments/webhooks/razorpay` (`payment.captured` / `order.paid`), needs `RAZORPAY_WEBHOOK_SECRET`.
  - These live at `src/app/payments/webhooks/*` (top-level, **not** under `/api`) to avoid the Payload `/api/[...slug]` catch-all.
- On payment confirmation, `recordPayment.ts` sends an enrollment confirmation via the email layer below.
- See `.env.example` for all payment env vars (including `NEXT_PUBLIC_RAZORPAY_KEY_ID` for the browser modal).

## Email (Phase 3)

- **Resend adapter** is wired into `payload.config.ts` **only when `RESEND_API_KEY` is set**; otherwise Payload logs emails to the console (so local dev and CI work with no key). From address/name come from `EMAIL_FROM` / `EMAIL_FROM_NAME`.
- **Send helpers** live in `src/email/index.ts`: `sendEnquiryEmails` and `sendEnrollmentConfirmation`. Each sends a branded HTML confirmation to the customer and, if `ENQUIRY_NOTIFY_EMAIL` is set, a notification to staff. All sends go through `payload.sendEmail` wrapped in a `safeSend` try/catch so a mail failure never breaks the request.
- Called from `contact/actions.ts` (enquiry) and `payments/recordPayment.ts` (paid enrollment).

## Version / template gotchas

- The template was pulled from Payload's monorepo `main` (via `degit`), so it was **ahead of the latest published release**. All `@payloadcms/*` packages are pinned to **3.85.1**, and code using unreleased APIs was removed:
  - The `folders` admin feature (`createFolderField`, the inline `folders` collection) was stripped from `Media.ts` and the config — it does not exist in 3.85.1.
  - `RichText/index.tsx` uses `DefaultNodeTypes` (3.85.1) instead of the newer `WithDefaultNodes`.
  - If you bump Payload versions, re-check these and rerun `generate:types` + `generate:importmap`.

## Seeding gotchas (`scripts/seed.ts`)

- The script loads env itself via `import 'dotenv/config'` **before** importing `@payload-config` (the config reads `PAYLOAD_SECRET` at import time).
- **Stop the dev server before seeding** — two processes pushing schema to the same SQLite file collide ("index ... already exists").
- `payload.create` for courses passes `context: { disableRevalidate: true }` — the revalidate hooks call Next's `revalidatePath`, which throws outside a request context.
- The script is idempotent (checks by slug / existing users).
