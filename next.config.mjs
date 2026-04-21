const root = new URL(".", import.meta.url).pathname;

import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				source: "/:path*", // Applies to all routes
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload", // 1 year, with subdomains and preload
					},
					// Add any other security headers here
				],
			},
		];
	},
	reactStrictMode: true,
	typedRoutes: true,
	turbopack: {
		root,
	},
	// Payload CMS pulls `ws`, `undici`, and `sharp` in at runtime (Postgres driver,
	// fetch, image processing). Next's default server bundling tree-shakes them
	// because nothing imports them statically → Lambda cold-start throws
	// MODULE_NOT_FOUND. Force-externalize and explicitly include ws+undici in
	// the output-file-tracing manifest.
	//
	// sharp is handled differently: OpenNext hardcodes sharp + @img in its
	// EXCLUDED_PACKAGES list (copyTracedFiles.js) so tracing-includes here
	// would be silently dropped. Instead, open-next.config.ts tells OpenNext
	// to `npm install sharp --arch=arm64` directly into the server bundle.
	serverExternalPackages: ["ws", "undici", "sharp"],
	outputFileTracingIncludes: {
		"*": ["node_modules/ws/**/*", "node_modules/undici/**/*"],
	},
	// Payload ships TS source with .cjs/.mjs extension aliases; without this
	// webpack can't resolve its internal imports during Next's server build.
	webpack: (webpackConfig) => {
		webpackConfig.resolve.extensionAlias = {
			".cjs": [".cts", ".cjs"],
			".js": [".ts", ".tsx", ".js", ".jsx"],
			".mjs": [".mts", ".mjs"],
		};
		return webpackConfig;
	},
};

// Compose plugins: nextConfig → withPayload.
// `devBundleServerPackages: false` stops Payload from re-bundling server deps
// during `next dev` (breaks HMR). Safe everywhere — no-op in prod.
export default withPayload(nextConfig, { devBundleServerPackages: false });
