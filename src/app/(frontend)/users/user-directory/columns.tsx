"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type UserProfile = {
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
};

export type UserListItem = {
	id: string;
	email: string;
	phone_number: string | null;
	account_type: string;
	status: string;
	created_at: string;
	updated_at: string;
	last_login_at: string | null;
	profile: UserProfile | null;
};

export const columns: ColumnDef<UserListItem>[] = [
	{
		accessorKey: "profile.first_name", // Simplify for now, maybe combine names later
		header: "Name",
		cell: ({ row }) => {
			const profile = row.original.profile;
			const firstName = profile?.first_name || "";
			const lastName = profile?.last_name || "";
			const email = row.original.email;
			if (!firstName && !lastName) return email.split("@")[0]; // Fallback to email ref
			return `${firstName} ${lastName}`.trim();
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "account_type",
		header: "Type",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "last_login_at",
		header: "Last Login",
		cell: ({ row }) => {
			const date = row.getValue("last_login_at") as string;
			if (!date) return "-";
			return new Date(date).toLocaleDateString();
		},
	},
];
