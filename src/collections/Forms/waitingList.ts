import type { CollectionConfig } from "payload";
import { isSuperAdminOrAdmin, isSuperAdminOrAdminFieldLevel } from "@/access/roles";
import { createSupportNotificationHook } from "./hooks/sendSupportNotification";
import { sendWaitingListEmail } from "./hooks/sendWaitingListEmail";

export const WaitingList: CollectionConfig = {
	slug: "waiting-list",
	hooks: {
		afterChange: [sendWaitingListEmail, createSupportNotificationHook("Waiting List Form")],
	},
	labels: {
		singular: "Form - Waiting List",
		plural: "Form - Waiting List",
	},
	admin: {
		useAsTitle: "email",
		defaultColumns: ["email", "status", "createdAt"],
		description: "Waiting list form submissions from the landing page",
		group: "Landing Page",
	},
	access: {
		// Authenticated users (admins) can read all submissions
		read: ({ req: { user } }) => !!user,

		// Authenticated users (admins) can update submissions
		update: ({ req: { user } }) => !!user,

		// Only super admin or admin can delete submissions
		delete: isSuperAdminOrAdmin,

		// Allow API key OR admin to create submissions
		// This enables your landing page to submit via API key
		create: ({ req: { user } }) => {
			// Allow if user is logged in (admin) OR if using API key
			if (user) return true;

			// API key authentication is handled by PayloadCMS automatically
			// when useAPIKey: true is set on the Users collection
			return true;
		},
	},
	fields: [
		{
			name: "fullName",
			type: "text",
			required: false,
			label: "Full Name",
			admin: {
				description: "Optional name of the user",
			},
		},
		{
			name: "email",
			type: "email",
			required: true,
			label: "Email Address",
			unique: true, // Database-level constraint for duplicate prevention
			validate: async (value: string | null | undefined, { req, operation }) => {
				if (!value || value.trim().length < 5) {
					return "Email is required";
				}
				if (value.length > 100) {
					return "Email must be less than 100 characters";
				}
				// Basic email validation
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) {
					return "Please enter a valid email address";
				}

				// Check for duplicates on create operations (from API)
				if (operation === "create") {
					try {
						const existingUser = await req.payload.find({
							collection: "waiting-list",
							where: {
								email: {
									equals: value.toLowerCase(),
								},
							},
							limit: 1,
						});

						if (existingUser.docs.length > 0) {
							return "You're already on the waiting list! We'll notify you when we launch.";
						}
					} catch (error) {
						// If check fails, let the unique constraint handle it
						console.error("Duplicate check error:", error);
					}
				}

				return true;
			},
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "source",
			type: "select",
			defaultValue: "landing-page",
			options: [
				{
					label: "Landing Page",
					value: "landing-page",
				},
				{
					label: "Other",
					value: "other",
				},
			],
			admin: {
				description: "Where did this submission come from?",
			},
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "status",
			type: "select",
			defaultValue: "pending",
			options: [
				{
					label: "Pending",
					value: "pending",
				},
				{
					label: "Notified",
					value: "notified",
				},
			],
			admin: {
				position: "sidebar",
				description: "Track if launch email has been sent",
			},
		},
	],
	timestamps: true,
};
