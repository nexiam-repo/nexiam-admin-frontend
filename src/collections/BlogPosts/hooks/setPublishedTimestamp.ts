import type { CollectionBeforeChangeHook } from "payload";

// Set publishedAt timestamp when status changes to published
export const setPublishedTimestamp: CollectionBeforeChangeHook = ({
	data,
	operation,
	originalDoc,
}) => {
	// Only set timestamp on update when status changes to published
	if (operation === "update") {
		const wasPublished = originalDoc?.status === "published";
		const isNowPublished = data?.status === "published";

		// If changing from draft to published, set timestamp
		if (!wasPublished && isNowPublished && !data.publishedAt) {
			data.publishedAt = new Date().toISOString();
		}
	}

	// On create, if status is published, set timestamp
	if (operation === "create" && data?.status === "published" && !data.publishedAt) {
		data.publishedAt = new Date().toISOString();
	}

	return data;
};
