"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { columns, type UserListItem } from "./columns";
import { DataTable } from "./data-table";

interface UserListResponse {
	users: UserListItem[];
	total: number;
	limit: number;
	offset: number;
}

export default function UserDirectoryPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			return api
				.get("users", {
					searchParams: {
						limit: 100,
						offset: 0,
					},
				})
				.json<UserListResponse>();
		},
	});

	if (isLoading) {
		return <div className="p-10">Loading users...</div>;
	}

	if (error) {
		return (
			<div className="p-10 text-red-500">
				Error loading users: {error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-5">User Directory</h1>
			<DataTable columns={columns} data={data?.users || []} />
		</div>
	);
}
