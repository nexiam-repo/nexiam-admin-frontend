// eslint-disable-next-line unused-imports/no-unused-imports
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    // Add any other Cognito attributes here
    [key: string]: any;
  }
  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    // Add any other Cognito attributes here
    [key: string]: any;
  }
}
