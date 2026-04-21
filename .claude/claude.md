# Nexiam Admin Frontend – Claude rules index

@.claude/rules/01-project-context.md
@.claude/rules/02-coding-standards.md

## Setup on a fresh machine

- `bun install`
- `bunx sst install` — generates `.sst/platform/config.d.ts` so `sst.config.ts` types resolve. Re-run after bumping the SST version.
- `cp .env.local.example .env.local` and fill in `DATABASE_URL`, `PAYLOAD_SECRET` from the dev Neon DB and `/common/PAYLOAD_SECRET` SSM parameter.
- `bun run generate:importmap` if Payload admin panel components change (commits `src/app/(payload)/admin/importMap.js`).
