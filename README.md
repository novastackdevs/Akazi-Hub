# Akazi Hub

Akazi Hub is a cloud-first job board and talent marketplace for employers, candidates, recruiters, and platform administrators.

## Product commitment

The long-term target is at least 700 distinct platform capabilities. A capability counts as delivered only after implementation, integration, and automated verification. Roadmap entries are not counted as completed features.

## Monorepo

- `apps/web`: Next.js App Router frontend
- `apps/api`: NestJS REST API and Prisma data model
- `packages/shared`: shared TypeScript contracts

## Stack

- Node.js 22, npm workspaces, Turborepo
- Next.js 15, React 19, TypeScript
- NestJS 11, class-validator, Helmet, request throttling
- PostgreSQL, Prisma 6
- GitHub Actions CI
- Vercel (web) and Render (API/database blueprint)

## Implemented in this foundation phase

- Responsive public landing page and registration/login screens
- Employer registration creates a user, employer workspace, and owner membership in one database transaction
- Password hashing with bcrypt
- 15-minute access JWTs
- 30-day refresh JWTs stored as hashes in the database and delivered through an HttpOnly cookie
- Refresh-session rotation with an atomic database update to prevent concurrent reuse
- Logout revokes the refresh session
- DTO validation, Helmet headers, credentialed CORS, and global API rate limiting
- Liveness and database readiness endpoints
- Initial health-controller unit tests
- GitHub Actions typecheck, test, and build workflow

## Not yet production-complete

Email verification, password reset, MFA, full access-token guards and workspace-scoped authorization, candidate onboarding, employer job CRUD, applications, ATS, payments, provider webhooks, file scanning, admin operations, and the full 700+ capability catalogue remain future implementation phases. Do not use this foundation as a production recruitment service yet.

## Environment configuration

Copy the examples into deployment environment variables; do not commit secrets.

API variables (`apps/api/.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: independent random secret, at least 32 characters
- `JWT_REFRESH_SECRET`: a different independent random secret, at least 32 characters
- `WEB_ORIGIN`: exact frontend origin (comma-separated if multiple)
- `NODE_ENV`, `PORT`

Web variable (`apps/web/.env.example`):

- `NEXT_PUBLIC_API_URL`: API origin plus `/api/v1`

## Deploy online

### Render API and PostgreSQL

The root `render.yaml` defines the API service and managed PostgreSQL database. Create a new Blueprint in Render and connect this repository. Set `WEB_ORIGIN` to the deployed frontend origin. Run `npm run db:push --workspace @akazi-hub/api` as a release/one-time schema step for the initial prototype; introduce reviewed, versioned Prisma migrations before production releases.

### Vercel frontend

Import this repository into Vercel using the repository root as the project root. The root `vercel.json` configures the Next.js build. Set `NEXT_PUBLIC_API_URL` to the Render API URL ending in `/api/v1`.

The default refresh cookie is HttpOnly, Secure in production, and SameSite=Lax. Prefer frontend and API subdomains under the same registrable domain. If using unrelated Vercel/Render domains, cookie policy and CSRF protections must be deliberately configured before production use.

## Local development

1. Use Node.js 22 and npm 10.
2. Copy `apps/api/.env.example` to `apps/api/.env`; set a reachable PostgreSQL database and strong, distinct JWT secrets.
3. Copy `apps/web/.env.example` to `apps/web/.env.local`.
4. Run `npm install`.
5. Run `npm run db:generate --workspace @akazi-hub/api`.
6. Run `npm run db:push --workspace @akazi-hub/api`.
7. Run `npm run dev`.

## Quality checks

```bash
npm install
npm run db:generate --workspace @akazi-hub/api
npm run format:check
npm run typecheck
npm test
npm run build
```

CI runs the same generation, typecheck, test, and build steps. A passing workflow is required before a release is treated as verified.

## Security notes

- Never commit credentials or real environment files.
- Use HTTPS in production and rotate secrets if exposed.
- Access tokens are currently held in browser session storage in this first vertical slice; move to a hardened backend-for-frontend/session-cookie design before production.
- Add CSRF protection before enabling cross-site refresh-cookie deployment.
- Payment features must remain disabled until signed webhook verification, idempotency, and reconciliation are implemented and tested.
