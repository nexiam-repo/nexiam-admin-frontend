"use client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";

import { logout } from "@/app/(frontend)/actions/logout";

export function SignOutMenuItem() {
	const handleSignOut = async () => {
		await logout();
	};

	return (
		<DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
			<LogOut className="mr-2 h-4 w-4" />
			Sign Out
		</DropdownMenuItem>
	);
}
