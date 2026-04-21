# Build Configuration

## Prod builds: webpack, not Turbopack

- `package.json` → `"build": "next build --webpack"` (keep `dev` on Turbopack)
- **Why:** Payload disabled Turbopack prod builds in 3.65 (see payload issue #14786). Turbopack's `serverExternalPackages` can't externalize transitive deps and mangles externalized packages into hashed IDs (e.g. `sharp-20c6a5da84e2135f`) that fail `require()` at runtime on Lambda.
- Do **not** enable `withPayload({ experimentalTurbopackBuild: true })` — maintainers warn bundle grows ~25% and requires hand-curating `serverExternalPackages`.

## Lambda bundling for native/runtime deps

- Use `serverExternalPackages` + `outputFileTracingIncludes` in `next.config.mjs` for `ws` and `undici` (Payload `require()`s them dynamically so they'd otherwise tree-shake).
- **`sharp` must be installed via `open-next.config.ts`**, not traced. OpenNext's `copyTracedFiles.js` hardcodes `sharp` + `@img` in an `EXCLUDED_PACKAGES` list and strips them from every function except `image-optimization-function` — tracing-includes for sharp are silently dropped.
- Payload imports sharp at runtime (image resizing, media processing), so the default server Lambda needs it too. The working recipe:
  ```ts
  // open-next.config.ts
  export default {
    default: {
      install: {
        packages: ["sharp@<pin>"],           // pin to package.json version
        arch: "arm64",
        os: "linux",
        libc: "glibc",
        nodeVersion: "24",                    // match Lambda runtime
        additionalArgs: "--cpu=arm64 --include=optional",
      },
    },
  } satisfies OpenNextConfig;
  ```
- **`additionalArgs` is required, not optional.** OpenNext's installDeps emits `--arch=arm64`, which isn't a real npm flag — npm silently ignores it and filters optional deps by the runner's native CPU (x64), so `@img/sharp-linux-arm64` never lands in the bundle. sharp then throws `Could not load the "sharp" module using the linux-arm64 runtime` at cold start. The fix is `--cpu=arm64` (the real flag) plus `--include=optional` as a safety net.
