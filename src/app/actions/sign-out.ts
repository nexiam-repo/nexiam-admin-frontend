'use server';
import { signOut } from '@/lib/auth';
export async function signOutAction() {
  await signOut({ redirect: false });

  const cognitoDomain = process.env.COGNITO_DOMAIN; // e.g. https://auth.dev.nexiam.net
  const clientId = process.env.AUTH_COGNITO_ID;

  const logoutUri = process.env.AUTH_COGNITO_LOGOUT_URI!;

  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  return cognitoLogoutUrl;
}
