import type { Access, AccessArgs, FieldAccess, Where } from "payload";

import type { User } from "@/payload-types";

// Type for admin panel access (only returns boolean, not Where queries)
type AdminPanelAccess = (args: { req: AccessArgs<User>["req"] }) => boolean;

// Type guard to check if user is a regular User (not PayloadApiUser)
// PayloadApiUser doesn't have 'roles', so we check for that property
const isRegularUser = (user: unknown): user is User => {
	return user !== null && user !== undefined && "roles" in (user as object);
};

export const isSuperAdmin: Access<User> = ({ req: { user } }) => {
	return Boolean(isRegularUser(user) && user?.roles?.includes("super-admin"));
};

export const isSuperAdminOrAdmin: Access<User> = ({ req: { user } }) => {
	return Boolean(
		isRegularUser(user) && (user?.roles?.includes("super-admin") || user?.roles?.includes("admin")),
	);
};

// Admin panel access - only returns boolean (not Where queries)
export const isSuperAdminOrAdminAccess: AdminPanelAccess = ({ req: { user } }) => {
	return Boolean(
		isRegularUser(user) && (user?.roles?.includes("super-admin") || user?.roles?.includes("admin")),
	);
};

export const isEditor: Access<User> = ({ req: { user } }) => {
	return Boolean(isRegularUser(user) && user?.roles?.includes("editor"));
};

export const isSuperAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) => {
	return Boolean(isRegularUser(user) && user?.roles?.includes("super-admin"));
};

export const isSuperAdminOrAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) => {
	return Boolean(
		isRegularUser(user) && (user?.roles?.includes("super-admin") || user?.roles?.includes("admin")),
	);
};

// Prevent admins from updating super-admins
export const isSuperAdminOrAdminCannotUpdateSuperAdmin: Access<User> = ({ req: { user } }) => {
	if (!isRegularUser(user)) return false;

	// Super admins can update anyone
	if (user?.roles?.includes("super-admin")) {
		return true;
	}

	// Admins can only update non-super-admins
	if (user?.roles?.includes("admin")) {
		return {
			roles: {
				not_contains: "super-admin",
			},
		} as Where;
	}

	return false;
};

// Admins can only delete editors, super-admins can delete anyone
export const isSuperAdminOrAdminCanDeleteEditors: Access<User> = ({ req: { user } }) => {
	if (!isRegularUser(user)) return false;

	// Super admins can delete anyone
	if (user?.roles?.includes("super-admin")) {
		return true;
	}

	// Admins can only delete editors
	if (user?.roles?.includes("admin")) {
		return {
			roles: {
				contains: "editor",
			},
		} as Where;
	}

	return false;
};

// Allow all authenticated users to access admin panel
export const isAuthenticated: AdminPanelAccess = ({ req: { user } }) => {
	return !!user;
};

// Allow super-admins and admins to read all users, editors can only read themselves
export const canReadUsers: Access<User> = ({ req: { user } }) => {
	if (!isRegularUser(user)) return false;

	// Super admins and admins can read all users
	if (user?.roles?.includes("super-admin") || user?.roles?.includes("admin")) {
		return true;
	}

	// Editors can only read their own profile
	if (user?.roles?.includes("editor")) {
		return {
			id: {
				equals: user.id,
			},
		} as Where;
	}

	return false;
};

// Allow super-admins and admins to update their scope, editors can only update themselves
export const canUpdateUsers: Access<User> = ({ req: { user } }) => {
	if (!isRegularUser(user)) return false;

	// Super admins can update anyone
	if (user?.roles?.includes("super-admin")) {
		return true;
	}

	// Admins can only update non-super-admins
	if (user?.roles?.includes("admin")) {
		return {
			roles: {
				not_contains: "super-admin",
			},
		} as Where;
	}

	// Editors can only update their own profile
	if (user?.roles?.includes("editor")) {
		return {
			id: {
				equals: user.id,
			},
		} as Where;
	}

	return false;
};
