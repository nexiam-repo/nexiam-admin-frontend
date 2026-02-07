import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { BlogPosts } from "./src/collections/BlogPosts/config";
import { ContactUs } from "./src/collections/Forms/contactUs";
import { Partner } from "./src/collections/Forms/partner";
import { Promote } from "./src/collections/Forms/promote";
import { WaitingList } from "./src/collections/Forms/waitingList";
import { Media } from "./src/collections/Media/config";
import { PayloadApiUsers } from "./src/collections/PayloadApiUsers/config";
import { seedDefaultApiUsers } from "./src/collections/PayloadApiUsers/hooks/seedDefaultApiUsers";
import { Users } from "./src/collections/Users/config";
import { EmailTemplates } from "./src/globals/EmailTemplates/config";
import { sendEmail as sendSesEmail } from "./src/lib/email";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	// Rich text editor for blog posts
	editor: lexicalEditor(),

	// Collections
	collections: [Users, PayloadApiUsers, Media, BlogPosts, ContactUs, Partner, Promote, WaitingList],

	// Globals
	globals: [EmailTemplates],

	// Secret key for JWT encryption (min 32 characters)
	secret: process.env.PAYLOAD_SECRET || "",

	// CORS configuration for API access from external domains
	cors: [
		"https://nexiam.net",
		"https://www.nexiam.net",
		"https://nexhub.nexiam.net", // Add your Nexhub SaaS domain
		...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
	],

	// Neon DB Postgres adapter
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL || "",
		},
		// Dedicated schema to separate Payload tables from core/ai schemas
		schemaName: "payload",
		// Auto-push in development (requires direct connection, not pooler)
		// Use migrations in production (works with pooler)
		push: process.env.NODE_ENV !== "production",
		// Use UUIDs for better security and uniqueness
		idType: "uuid",
	}),

	// TypeScript type generation
	typescript: {
		outputFile: path.resolve(dirname, "src/payload-types.ts"),
	},

	// Admin panel configuration
	admin: {
		components: {
			actions: ["/src/components/payload/GoToNexhubAdmin#GoToNexhubAdmin"],
		},
		importMap: {
			baseDir: path.resolve(dirname),
		},
		theme: "all",
		autoLogin:
			process.env.NODE_ENV === "development"
				? {
						email: process.env.ADMIN_EMAIL || "admin@nexiam.net",
						password: process.env.ADMIN_PASSWORD || "password",
						prefillOnly: true,
					}
				: false,
	},

	// Sharp for image processing
	sharp,

	// Email Adapter (Custom SES)
	email: (async () => ({
		defaultFromAddress: "noreply@nexiam.net",
		defaultFromName: "Nexiam",
		// biome-ignore lint/suspicious/noExplicitAny: Custom adapter message type
		sendEmail: async (message: any) => {
			const { to, subject, html, text, from } = message;
			try {
				await sendSesEmail({
					to: to as string,
					subject,
					htmlBody: html as string,
					textBody: text as string,
					fromEmail: from as string,
					fromName: "", // Helper handles full 'Name <email>' string
				});
			} catch (error) {
				console.error("Error sending system email:", error);
				throw error;
			}
		},
		// biome-ignore lint/suspicious/noExplicitAny: Payload runtime expects function, types expect object
	})) as any,

	// Localization for multilingual content
	localization: {
		locales: [
			{
				code: "en",
				label: "English",
			},
		],
		defaultLocale: "en",
		fallback: true,
	},

	// Initialize default API users on first startup
	onInit: async (payload) => {
		await seedDefaultApiUsers(payload);
	},
});

/* bun run payload migrate
bun run payload migrate:create migration
bun run payload migrate:status
bun run payload migrate:down // to rollback

bun run payload migrate:refresh // to Roll back all migrations that have been run, and run them again.
bun run payload migrate:reset // Roll back all migrations.
bun run payload migrate:fresh // Drops all entities from the database and re-runs all migrations from scratch.
 */
