'use server';

import { signIn } from '@/lib/auth';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // signIn can throw, so wrap in try/catch!
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // result can have { error, ok, url }
    if (result?.error) {
      return { error: result.error };
    }
    return { success: true, url: result?.url };
  } catch (err: any) {
    // This is for actual thrown errors, such as Cognito errors
    // You may want to check for err.message etc.
    return { error: err.cause.err.message || 'An unknown error occurred' };
  }
}
