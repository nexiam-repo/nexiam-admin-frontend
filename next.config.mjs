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
};

// Compose plugins: nextConfig → withPayload
export default withPayload(nextConfig);
