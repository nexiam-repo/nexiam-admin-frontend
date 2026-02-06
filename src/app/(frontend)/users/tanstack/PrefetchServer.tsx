import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import type { Todo } from "@/hooks/useTodos";
import { fetcher } from "@/lib/api";

import PrefetchClient from "./PrefetchClient";

export default async function PrefetchServer() {
	// 1) Create a fresh QueryClient per request
	const queryClient = new QueryClient();

	// 2) Prefetch the 'todos' query using the same key & fn as useTodos()

	await queryClient.prefetchQuery({
		queryKey: ["todos"],
		queryFn: () => fetcher<Todo[]>("todos"),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PrefetchClient />
		</HydrationBoundary>
	);
}
