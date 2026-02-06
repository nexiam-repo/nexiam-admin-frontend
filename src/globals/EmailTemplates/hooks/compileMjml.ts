import type { FieldHook } from "payload";

// beforeChange hook to compile MJML to HTML
export const compileMjmlHook = (mjmlFieldName: string): FieldHook => {
	return async ({ siblingData }) => {
		const mjmlSource = siblingData?.[mjmlFieldName];
		if (!mjmlSource) {
			return "";
		}

		try {
			// Dynamic import to avoid bundling issues
			const mjml2html = (await import("mjml")).default;
			const result = mjml2html(mjmlSource);
			return result.html;
		} catch (error) {
			console.error("MJML compilation error:", error);
			return "";
		}
	};
};
