import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetcher } from '@/lib/api';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Fetch all todos
export function useTodos() {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: () => fetcher<Todo[]>('todos'),
  });
}

// Fetch a single todo by ID
export function useTodo(todoId: number, enabled = true) {
  return useQuery<Todo, Error>({
    queryKey: ['todos', todoId],
    queryFn: () => fetcher<Todo>(`todos/${todoId}`),
    enabled: enabled && !!todoId, // Useful to avoid errors or unnecessary requests when prerequisite data (like an ID or auth token) isn’t available
  });
}

// Create a new todo

export function useCreateTodo() {
  const qc = useQueryClient();
  // When creating a new todo via a POST request, the server typically assigns the id. By omitting id,
  // your mutation function’s input type
  // only requires the title and completed fields—preventing you from accidentally passing an id
  return useMutation<Todo, Error, Omit<Todo, 'id'>>({
    mutationFn: (newTodo) =>
      fetcher<Todo>('todos', {
        method: 'POST',
        json: newTodo,
      }),
    onSuccess: () => {
      //Marks any cached queries whose key matches ['todos'] as stale, causing active hooks to refetch in the background
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// Update (replace) a todo
export function useUpdateTodo() {
  const qc = useQueryClient();

  return useMutation<Todo, Error, Todo>({
    // 1️⃣ Define your mutation function here
    mutationFn: (todo) =>
      fetcher<Todo>(`todos/${todo.id}`, {
        method: 'PUT',
        json: { title: todo.title, completed: todo.completed },
      }),

    // 2️⃣ Invalidate queries in onSuccess
    onSuccess: (_data, todo) => {
      // Invalidate the list…
      // Invalidate the list (['todos']) if you have any components showing the whole todo list
      //  (e.g. your index or sidebar) so they’ll refetch the updated array.
      qc.invalidateQueries({ queryKey: ['todos'] });
      // …and the specific todo
      // Invalidate the individual todo (['todos', todo.id])
      // if you’ve got a detail view or form that’s still mounted for that one item and you want it to stay in sync.
      qc.invalidateQueries({ queryKey: ['todos', todo.id] });
    },
  });
}

// Delete a todo
export function useDeleteTodo() {
  const qc = useQueryClient();

  return useMutation<{ id: number; deleted: boolean }, Error, number>({
    // 1️⃣ mutation function under `mutationFn`
    mutationFn: (id: number) =>
      fetcher<{ id: number; deleted: boolean }>(`todos/${id}`, {
        method: 'DELETE',
      }),

    // 2️⃣ Invalidate the todos list on success
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// staleTime: 5 * 60_000,  - data stays “fresh” for 5m
// gcTime: 30 * 60_000,    - unused data kept for 30m
// retry: 1,               - retry once on failure
