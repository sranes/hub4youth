# Deploying hub4youth to Vercel

This app is a single Next.js + Payload CMS project. Locally it uses SQLite and disk
uploads; in production it uses **Postgres** and **Vercel Blob** (both auto-detected
from environment variables — no code changes needed to switch).

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- This project pushed to a Git repository (GitHub/GitLab/Bitbucket), **or** the Vercel
  CLI installed (`npm i -g vercel`) to deploy from your machine.

## 2. Create the Vercel project

Either:
- **Dashboard**: "Add New… → Project", import the repo. Vercel auto-detects Next.js.
- **CLI**: run `vercel` in this folder and follow the prompts (`vercel link`).

Do **not** deploy to production yet — set up the database, storage, and env vars first.

## 3. Provision a Postgres database

In your Vercel project → **Storage → Marketplace**, add a Postgres provider
(e.g. **Neon**). Vercel will inject a connection string env var. Copy its value into
`DATABASE_URL` (it must start with `postgres://` or `postgresql://` — that's what
flips the app from SQLite to Postgres).

The schema is created automatically on first boot (`push` is enabled). For stricter
control later, set `PAYLOAD_DB_PUSH=false` and use `npx payload migrate`.

## 4. Provision Vercel Blob (media uploads)

In **Storage**, add **Blob**. This sets `BLOB_READ_WRITE_TOKEN`. With it present, all
Media uploads go to Blob instead of the (ephemeral) serverless filesystem.

## 5. Set environment variables

In **Settings → Environment Variables**, add the following for **Production** (and
Preview if you want). See `.env.example` for the full list.

Required:
- `DATABASE_URL` — the Postgres string from step 3
- `PAYLOAD_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
- `NEXT_PUBLIC_SERVER_URL` — your production URL, e.g. `https://hub4youth.ai` (no trailing slash)
- `BLOB_READ_WRITE_TOKEN` — from step 4
- `CRON_SECRET`, `PREVIEW_SECRET` — random strings

Payments (add when ready — test keys first):
- Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `PAYMENT_PROVIDER` = `razorpay` | `stripe` | `auto`

Email (Resend):
- `RESEND_API_KEY`, `EMAIL_FROM` (a domain verified in Resend), `EMAIL_FROM_NAME`
- `ENQUIRY_NOTIFY_EMAIL` (optional, where staff alerts go)

## 6. Deploy

Trigger a production deployment (push to your main branch, or `vercel --prod`).
On first boot the database tables are created automatically.

## 7. Create your admin user

Visit `https://<your-domain>/admin` and create the first admin account (the local
SQLite admin user does **not** carry over to the production Postgres database).
Then add your real courses.

## 8. Register payment webhooks (after payments keys are set)

These need your public HTTPS URL, so they can only be configured post-deploy:
- **Stripe** dashboard → Developers → Webhooks → add endpoint
  `https://<your-domain>/payments/webhooks/stripe`, event `checkout.session.completed`.
  Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
- **Razorpay** dashboard → Settings → Webhooks → add
  `https://<your-domain>/payments/webhooks/razorpay`, events `payment.captured` /
  `order.paid`. Put the secret in `RAZORPAY_WEBHOOK_SECRET`.

## 9. Custom domain

**Settings → Domains** → add your domain and follow the DNS instructions. Then update
`NEXT_PUBLIC_SERVER_URL` to match and redeploy.

## Notes

- The local `hub4youth.db` SQLite file is git-ignored and is not used in production.
- Seeding (`scripts/seed.ts`) targets local SQLite; in production add content via `/admin`.
- Analytics (Vercel Analytics + Speed Insights) activate automatically on Vercel — no keys needed.
