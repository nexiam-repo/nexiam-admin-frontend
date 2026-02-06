import type { CollectionAfterChangeHook } from "payload";
import { extractPlainText } from "@/globals/EmailTemplates/config";
import {
	compileMjml,
	replaceTemplateVariablesHtml,
	replaceTemplateVariablesPlainText,
	sendEmail,
} from "@/lib/email";

export const sendContactFormEmail: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
	// Only send email on create (new submissions)
	if (operation !== "create") {
		return doc;
	}

	try {
		// Fetch email templates from global
		const emailTemplates = await req.payload.findGlobal({
			slug: "email-templates",
		});

		// Check if contact form emails are enabled
		if (!emailTemplates?.contactFormEnabled) {
			console.log("Contact form emails are disabled");
			return doc;
		}

		// Fallback chain: Template → Env → Default
		const fromEmail =
			emailTemplates.contactFormFromEmail || process.env.FROM_EMAIL || "noreply@nexiam.net";
		const fromName = emailTemplates.contactFormFromName || process.env.FROM_NAME || "Nexiam";

		// Variables for template replacement
		const variables = {
			name: `${doc.fullName},`, // Map fullName field to {{name}} variable with comma
			email: doc.email,
			message: doc.message,
		};

		// Get HTML body - compile on-the-fly if not pre-compiled (first-run scenario)
		let rawHtmlBody = emailTemplates.contactFormHtmlBody;
		if (!rawHtmlBody && emailTemplates.contactFormMjml) {
			rawHtmlBody = await compileMjml(emailTemplates.contactFormMjml);
		}
		const htmlBody = replaceTemplateVariablesHtml(rawHtmlBody || "", variables);

		// Get text body - extract on-the-fly if not pre-generated (first-run scenario)
		let rawTextBody = emailTemplates.contactFormTextBody;
		if (!rawTextBody && emailTemplates.contactFormMjml) {
			rawTextBody = extractPlainText(emailTemplates.contactFormMjml);
		}
		const textBody = replaceTemplateVariablesPlainText(rawTextBody || "", variables);

		// Send email
		await sendEmail({
			to: doc.email,
			subject: emailTemplates.contactFormSubject || "Thanks for reaching out!",
			htmlBody,
			textBody,
			fromEmail,
			fromName,
		});

		console.log(`Contact form confirmation email sent to ${doc.email}`);
	} catch (error) {
		console.error("Error sending contact form email:", error);
		// Don't fail the submission if email fails
	}

	return doc;
};
