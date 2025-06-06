import { NextRequest, NextResponse } from 'next/server';

import { signOutAction } from '@/app/actions/sign-out';
import { signIn } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  if (error === 'AccessDenied') {
    const logoutUrl = await signOutAction();
    return NextResponse.redirect(logoutUrl);
  }

  // if (error === "Configuration") {
  //   // Handle specific error if needed
  // }

  return signIn('cognito', { redirectTo: '/dashboard', redirect: true });
}
