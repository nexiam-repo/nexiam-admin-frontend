import type { FieldHook } from "payload";

// Auto-generate slug from title if not provided
export const generateSlug: FieldHook = ({ data, operation, value }) => {
	if (operation === "create" || operation === "update") {
		// If slug is already provided, use it
		if (value) {
			return value;
		}

		// Generate slug from title
		if (data?.title) {
			return data.title
				.toLowerCase()
				.replace(/[^\w\s-]/g, "") // Remove special characters
				.replace(/\s+/g, "-") // Replace spaces with hyphens
				.replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
				.trim();
		}
	}

	return value;
};
