import type { Post } from "@/hooks/usePosts";
import { fetcher } from "@/lib/api";

export default async function ServerComponent() {
	const post = await fetcher<Post>(new URL("https://jsonplaceholder.typicode.com/posts/1"));
	console.log(`MockApiPage fetcher: ${JSON.stringify(post, null, 2)}`);
	return (
		<div>
			<div className="flex flex-col">
				<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
					{JSON.stringify(post, null, 2)}
				</pre>
			</div>
		</div>
	);
}

/* 
Why Fetch in CommentsServerComponent and Not in <Comments />
Server-Side Data Fetching

Fetching in the Server Component lets Next.js include the comments data in the initial HTML, improving perceived performance and SEO 
TanStack
.

Parallelism & Routing

If CommentsServerComponent were a parallel route, Next.js could fetch posts and comments in parallel rather than waterfalling (getPosts → then getComments) 
TanStack
.

Client Components Are Hydrated, Not Fetched

<Comments /> (a Client Component) runs after hydration and should read from the cache via useQuery. It should not perform heavy data fetching synchronously during its render, as that can block the client bundle and degrade UX 
DEV Community
.

Separation of Concerns

Server Components focus on data loading and composing UI statically; Client Components handle interactivity, state updates, and later refetches. Keeping fetch logic in the Server Component aligns with React’s component-side model  */
