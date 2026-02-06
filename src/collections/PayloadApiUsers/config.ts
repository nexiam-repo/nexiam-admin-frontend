import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/access/roles";

export const PayloadApiUsers: CollectionConfig = {
	slug: "payload-api-users",
	auth: {
		// Enable API key authentication only (no password login)
		useAPIKey: true,
		// Disable email/password authentication for API users
		disableLocalStrategy: true,
		// No login attempts limit needed since there's no password login
		tokenExpiration: 31536000, // 1 year token expiration
	},
	admin: {
		defaultColumns: ["name", "email", "enableAPIKey", "createdAt"],
		useAsTitle: "email",
		description:
			"API-only users for Payload CMS external integrations (e.g., landing page accessing blog posts)",
	},
	access: {
		// Only super admins can access the admin panel for this collection
		admin: ({ req: { user } }) => {
			// Type guard: Only Users collection has roles
			if (!user || user.collection !== "users") return false;
			return Boolean(user.roles?.includes("super-admin"));
		},
		// Only super admins can create Payload API users
		create: isSuperAdmin,
		// API users can read data (for landing page, etc.)
		// Note: This allows API key holders to read their own user data
		read: ({ req: { user } }) => {
			if (!user) return false;

			// Type guard: Check if this is a User (not PayloadApiUser)
			if (user.collection === "users" && user.roles?.includes("super-admin")) {
				return true;
			}

			// API users can only read themselves
			return {
				id: {
					equals: user.id,
				},
			};
		},
		// No one can update API users except super admins
		update: isSuperAdmin,
		// Only super admins can delete API users
		delete: isSuperAdmin,
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			admin: {
				description:
					"Descriptive name for this Payload API user (e.g., 'Landing Page - Blog Reader')",
			},
		},
		{
			name: "description",
			type: "textarea",
			admin: {
				description:
					"Purpose of this API user and where it's being used in the Payload CMS ecosystem",
			},
		},
		{
			name: "allowedOrigins",
			type: "array",
			admin: {
				description: "Allowed origins/domains for CORS (optional)",
			},
			fields: [
				{
					name: "origin",
					type: "text",
					required: true,
				},
			],
		},
	],
};
