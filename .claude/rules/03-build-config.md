# Build Configuration

## Prod builds: webpack, not Turbopack

- `package.json` → `"build": "next build --webpack"` (keep `dev` on Turbopack)
- **Why:** Payload disabled Turbopack prod builds in 3.65 (see payload issue #14786). Turbopack's `serverExternalPackages` can't externalize transitive deps and mangles externalized packages into hashed IDs (e.g. `sharp-20c6a5da84e2135f`) that fail `require()` at runtime on Lambda.
- Do **not** enable `withPayload({ experimentalTurbopackBuild: true })` — maintainers warn bundle grows ~25% and requires hand-curating `serverExternalPackages`.

## Lambda bundling for native/runtime deps

- Use `serverExternalPackages` + `outputFileTracingIncludes` in `next.config.mjs` for `ws` and `undici` (tree-shaken because Payload `require()`s them dynamically).
- **`sharp` must be installed via `open-next.config.ts`**, not traced. OpenNext's `copyTracedFiles.js` hardcodes `sharp` + `@img` in an `EXCLUDED_PACKAGES` list and strips them from every function except `image-optimization-function`. Tracing-includes for sharp are silently dropped.
- Payload imports sharp at runtime (image resizing, media processing) so the default server Lambda also needs it. Pattern:
  ```ts
  // open-next.config.ts
  export default {
    default: { install: { packages: ["sharp@<pin>"], arch: "arm64", os: "linux", libc: "glibc" } },
  } satisfies OpenNextConfig;
  ```
- Pin the sharp version to match `package.json` so build-time types and runtime agree.
