import type { CollectionBeforeChangeHook } from "payload";

// Auto-populate SEO fields from content if not provided
export const populateSEO: CollectionBeforeChangeHook = ({ data }) => {
	// If metaTitle is not set, use the title
	if (!data?.seo?.metaTitle && data?.title) {
		if (!data.seo) data.seo = {};
		data.seo.metaTitle = data.title;
	}

	// If metaDescription is not set, use the excerpt
	if (!data?.seo?.metaDescription && data?.excerpt) {
		if (!data.seo) data.seo = {};
		data.seo.metaDescription = data.excerpt;
	}

	// If metaImage is not set, use the featuredImage
	if (!data?.seo?.metaImage && data?.featuredImage) {
		if (!data.seo) data.seo = {};
		data.seo.metaImage = data.featuredImage;
	}

	return data;
};
