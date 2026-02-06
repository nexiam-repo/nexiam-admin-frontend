"use client";
import { useTodos } from "@/hooks/useTodos";

export default function PrefetchClient() {
	const { data: todos, isLoading, isError, error } = useTodos();

	if (isLoading) return <p>Loading todos…</p>;
	if (isError) return <p>Error: {error?.message}</p>;

	return (
		<ul>
			{todos?.map((todo) => (
				<li key={todo.id}>
					#{todo.id}: {todo.title} {todo.completed ? "✅" : "❌"}
				</li>
			))}
		</ul>
	);
}
