import ClientComponent from './ClientComponent';
import ServerComponent from './ServerComponent';

export default async function MockApiPage() {
  return (
    <>
      <h2>MockApiPage page</h2>
      <h2>Server Component</h2>
      <ServerComponent />
      <h2>Client Component</h2>
      <ClientComponent />
    </>
  );
}
