import type { CollectionConfig } from "payload";
import {
	canReadUsers,
	canUpdateUsers,
	isAuthenticated,
	isSuperAdminFieldLevel,
	isSuperAdminOrAdmin,
	isSuperAdminOrAdminCanDeleteEditors,
} from "@/access/roles";
import { assignFirstUserSuperAdmin } from "./hooks/assignFirstUserSuperAdmin";
import { validatePassword } from "./hooks/validatePassword";

export const Users: CollectionConfig = {
	slug: "users",
	auth: {
		// Override password field to add custom validation
		useAPIKey: false,
		maxLoginAttempts: 5, // Locks account after 5 failed tries
		lockTime: 600000, // 10 minutes lockout
	},
	admin: {
		defaultColumns: ["name", "email", "createdAt", "updatedAt"],
		useAsTitle: "email",
	},
	access: {
		// All authenticated users can access admin panel
		admin: isAuthenticated,
		// Only super-admins and admins can create users
		create: isSuperAdminOrAdmin,
		// Super-admins can delete anyone, admins can delete editors only
		delete: isSuperAdminOrAdminCanDeleteEditors,
		// Super-admins and admins can read all, editors can read only themselves
		read: canReadUsers,
		// Super-admins can update anyone, admins can update non-super-admins, editors can update only themselves
		update: canUpdateUsers,
	},
	hooks: {
		beforeValidate: [validatePassword],
		beforeChange: [assignFirstUserSuperAdmin],
	},
	fields: [
		{
			name: "name",
			type: "text",
		},
		{
			name: "roles",
			type: "select",
			hasMany: true,
			saveToJWT: true,
			defaultValue: ["editor"], // Default role for new users
			access: {
				create: isSuperAdminFieldLevel,
				update: isSuperAdminFieldLevel,
			},
			admin: {
				// Hide roles field when creating first user (no logged-in user)
				condition: (_data, _siblingData, { user }) => {
					return !!user; // Only show if user is logged in
				},
			},
			options: [
				{
					label: "Super Admin",
					value: "super-admin",
				},
				{
					label: "Admin",
					value: "admin",
				},
				{
					label: "Editor",
					value: "editor",
				},
			],
		},
	],
};
