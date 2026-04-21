import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

/**
 * OpenNext config for nexiam-admin-frontend.
 *
 * Why this file exists:
 *   OpenNext's copyTracedFiles.js hardcodes `sharp` and `@img` in an
 *   EXCLUDED_PACKAGES list, so even with `outputFileTracingIncludes` in
 *   next.config.mjs the main server Lambda ships without sharp. OpenNext
 *   installs sharp only for the image-optimization-function by default.
 *
 *   Payload CMS imports sharp at runtime (image resizing, media collection
 *   processing). Without it the server Lambda throws `Cannot find module
 *   'sharp'` at cold start. Telling OpenNext to run its own installDeps
 *   against the default function drops sharp + the @img/sharp-linux-arm64
 *   optional dep straight into .open-next/server-functions/default/node_modules.
 *
 *   arch/libc/os mirror the Lambda target (Graviton glibc). Pinning the
 *   version keeps it in sync with package.json so we don't ship a sharp
 *   major-version mismatch between build-time type checks and runtime.
 */
const config = {
	default: {
		install: {
			packages: ["sharp@0.34.5"],
			arch: "arm64",
			os: "linux",
			libc: "glibc",
			// Lambda runtime is nodejs24 (see sst.config.ts) — keep --target in sync
			// so sharp's prebuilt binary selection matches.
			nodeVersion: "24",
			// OpenNext emits `--arch=arm64`, which isn't an official npm flag; npm
			// silently ignores it and falls back to the runner's native arch (x64)
			// for optional-dep filtering, dropping @img/sharp-linux-arm64.
			// `--cpu=arm64` is the documented flag, and `--include=optional` guards
			// against project-level `omit=optional` config bleeding in.
			additionalArgs: "--cpu=arm64 --include=optional",
		},
	},
} satisfies OpenNextConfig;

export default config;
