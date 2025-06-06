import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@/lib/api';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export function usePosts() {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: () => fetcher<Post[]>('posts'),
  });
}

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export function useComments(postId: number) {
  return useQuery<Comment[], Error>({
    queryKey: ['comme', postId],
    queryFn: () => fetcher<Comment[]>(`posts/${postId}/comments`),
    enabled: Boolean(postId),
    staleTime: 0, // 2 minutes
  });
}
