import type { CollectionAfterChangeHook } from "payload";
import { extractPlainText } from "@/globals/EmailTemplates/config";
import {
	compileMjml,
	replaceTemplateVariablesHtml,
	replaceTemplateVariablesPlainText,
	sendEmail,
} from "@/lib/email";

export const sendWaitingListEmail: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
	// Only send email on create (new submissions)
	if (operation !== "create") {
		return doc;
	}

	try {
		// Fetch email templates from global
		const emailTemplates = await req.payload.findGlobal({
			slug: "email-templates",
		});

		// Check if waiting list emails are enabled
		if (!emailTemplates?.waitingListEnabled) {
			console.log("Waiting list emails are disabled");
			return doc;
		}

		// Fallback chain: Template → Env → Default
		const fromEmail =
			emailTemplates.waitingListFromEmail || process.env.FROM_EMAIL || "noreply@nexiam.net";
		const fromName = emailTemplates.waitingListFromName || process.env.FROM_NAME || "Nexiam";

		// Variables for template replacement
		// If name is provided, add comma; otherwise use "There!" with exclamation
		const variables = {
			email: doc.email,
			name: doc.fullName ? `${doc.fullName},` : "There!",
		};

		// Get HTML body - compile on-the-fly if not pre-compiled (first-run scenario)
		let rawHtmlBody = emailTemplates.waitingListHtmlBody;
		if (!rawHtmlBody && emailTemplates.waitingListMjml) {
			rawHtmlBody = await compileMjml(emailTemplates.waitingListMjml);
		}
		const htmlBody = replaceTemplateVariablesHtml(rawHtmlBody || "", variables);

		// Get text body - extract on-the-fly if not pre-generated (first-run scenario)
		let rawTextBody = emailTemplates.waitingListTextBody;
		if (!rawTextBody && emailTemplates.waitingListMjml) {
			rawTextBody = extractPlainText(emailTemplates.waitingListMjml);
		}
		const textBody = replaceTemplateVariablesPlainText(rawTextBody || "", variables);

		// Send email
		await sendEmail({
			to: doc.email,
			subject: emailTemplates.waitingListSubject || "You're on the waitlist!",
			htmlBody,
			textBody,
			fromEmail,
			fromName,
		});

		console.log(`Waiting list confirmation email sent to ${doc.email}`);
	} catch (error) {
		console.error("Error sending waiting list email:", error);
		// Don't fail the submission if email fails
	}

	return doc;
};
