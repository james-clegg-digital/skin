# NHS-style skin mole triage MVP

This Next.js (App Router) MVP lets patients upload skin mole photographs for clinicians to triage using NHS design system styling.

## Stack
- Next.js 14 + React 18 (App Router, server actions)
- TypeScript
- Prisma ORM with SQLite
- nhsuk-frontend for NHS Service Manual components

## Running locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy NHS frontend assets (v10+ now ships assets from `dist/nhsuk/assets`)
   ```bash
   npm run copy:nhs-assets
   ```
3. Set environment variables
   ```bash
   export DATABASE_URL="file:./dev.db"
   ```
4. Run database migrations and seed demo data
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. Start the dev server
   ```bash
   npm run dev
   ```

Clinician demo credentials: `clinician@example.com` / `password123`.

## NHS design system usage
The app imports `nhsuk-frontend` v10 global styles from `dist/nhsuk/nhsuk-frontend.min.css` (the legacy `packages/nhsuk-frontend/assets/nhsuk.css` path from v7 no longer exists). Assets are copied into `public/assets` using the `npm run copy:nhs-assets` helper.

NHS patterns in use include:
- Header, footer, skip link and layout container
- Buttons, form groups, inset text, warning callouts and panel components
- Summary list pattern on review page
- Tags for statuses and table patterns for queues
- Pagination controls styled to match NHS system spacing

## Key routes
- `/` landing with safety message
- `/start` start info
- `/patient/about-you` → `/patient/mole-details` → `/patient/upload-photos` → `/patient/review` → `/patient/confirmation`
- `/patient/submissions` history
- `/clinician/login` clinician auth
- `/clinician/queue` queue with filters and pagination
- `/clinician/submissions/:id` submission detail, outcomes, messages and status history

## Tests
Run `npm test` to execute Vitest unit tests for validation and status transition helpers.
