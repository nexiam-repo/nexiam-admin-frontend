'use server';
import { signOut } from '@/lib/auth';
export async function signOutAction() {
  await signOut({ redirect: false });

  const cognitoDomain = process.env.COGNITO_DOMAIN; // e.g. https://auth.dev.nexiam.net
  const clientId = process.env.AUTH_COGNITO_ID;

  const logoutUri = process.env.AUTH_COGNITO_LOGOUT_URI!;

  const cognitoLogoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  console.log(cognitoLogoutUrl);
  return cognitoLogoutUrl;
}
// https://auth.dev.nexiam.net/logout?client_id=777s0h131g81ffpgp1vafq9sih&logout_uri=http%3A%2F%2Flocalhost%3A3000%2Fsign-in
// https://auth.dev.nexiam.net/login?response_type=code&client_id=777s0h131g81ffpgp1vafq9sih&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito&code_challenge=2lb4MNmoAz1Z0wEtYWB8StHpoRUHhEC13eMG8M3BBtU&code_challenge_method=S256&scope=openid+profile+email

// https://auth.dev.nexiam.net/login?client_id=777s0h131g81ffpgp1vafq9sih&logout_uri=https%3A%2F%2Fadmin.dev.nexiam.net%2Fsign-in
