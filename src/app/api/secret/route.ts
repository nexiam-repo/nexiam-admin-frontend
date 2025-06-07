import { secret } from '@aws-amplify/backend';

export async function GET() {
  // Fetch the secret securely
  const mySecret = await secret('MY_SECRET');

  return new Response(`Secret value is: ${mySecret}`); // Don't return secrets in real life!
}
