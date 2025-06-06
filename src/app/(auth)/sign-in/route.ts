import { signIn } from '@/lib/auth';

export async function GET() {
  //return signIn("cognito");// redirects to source page
  return signIn('cognito', { redirectTo: '/dashboard', redirect: true });
}
