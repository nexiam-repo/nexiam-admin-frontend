import { BProgress } from "@bprogress/core";
import ky from "ky";

let globalToken: string | null = null;
export const setGlobalAuthToken = (token: string | null) => {
	globalToken = token;
};

export const api = ky.create({
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	throwHttpErrors: false, // we'll handle non-2xx manually
	retry: { limit: 0 }, // auto-retry on network errors
	timeout: 10_000, // 10s timeout
	hooks: {
		beforeRequest: [
			async (request, _options) => {
				if (typeof window !== "undefined") {
					BProgress.start();

					// Add Authorization header if not present
					if (!request.headers.has("Authorization")) {
						let token = globalToken;
						// Fallback to cookie if globalToken is not set
						if (!token) {
							const match = document.cookie.match(/(^| )payload-token=([^;]+)/);
							token = match ? decodeURIComponent(match[2]) : null;
						}

						if (token) {
							request.headers.set("Authorization", `Bearer ${token}`);
						} else {
							console.warn("No payload-token found (global or cookie)");
						}
					}
				}
			},
		],
		afterResponse: [
			(_request, _options, response) => {
				if (typeof window !== "undefined") {
					BProgress.done();
				}
				return response;
			},
		],
		beforeError: [
			(error) => {
				if (typeof window !== "undefined") {
					BProgress.done();
				}
				return error;
			},
		],
	},
});

export async function fetcher<T>(
	path: string | URL,
	options: {
		method?: string;
		json?: unknown;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const response = await api(path, options);
	// Log status and headers if you need debugging info
	console.log("Status:", response.status);
	// console.log('Headers:', [...response.headers.entries()]);

	//  Extract and log the parsed JSON body
	const data = await response.clone().json();
	console.log("Body:", data);
	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`HTTP ${response.status}: ${errorBody}`);
	}
	return response.json<T>();
}
