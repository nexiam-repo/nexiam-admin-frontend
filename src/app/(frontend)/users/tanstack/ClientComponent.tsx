"use client";
import { useState } from "react";

import { useCreateTodo, useDeleteTodo, useTodos, useUpdateTodo } from "@/hooks/useTodos";

export default function ClientComponent() {
	// 1️⃣ Read all todos
	const {
		data: todos,
		isLoading: loadingTodos,
		isError: errorLoadingTodos,
		error: loadError,
	} = useTodos();

	// 2️⃣ Mutation hooks
	const createTodo = useCreateTodo();
	const updateTodo = useUpdateTodo();
	const deleteTodo = useDeleteTodo();

	// Local state for the new‐todo form
	const [newTitle, setNewTitle] = useState("");
	const [newCompleted, setNewCompleted] = useState(false);

	if (loadingTodos) return <p>Loading todos…</p>;
	if (errorLoadingTodos) return <p>Error loading todos: {loadError?.message}</p>;

	return (
		<div>
			<h1>My Todo List</h1>

			{/* Create form */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createTodo.mutate(
						{ title: newTitle, completed: newCompleted },
						{
							onSuccess: () => {
								setNewTitle("");
								setNewCompleted(false);
							},
						},
					);
				}}
			>
				<input
					type="text"
					placeholder="New todo title"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
				/>
				<label>
					<input
						type="checkbox"
						checked={newCompleted}
						onChange={(e) => setNewCompleted(e.target.checked)}
					/>
					Completed
				</label>
				<button type="submit" disabled={createTodo.isPending}>
					{createTodo.isPending ? "Creating…" : "Create Todo"}
				</button>
				{createTodo.isError && <p>Error creating: {createTodo.error?.message}</p>}
			</form>

			<hr />

			{/* Todo list */}
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id} style={{ marginBottom: "1em" }}>
						{/* Inline edit title */}
						<input
							type="text"
							value={todo.title}
							onChange={(e) => updateTodo.mutate({ ...todo, title: e.target.value })}
							disabled={updateTodo.isPending}
						/>
						{/* Toggle completed */}
						<label style={{ marginLeft: "0.5em" }}>
							<input
								type="checkbox"
								checked={todo.completed}
								onChange={() =>
									updateTodo.mutate({
										...todo,
										completed: !todo.completed,
									})
								}
								disabled={updateTodo.isPending}
							/>
							Done
						</label>
						{/* Delete button */}
						<button
							type="button"
							onClick={() => deleteTodo.mutate(todo.id)}
							disabled={deleteTodo.isPending}
							style={{ marginLeft: "0.5em" }}
						>
							{deleteTodo.isPending ? "Deleting…" : "Delete"}
						</button>

						{/* Error messages */}
						{updateTodo.isError && (
							<p style={{ color: "red" }}>Update error: {updateTodo.error?.message}</p>
						)}
						{deleteTodo.isError && (
							<p style={{ color: "red" }}>Delete error: {deleteTodo.error?.message}</p>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
