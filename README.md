# Akazi Hub

A cloud-first job board and talent marketplace SaaS.

## Product goals

- Build a production-grade platform for employers, candidates, recruiters, and platform administrators.
- Deliver at least 700 distinct, useful product capabilities across the platform. Features will be tracked in a versioned capability catalog and counted only when implemented and tested.
- Keep development and source management in GitHub. No local-PC downloads or browser-based VS Code workflow is required.

## Planned technology

- Web: Next.js, TypeScript, Tailwind CSS
- API: NestJS, TypeScript, REST API
- Data: PostgreSQL and Prisma
- Background work: Redis and BullMQ
- Payments: Stripe with an adapter for a regional payment provider
- Hosting: Vercel for the web app, Render for the API, managed PostgreSQL/Redis

## Engineering principles

- Secure-by-default authentication, authorization, tenant isolation, and audit trails.
- Payment-confirmed state transitions must be driven by verified, idempotent provider webhooks, never browser redirects.
- Private file storage, signed upload/download URLs, file validation, and malware scanning.
- Automated tests, migrations, CI checks, observability, and documented deployment configuration.
- Features are delivered in reviewed phases; roadmap items are not represented as completed functionality.

## Delivery roadmap

1. Repository foundation, workspace structure, linting, formatting, and CI.
2. Authentication, identity verification, workspaces, and role-based access control.
3. Employer company profiles and job lifecycle management.
4. Candidate profiles, resumes, discovery, and applications.
5. Billing, subscriptions, quotas, and payment-provider integrations.
6. Recruitment pipeline, communications, matching, and automation.
7. Administration, analytics, trust and safety, integrations, and advanced capabilities.

## Status

Repository initialization. Implementation status will be updated as features are added and verified.