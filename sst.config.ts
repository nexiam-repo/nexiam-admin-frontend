/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST config for nexiam-admin-frontend.
 *
 * Runtime-secrets model differs from nexiam-landing-frontend:
 *   Payload CMS reads PAYLOAD_SECRET and DATABASE_URL inside `buildConfig()`
 *   at module-init time (Lambda cold start, before any of our code runs).
 *   They MUST be Lambda env vars — the Parameters and Secrets Extension can't
 *   wrap Payload's init. CI fetches them from SSM (/common/PAYLOAD_SECRET,
 *   /common/DATABASE_URL) and exposes them in the runner env so Pulumi picks
 *   them up below.
 *
 *   App-level runtime secrets we add later should still go through
 *   src/lib/secrets.ts + the extension. See .claude/rules/secrets-handling.md.
 *
 * Stages:
 *   - "prod"        → admin.nexiam.net,      ses from nexiam.net
 *   - "dev"         → admin.dev.nexiam.net,  ses from dev.nexiam.net
 *   - anything else → bare CloudFront URL (no domain). Use for pre-cutover
 *                     validation: `bun run sst:deploy -- --stage gowsik-test`.
 *
 * Cutover for dev:
 *   1. Deploy to a throwaway stage first (no domain) to verify the build/runtime.
 *   2. Destroy the Amplify app currently serving admin.dev.nexiam.net (manual).
 *   3. `bunx sst deploy --stage dev` attaches the domain, requests the ACM cert
 *      in us-east-1, and writes the Route53 ALIAS into the dev.nexiam.net zone.
 */
export default $config({
	app(input) {
		return {
			name: "nexiam-admin-frontend",
			removal: input?.stage === "prod" ? "retain" : "remove",
			protect: ["prod"].includes(input?.stage ?? ""),
			home: "aws",
			providers: {
				aws: {
					version: "7.23.0",
					region: "eu-central-1",
					defaultTags: {
						tags: {
							Project: "nexiam-admin-frontend",
							Stage: input?.stage ?? "unknown",
							ManagedBy: "sst",
						},
					},
				},
			},
		};
	},

	async run() {
		const stage = $app.stage;
		const isProduction = stage === "prod";
		const isDev = stage === "dev";

		// AWS Parameters and Secrets Lambda Extension (eu-central-1, arm64 / Graviton).
		// Kept even though Payload-framework secrets are Lambda env vars, because
		// app-level secrets added later will go through the extension pattern.
		// Must match the Lambda architecture set below (arm64).
		const paramsAndSecretsLayer =
			"arn:aws:lambda:eu-central-1:187925254637:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:61";

		// Per-stage non-secret config. Secrets come from process.env (populated
		// by _deploy.yml from SSM) — see the `environment:` block below.
		const config = isProduction
			? {
					authUrl: "https://admin.nexiam.net",
					apiUrl: "https://backend.nexiam.net",
					fromEmail: "support@nexiam.net",
					fromName: "Nexiam Support",
					sesIdentity: "nexiam.net",
				}
			: {
					authUrl: "https://admin.dev.nexiam.net",
					apiUrl: "https://backend.dev.nexiam.net",
					fromEmail: "support@dev.nexiam.net",
					fromName: "Nexiam Support",
					sesIdentity: "dev.nexiam.net",
				};

		const domain = isProduction
			? {
					name: "admin.nexiam.net",
					dns: sst.aws.dns(),
				}
			: isDev
				? {
						name: "admin.dev.nexiam.net",
						dns: sst.aws.dns(),
					}
				: undefined;

		// Payload framework requires these in process.env at module-init. Fail
		// loudly at plan time if CI forgot to set them — better than Lambda
		// cold-starting with undefined DB creds and returning 500s.
		const databaseUrl = process.env.DATABASE_URL;
		const payloadSecret = process.env.PAYLOAD_SECRET;
		if (!databaseUrl || !payloadSecret) {
			throw new Error(
				"sst.config.ts: DATABASE_URL and PAYLOAD_SECRET must be set in the " +
					"deploy environment. _deploy.yml fetches them from SSM paths " +
					"/common/DATABASE_URL and /common/PAYLOAD_SECRET before invoking sst.",
			);
		}

		new sst.aws.Nextjs("Admin", {
			domain,

			// Runtime env vars.
			//   ENV              — stage name; read by src/lib/secrets.ts to pick
			//                      between process.env and the extension.
			//   NODE_ENV=production — forces Payload's `push` to false so schema
			//                      changes only land via `bun run payload migrate`
			//                      (run in CI before this deploy). Also enables
			//                      Next's production mode in the Lambda runtime.
			//   DATABASE_URL / PAYLOAD_SECRET — Payload-framework requirements
			//                      (read at buildConfig module-init). Sourced from
			//                      SSM by CI; see header comment.
			//   AUTH_* / NEXT_PUBLIC_* / FROM_* — non-secret per-stage config,
			//                      replaces the old .env.production / .env.development
			//                      files that were only read during Amplify builds.
			environment: {
				ENV: stage,
				NODE_ENV: "production",
				AUTH_URL: config.authUrl,
				AUTH_TRUST_HOST: "true",
				NEXT_PUBLIC_API_URL: config.apiUrl,
				FROM_EMAIL: config.fromEmail,
				FROM_NAME: config.fromName,
				// AWS_REGION is reserved by the Lambda runtime and auto-set to the
				// function's region — passing it here fails CreateFunction with
				// InvalidParameterValueException. src/lib/email.ts falls back
				// correctly because Lambda provides it.
				DATABASE_URL: databaseUrl,
				PAYLOAD_SECRET: payloadSecret,
			},

			// Lambda execution role permissions.
			// ssm:GetParameter — read admin-scoped SSM paths at runtime via the
			//                    extension (for app-level secrets added later).
			// ses:SendEmail    — send from the verified identity for this stage.
			permissions: [
				{
					actions: ["ssm:GetParameter"],
					resources: ["arn:aws:ssm:eu-central-1:*:parameter/frontend/admin/*"],
				},
				{
					actions: ["ses:SendEmail"],
					resources: [`arn:aws:ses:eu-central-1:*:identity/${config.sesIdentity}`],
				},
			],

			transform: {
				server: {
					architecture: "arm64",
					layers: [paramsAndSecretsLayer],
				},
			},

			buildCommand: "npx --yes @opennextjs/aws@3.10.2 build",
		});
	},
});
