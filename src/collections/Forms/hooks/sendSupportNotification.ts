import type { CollectionAfterChangeHook } from "payload";
import { sendEmail } from "@/lib/email";

// Helper to format values for display
// biome-ignore lint/suspicious/noExplicitAny: Generic formatter
const formatValue = (value: any): string => {
	if (value === null || value === undefined) return "-";
	if (value instanceof Date) return value.toLocaleString();
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
};

// Factory function to create a hook specific to a form
export const createSupportNotificationHook =
	(formName: string): CollectionAfterChangeHook =>
	async ({ doc, operation }) => {
		// Only send on create logic
		if (operation !== "create") {
			return doc;
		}

		try {
			// Determine recipient
			const supportEmail = process.env.SUPPORT_EMAIL || "support@nexiam.net";

			// Determine subject
			// Use email or name or ID for quick identification
			const identifier = doc.email || doc.fullName || doc.name || doc.id;
			const subject = `New ${formName} Submission: ${identifier}`;

			// Generate HTML Table from doc fields
			// We filter out some standard internal fields to keep it clean
			const excludedFields = [
				"id",
				"updatedAt",
				"__v",
				"salt",
				"hash",
				"loginAttempts",
				"lockUntil",
				"_strategy",
			];

			// Sort vital fields to top if possible, otherwise alphabetical or default keys order
			const rows = Object.entries(doc)
				.filter(([key]) => !excludedFields.includes(key))
				.map(([key, value]) => {
					// Format key: camelCase to Title Case (rough)
					const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

					return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600; color: #555; width: 30%; font-size: 14px;">${label}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222; font-size: 14px;">${formatValue(
											value,
										)}</td>
                </tr>
            `;
				})
				.join("");

			const htmlBody = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
                <h2 style="color: #111; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000;">${formName} Submission</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <div style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
                    <p>Sent via Nexiam Admin System • ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

			const textBody = `New ${formName} submission details:\n\n${Object.entries(doc)
				.filter(([key]) => !excludedFields.includes(key))
				.map(([key, value]) => `${key}: ${formatValue(value)}`)
				.join("\n")}`;

			// Determine from email based on environment (must be verified in SES)
			const env = process.env.ENV || "dev";
			const fromEmail =
				process.env.FROM_EMAIL ||
				(env === "prod" || env === "production"
					? "support@nexiam.net"
					: `support@${env}.nexiam.net`);

			await sendEmail({
				to: supportEmail,
				subject,
				htmlBody,
				textBody,
				fromEmail,
				fromName: "Nexiam Admin System",
			});

			console.log(`Support notification sent for ${formName}`);
			console.log(`> From: ${fromEmail}`);
			console.log(`> To: ${supportEmail}`);
		} catch (error) {
			console.error(`Error sending support notification for ${formName}:`, error);
			// Do not fail the transaction
		}

		return doc;
	};
