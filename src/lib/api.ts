import { BProgress } from '@bprogress/core';
import ky from 'ky';

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  throwHttpErrors: false, // we'll handle non-2xx manually
  retry: { limit: 0 }, // auto-retry on network errors
  timeout: 10_000, // 10s timeout
  hooks: {
    beforeRequest: [
      async (request, options) => {
        let token: string | undefined = undefined;

        if (typeof window === 'undefined') {
          // SSR: extract cookies from Next.js context
          const { auth } = await import('./auth');
          const session = await auth();
          token = session?.user?.idToken;
        } else {
          BProgress.start();
          // Client: fetch from Amplify auth
          const { getSession } = await import('next-auth/react');
          const session = await getSession();
          token = session?.user?.idToken;
        }
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (typeof window !== 'undefined') {
          BProgress.done();
        }
        return response;
      },
    ],
    beforeError: [
      (error) => {
        if (typeof window !== 'undefined') {
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
  console.log('Status:', response.status);
  // console.log('Headers:', [...response.headers.entries()]);

  //  Extract and log the parsed JSON body
  const data = await response.clone().json();
  console.log('Body:', data);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorBody}`);
  }
  return response.json<T>();
}
