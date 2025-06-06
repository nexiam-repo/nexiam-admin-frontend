import NextAuth from 'next-auth';
import Cognito from 'next-auth/providers/cognito';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Cognito],
  callbacks: {
    async jwt({ account, token, profile }) {
      if (account) {
        // Only on login
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      if (profile) {
        token = {
          ...token,
          ...Object.fromEntries(
            Object.entries(profile).map(([k, v]) => [
              k,
              v === null ? undefined : v,
            ]),
          ),
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...Object.fromEntries(
          Object.entries(token).map(([k, v]) => [
            k,
            v === null ? undefined : v,
          ]),
        ),
        email: typeof token.email === 'string' ? token.email : '',
      };
      return session;
    },
    async signIn({ user, account, profile }) {
      // `profile` contains all Cognito attributes at signIn
      const groups = profile?.['cognito:groups'] ?? [];
      if (!Array.isArray(groups)) {
        // Not in any group - deny
        return false;
      }
      // Allow only admin or superadmin
      if (groups.includes('admin') || groups.includes('superadmin')) {
        return true;
      }
      // Otherwise deny
      return false;
    },
  },
});
