import type { CollectionBeforeChangeHook } from "payload";

/**
 * Automatically assign super-admin role to the first user created.
 * This ensures that when the database is empty, the initial user
 * can access and manage the system.
 */
export const assignFirstUserSuperAdmin: CollectionBeforeChangeHook = async ({
	data,
	req,
	operation,
}) => {
	// Only run on user creation, not updates
	if (operation !== "create") {
		return data;
	}

	// Check if this is the first user (count existing users)
	const existingUsers = await req.payload.count({
		collection: "users",
	});

	// If no users exist, make this user a super-admin
	if (existingUsers.totalDocs === 0) {
		return {
			...data,
			roles: ["super-admin"],
		};
	}

	// Otherwise, keep the default behavior (editor role from defaultValue)
	return data;
};
