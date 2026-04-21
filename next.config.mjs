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
	// Payload CMS pulls `ws` and `undici` in at runtime (Postgres driver + fetch).
	// Next's default server bundling tree-shakes them because nothing imports them
	// statically → Lambda cold-start throws MODULE_NOT_FOUND. Force-externalize and
	// explicitly include them in the output-file-tracing manifest.
	serverExternalPackages: ["ws", "undici"],
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
