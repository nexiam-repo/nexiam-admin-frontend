import ClientComponent from './ClientComponent';
import PrefetchServer from './PrefetchServer';
export default async function TanStackPage() {
  return (
    <>
      <h2>Tanstack page</h2>
      <h2>Server Component</h2>
      <PrefetchServer />
      <h2>Tanstack Client</h2>
      <ClientComponent />
    </>
  );
}
// https://akhilaariyachandra.com/blog/refreshing-an-authentication-in-token-in-tanstack-query
// https://dev.to/builderio/safe-data-fetching-in-modern-javascript-dp4
