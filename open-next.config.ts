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
		},
	},
} satisfies OpenNextConfig;

export default config;
