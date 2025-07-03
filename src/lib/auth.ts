import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authenticateUser } from '@/lib/cognito';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await authenticateUser(
            credentials.email as string,
            credentials.password as string,
          );

          if (user) {
            return {
              id: user.attributes?.sub,
              name: user.username,
              email: user.attributes?.email || '',
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
              idToken: user.idToken,
              groups: user.groups ?? [],
              attributes: user.attributes,
            };
          }
          return null;
        } catch (error: any) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.idToken = user.idToken;
        token.groups = user.groups;
        token.attributes = user.attributes;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.idToken = token.idToken as string;
      session.groups = token.groups as string[];
      if (token.attributes) {
        session.user.attributes = token.attributes as Record<string, string>;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
});

//     async signIn({ user, account, profile }) {
//       // `profile` contains all Cognito attributes at signIn
//       const groups = profile?.['cognito:groups'] ?? [];
//       if (!Array.isArray(groups)) {
//         // Not in any group - deny
//         return false;
//       }
//       // Allow only admin or superadmin
//       if (groups.includes('admin') || groups.includes('superadmin')) {
//         return true;
//       }
//       // Otherwise deny
//       return false;
//     },
