import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const execAsync = promisify(exec);

const sesClient = new SESv2Client({
	region: process.env.AWS_REGION || "us-east-1",
});

interface SendEmailParams {
	to: string;
	subject: string;
	htmlBody: string;
	textBody: string;
	fromEmail: string;
	fromName: string;
}

export async function sendEmail({
	to,
	subject,
	htmlBody,
	textBody,
	fromEmail,
	fromName,
}: SendEmailParams): Promise<boolean> {
	try {
		// Format email address with name if provided
		const fromAddress = fromName?.trim() ? `${fromName.trim()} <${fromEmail}>` : fromEmail;

		const command = new SendEmailCommand({
			FromEmailAddress: fromAddress,
			Destination: {
				ToAddresses: [to],
			},
			Content: {
				Simple: {
					Subject: {
						Data: subject,
						Charset: "UTF-8",
					},
					Body: {
						Html: {
							Data: htmlBody,
							Charset: "UTF-8",
						},
						Text: {
							Data: textBody,
							Charset: "UTF-8",
						},
					},
				},
			},
		});

		await sesClient.send(command);
		console.log(`Email sent successfully to ${to}`);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		return false;
	}
}

/**
 * Compile MJML to HTML using the MJML CLI
 * Returns the compiled HTML or throws an error
 */
export async function compileMjml(mjml: string): Promise<string> {
	if (!mjml?.includes("<mjml>")) {
		throw new Error("Invalid MJML: must contain <mjml> tags");
	}

	const tempFileName = `mjml-${randomBytes(8).toString("hex")}.mjml`;
	const tempFilePath = join(tmpdir(), tempFileName);

	try {
		// Write MJML to temp file
		await writeFile(tempFilePath, mjml, "utf-8");

		// Run MJML CLI
		const { stdout } = await execAsync(`npx mjml "${tempFilePath}" -s`);

		return stdout;
	} finally {
		// Clean up temp file
		try {
			await unlink(tempFilePath);
		} catch {
			// Ignore cleanup errors
		}
	}
}

/**
 * Escape HTML entities to prevent XSS and broken HTML
 * Converts: < > & " ' to their HTML entity equivalents
 */
export function escapeHtml(unsafe: string): string {
	if (!unsafe || typeof unsafe !== "string") return "";
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Replace template variables like {{name}}, {{email}} with actual values
 * For HTML templates, values are automatically escaped to prevent XSS
 * For plain text templates, use replaceTemplateVariablesPlainText instead
 */
export function replaceTemplateVariablesHtml(
	template: string,
	variables: Record<string, string>,
): string {
	let result = template;
	for (const [key, value] of Object.entries(variables)) {
		const regex = new RegExp(`{{${key}}}`, "g");
		// Escape HTML entities in the value before replacement
		result = result.replace(regex, escapeHtml(value));
	}
	return result;
}

/**
 * Replace template variables for plain text templates (no escaping needed)
 */
export function replaceTemplateVariablesPlainText(
	template: string,
	variables: Record<string, string>,
): string {
	let result = template;
	for (const [key, value] of Object.entries(variables)) {
		const regex = new RegExp(`{{${key}}}`, "g");
		result = result.replace(regex, value || "");
	}
	return result;
}

/**
 * @deprecated Use replaceTemplateVariablesHtml for HTML or replaceTemplateVariablesPlainText for text
 * Kept for backward compatibility - uses HTML escaping for safety
 */
export function replaceTemplateVariables(
	template: string,
	variables: Record<string, string>,
): string {
	return replaceTemplateVariablesHtml(template, variables);
}
