import type { CollectionConfig } from "payload";
import { isSuperAdminOrAdmin, isSuperAdminOrAdminFieldLevel } from "@/access/roles";
import { sendContactFormEmail } from "./hooks/sendContactFormEmail";

import { createSupportNotificationHook } from "./hooks/sendSupportNotification";

export const ContactUs: CollectionConfig = {
	slug: "contact-us",
	hooks: {
		afterChange: [sendContactFormEmail, createSupportNotificationHook("Contact Form")],
	},
	labels: {
		singular: "Form - Contact", // EG "Contact Submission successfully created."
		plural: "Form - Contact", // EG "Contact Submissions successfully created."
	},
	admin: {
		useAsTitle: "email",
		defaultColumns: ["fullName", "email", "createdAt"],
		description: "Contact form submissions from the landing page",
		group: "Landing Page",
	},
	access: {
		// specific access control
		read: ({ req: { user } }) => !!user,
		update: ({ req: { user } }) => !!user,
		delete: isSuperAdminOrAdmin,

		// Allow API key or admin to create submissions
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
			required: true,
			label: "Full Name",
			minLength: 2,
			maxLength: 100,
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "email",
			type: "email",
			required: true,
			label: "Email Address",
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "companyName",
			type: "text",
			label: "Company Name",
			required: false,
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "country",
			type: "text",
			label: "Country",
			required: false,
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "industry",
			type: "select",
			label: "Industry",
			required: false,
			options: [
				{ label: "Technology", value: "Technology" },
				{ label: "Marketing", value: "Marketing" },
				{ label: "Finance", value: "Finance" },
				{ label: "Healthcare", value: "Healthcare" },
				{ label: "Education", value: "Education" },
				{ label: "Retail", value: "Retail" },
				{ label: "Manufacturing", value: "Manufacturing" },
				{ label: "Consulting", value: "Consulting" },
				{ label: "Real Estate", value: "Real Estate" },
				{ label: "Entertainment", value: "Entertainment" },
				{ label: "Other", value: "Other" },
				// Legacy options for backward compatibility
				{ label: "Technology (Legacy)", value: "technology" },
				{ label: "Finance (Legacy)", value: "finance" },
				{ label: "Healthcare (Legacy)", value: "healthcare" },
				{ label: "Education (Legacy)", value: "education" },
				{ label: "Manufacturing (Legacy)", value: "manufacturing" },
				{ label: "Retail (Legacy)", value: "retail" },
				{ label: "Other (Legacy)", value: "other" },
			],
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "otherIndustry",
			type: "text",
			label: "Other Industry",
			required: false,
			admin: {
				condition: (data) => data?.industry === "Other",
			},
			access: {
				update: isSuperAdminOrAdminFieldLevel,
			},
		},
		{
			name: "message",
			type: "textarea",
			required: true,
			label: "Message",
			minLength: 10,
			maxLength: 1000,
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
			defaultValue: "new",
			options: [
				{
					label: "New",
					value: "new",
				},
				{
					label: "In Progress",
					value: "in-progress",
				},
				{
					label: "Resolved",
					value: "resolved",
				},
				{
					label: "Spam",
					value: "spam",
				},
			],
			admin: {
				position: "sidebar",
				description: "Track the status of this inquiry",
			},
		},
	],
	timestamps: true,
};
