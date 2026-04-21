/**
 * Runtime secret access for app-level secrets (NOT Payload framework secrets).
 *
 * Payload's PAYLOAD_SECRET and DATABASE_URL are read at buildConfig module-init,
 * before this file is imported — they live in Lambda env vars, populated by CI
 * from SSM. See sst.config.ts header and .claude/rules/secrets-handling.md.
 *
 * For any OTHER runtime secret (API keys, third-party tokens, etc.) use
 * getSecret() below. Branch is chosen by `process.env.ENV`:
 *   - "local" → process.env fallback (populate .env.local for `bun run dev`)
 *   - anything else (or unset) → AWS Parameters and Secrets Lambda Extension
 *     on http://localhost:2773
 *
 * `ENV` is set by sst.config.ts to the raw stage name ("prod", "dev", or
 * any throwaway stage). The "not local" default is deliberate: a misspelled
 * or missing ENV fails loudly at the extension rather than silently reading
 * empty process.env values.
 *
 * The Lambda execution role must grant `ssm:GetParameter` on the path
 * (see sst.config.ts). The session-token header is required — it's how the
 * extension authenticates the caller (IMDSv2-style).
 *
 * Never read runtime secrets via process.env in application code — always
 * go through getSecret(). See .claude/rules/secrets-handling.md.
 */

const EXTENSION_URL = "http://localhost:2773/systemsmanager/parameters/get";
const cache = new Map<string, string>();

function isLocalDev(): boolean {
	return process.env.ENV === "local";
}

function localFallback(name: string): string {
	const envKey = name.split("/").filter(Boolean).pop();
	if (!envKey) {
		throw new Error(`getSecret: invalid parameter name "${name}"`);
	}
	const value = process.env[envKey];
	if (!value) {
		throw new Error(
			`getSecret: secret "${name}" not found in process.env["${envKey}"] ` +
				`(local dev fallback). Add it to .env.local.`,
		);
	}
	return value;
}

export async function getSecret(name: string): Promise<string> {
	const cached = cache.get(name);
	if (cached !== undefined) return cached;

	if (isLocalDev()) {
		const value = localFallback(name);
		cache.set(name, value);
		return value;
	}

	const token = process.env.AWS_SESSION_TOKEN;
	if (!token) {
		throw new Error(
			"getSecret: AWS_SESSION_TOKEN missing. ENV is not 'local' so the " +
				"Parameters and Secrets Lambda Extension should be attached. " +
				"Check sst.config.ts transform.server.layers, or set ENV=local " +
				"for local dev.",
		);
	}

	const url = `${EXTENSION_URL}?name=${encodeURIComponent(name)}&withDecryption=true`;
	const res = await fetch(url, {
		headers: { "X-Aws-Parameters-Secrets-Token": token },
	});

	if (!res.ok) {
		throw new Error(
			`getSecret: extension returned ${res.status} for "${name}" — ` +
				`check IAM ssm:GetParameter grant and path spelling.`,
		);
	}

	const body = (await res.json()) as { Parameter?: { Value?: string } };
	const value = body.Parameter?.Value;
	if (typeof value !== "string") {
		throw new Error(`getSecret: no Parameter.Value in extension response for "${name}"`);
	}

	cache.set(name, value);
	return value;
}
