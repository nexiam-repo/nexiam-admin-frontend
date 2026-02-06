"use client";
import { useEffect, useState } from "react";

import { fetcher } from "@/lib/api";
export type Post = {
	userId: number;
	id: number;
	title: string;
	body: string;
};
export default function ClientComponent() {
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchPosts() {
			try {
				const data = await fetcher<Post>(new URL("https://jsonplaceholder.typicode.com/posts/2"));
				if (isMounted) setPost(data);
			} catch (err: unknown) {
				if (isMounted) setError(err instanceof Error ? err.message : "Error fetching post");
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		fetchPosts();

		return () => {
			isMounted = false;
		};
	}, []);
	if (loading) return <p>Loading post…</p>;
	if (error) return <p>Error: {error}</p>;
	if (!post) return <p>No post found.</p>;
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
