# Build Configuration

## Prod builds: webpack, not Turbopack

- `package.json` → `"build": "next build --webpack"` (keep `dev` on Turbopack)
- **Why:** Payload disabled Turbopack prod builds in 3.65 (see payload issue #14786). Turbopack's `serverExternalPackages` can't externalize transitive deps and mangles externalized packages into hashed IDs (e.g. `sharp-20c6a5da84e2135f`) that fail `require()` at runtime on Lambda.
- Do **not** enable `withPayload({ experimentalTurbopackBuild: true })` — maintainers warn bundle grows ~25% and requires hand-curating `serverExternalPackages`.

## Lambda bundling for native/runtime deps

- Keep `serverExternalPackages` + `outputFileTracingIncludes` in `next.config.mjs` for `ws`, `undici`, `sharp`, `@img/*`.
- `sharp` ships platform-specific binaries via `@img/sharp-*` optional deps. CI runs x64 but Lambda is arm64 (Graviton), so `_deploy.yml` fetches the arm64 tarball directly (`npm view ... dist.tarball | curl | tar`) — `npm install --cpu=arm64` rejects cross-platform with EBADPLATFORM.
