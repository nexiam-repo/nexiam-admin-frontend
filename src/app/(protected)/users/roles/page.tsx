import { secret } from '@aws-amplify/backend';

import ClientComponent from './ClientComponent';
import ServerComponent from './ServerComponent';

export default async function MockApiPage() {
  const mySecret = await secret('MY_SECRET');

  return (
    <>
      <div>
        <strong>Server secret:</strong> {String(mySecret)}
      </div>
      <h2>MockApiPage page</h2>
      <h2>Server Component</h2>
      <ServerComponent />
      <h2>Client Component</h2>
      <ClientComponent />
    </>
  );
}
