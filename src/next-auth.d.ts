// // eslint-disable-next-line unused-imports/no-unused-imports
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    groups?: string[];
    user: {
      id: string;
      attributes?: Record<string, string>;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    groups?: string[];
    attributes?: Record<string, string>;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    groups?: string[];
  }
}
