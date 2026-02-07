import type { Payload } from "payload";

/**
 * Seed default Payload API users on initial setup
 *
 * IMPORTANT: This creates the user accounts but does NOT generate API keys.
 * API keys must be manually generated in the Admin Panel for security:
 *
 * 1. Go to /admin/collections/payload-api-users
 * 2. Click on each user (e.g., api-landing-page@nexiam.net)
 * 3. Click "Enable API Key" or "Generate API Key"
 * 4. SAVE THE KEY IMMEDIATELY - it will only be shown once
 * 5. Store the key in your environment variables for use in integrations
 *
 * The users won't change on redeploy - only created if they don't exist.
 */
export const seedDefaultApiUsers = async (payload: Payload) => {
	const apiUsersToSeed = [
		{
			name: "Landing Page - Marketing",
			description: "API user for landing page (nexiam.net) to access blog posts and CMS content",
			enableAPIKey: true,
			allowedOrigins: [{ origin: "https://nexiam.net" }, { origin: "https://www.nexiam.net" }],
		},
		{
			name: "Nexhub - SaaS App",
			description: "API user for Nexhub SaaS application to access CMS content",
			enableAPIKey: true,
			allowedOrigins: [],
		},
	];

	console.log("\n🔧 Seeding Payload API Users...\n");

	for (const userData of apiUsersToSeed) {
		try {
			// Check if user already exists by name
			const existingUser = await payload.find({
				collection: "payload-api-users",
				where: {
					name: {
						equals: userData.name,
					},
				},
				limit: 1,
			});

			if (existingUser.docs.length > 0) {
				console.log(`⏭️  Skipped: ${userData.name} (already exists)`);
				continue;
			}

			// Create the user
			await payload.create({
				collection: "payload-api-users",
				data: userData,
			});

			console.log(`✅ Created API user: ${userData.name}`);
			console.log(
				`   ⚠️  NEXT STEP: Generate API key manually in Admin Panel at /admin/collections/payload-api-users`,
			);
			console.log("");
		} catch (error: unknown) {
			// Log any errors
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.error(`❌ Failed to create API user ${userData.name}:`, errorMessage);
		}
	}

	console.log(
		"📖 To generate API keys: Visit /admin/collections/payload-api-users and enable API keys for each user\n",
	);
};
