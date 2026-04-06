import type { GlobalConfig } from "payload";
import { compileMjml } from "@/lib/email";
import { defaultContactFormHtml, defaultWaitingListHtml } from "./defaultHtmlTemplates";
import { defaultContactFormMjml, defaultWaitingListMjml } from "./defaultMjmlTemplates";

// Helper to extract plain text from MJML (reused in hooks)
export const extractPlainText = (mjml: string): string => {
	return mjml
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/mj-text>/gi, "\n")
		.replace(/<\/mj-section>/gi, "\n\n")
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.split("\n")
		.map((line) => line.trim())
		.join("\n")
		.trim();
};

// Pre-generated default plain text (for initial run before first save)
const defaultWaitingListTextBody = extractPlainText(defaultWaitingListMjml);
const defaultContactFormTextBody = extractPlainText(defaultContactFormMjml);
const defaultWaitingListHtmlBody = defaultWaitingListHtml;
const defaultContactFormHtmlBody = defaultContactFormHtml;

export const EmailTemplates: GlobalConfig = {
	slug: "email-templates",
	label: "Email Templates",
	admin: {
		group: "Landing Page",
		description: "Manage automated email templates for form submissions using MJML",
	},
	access: {
		read: ({ req: { user } }) => !!user,
		update: ({ req: { user } }) => !!user,
	},
	hooks: {
		// Compile MJML to HTML and generate plain text before saving
		beforeChange: [
			async ({ data }) => {
				// Compile waiting list MJML if present
				if (data.waitingListMjml) {
					try {
						data.waitingListHtmlBody = await compileMjml(data.waitingListMjml);
						data.waitingListTextBody = extractPlainText(data.waitingListMjml);
					} catch (error) {
						console.error("Error compiling waiting list MJML:", error);
						// Keep existing values if compilation fails
					}
				}

				// Compile contact form MJML if present
				if (data.contactFormMjml) {
					try {
						data.contactFormHtmlBody = await compileMjml(data.contactFormMjml);
						data.contactFormTextBody = extractPlainText(data.contactFormMjml);
					} catch (error) {
						console.error("Error compiling contact form MJML:", error);
						// Keep existing values if compilation fails
					}
				}

				return data;
			},
		],
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Waiting List",
					fields: [
						{
							name: "waitingListEnabled",
							type: "checkbox",
							label: "Enable Waiting List Confirmation Email",
							defaultValue: true,
							admin: {
								description: "Send confirmation email to user when user joins waiting list",
							},
						},
						{
							name: "waitingListSubject",
							type: "text",
							label: "Email Subject",
							defaultValue: "You're on the waitlist! 🎉",
							required: true,
							admin: {
								condition: (data) => data?.waitingListEnabled === true,
							},
						},
						{
							name: "waitingListFromEmail",
							type: "email",
							label: "From Email",
							defaultValue: () => {
								const env = process.env.ENV || "dev";
								if (env === "prod" || env === "production") {
									return "support@nexiam.net";
								}
								return `support@${env}.nexiam.net`;
							},
							admin: {
								condition: (data) => data?.waitingListEnabled === true,
								description: "Leave empty to use default from environment (FROM_EMAIL)",
							},
						},
						{
							name: "waitingListFromName",
							type: "text",
							label: "From Name",
							defaultValue: "Nexiam Support",
							required: true,
							admin: {
								condition: (data) => data?.waitingListEnabled === true,
							},
						},
						{
							name: "waitingListMjml",
							type: "code",
							label: "MJML Email Source",
							required: true,
							defaultValue: defaultWaitingListMjml,
							admin: {
								condition: (data) => data?.waitingListEnabled === true,
								language: "html",
								description:
									"Write MJML here. Use {{name}} and {{email}} for dynamic values. HTML is compiled automatically on save.",
							},
						},

						{
							name: "waitingListPreview",
							type: "ui",
							admin: {
								condition: (data) => data?.waitingListEnabled === true,
								components: {
									Field: {
										path: "/src/components/payload/EmailPreview#WaitingListPreview",
									},
								},
							},
						},
						// Hidden field to store plain text (auto-generated from MJML)
						{
							name: "waitingListTextBody",
							type: "textarea",
							defaultValue: defaultWaitingListTextBody,
							admin: {
								hidden: true,
							},
						},
						// Hidden field to store compiled HTML

						{
							name: "waitingListHtmlBody",
							type: "textarea",
							defaultValue: defaultWaitingListHtmlBody,
							admin: {
								hidden: true,
							},
						},
					],
				},
				{
					label: "Contact Form",
					fields: [
						{
							name: "contactFormEnabled",
							type: "checkbox",
							label: "Enable Contact Form Confirmation Email",
							defaultValue: true,
							admin: {
								description: "Send confirmation email when user submits contact form",
							},
						},
						{
							name: "contactFormSubject",
							type: "text",
							label: "Email Subject",
							defaultValue: "Thanks for reaching out!",
							required: true,
							admin: {
								condition: (data) => data?.contactFormEnabled === true,
							},
						},
						{
							name: "contactFormFromEmail",
							type: "email",
							label: "From Email",
							defaultValue: () => {
								const env = process.env.ENV || "dev";
								if (env === "prod" || env === "production") {
									return "support@nexiam.net";
								}
								return `support@${env}.nexiam.net`;
							},
							admin: {
								condition: (data) => data?.contactFormEnabled === true,
								description: "Leave empty to use default from environment (FROM_EMAIL)",
							},
						},
						{
							name: "contactFormFromName",
							type: "text",
							label: "From Name",
							defaultValue: "Nexiam Support",
							required: true,
							admin: {
								condition: (data) => data?.contactFormEnabled === true,
							},
						},
						{
							name: "contactFormMjml",
							type: "code",
							label: "MJML Email Source",
							required: true,
							defaultValue: defaultContactFormMjml,
							admin: {
								condition: (data) => data?.contactFormEnabled === true,
								language: "html",
								description:
									"Write MJML here. Use {{name}}, {{email}}, {{message}} for dynamic values. HTML is compiled automatically on save.",
							},
						},
						{
							name: "contactFormPreview",
							type: "ui",
							admin: {
								condition: (data) => data?.contactFormEnabled === true,
								components: {
									Field: {
										path: "/src/components/payload/EmailPreview#ContactFormPreview",
									},
								},
							},
						},
						// Hidden field to store plain text (auto-generated from MJML)
						{
							name: "contactFormTextBody",
							type: "textarea",
							defaultValue: defaultContactFormTextBody,
							admin: {
								hidden: true,
							},
						},
						// Hidden field to store compiled HTML
						{
							name: "contactFormHtmlBody",
							type: "textarea",
							defaultValue: defaultContactFormHtmlBody,
							admin: {
								hidden: true,
							},
						},
					],
				},
			],
		},
	],
};
