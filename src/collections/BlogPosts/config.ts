import type { CollectionConfig } from "payload";
import { generateSlug } from "./hooks/generateSlug";
import { populateSEO } from "./hooks/populateSEO";
import { setPublishedTimestamp } from "./hooks/setPublishedTimestamp";

export const BlogPosts: CollectionConfig = {
	slug: "blog-posts",
	labels: {
		singular: "Content - Blog Post",
		plural: "Content - Blog Posts",
	},
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "slug", "publishedAt", "status"],
		group: "Landing Page",
	},
	hooks: {
		beforeChange: [setPublishedTimestamp, populateSEO],
	},
	access: {
		// Anyone can read published posts
		read: ({ req: { user } }) => {
			if (user) return true;
			return {
				status: {
					equals: "published",
				},
			};
		},
		create: ({ req: { user } }) => !!user,
		update: ({ req: { user } }) => !!user,
		delete: ({ req: { user } }) => !!user,
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			localized: true,
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			admin: {
				description: "SEO-friendly URL slug (auto-generated from title if not provided)",
			},
			hooks: {
				beforeValidate: [generateSlug],
			},
		},
		{
			name: "excerpt",
			type: "textarea",
			required: true,
			localized: true,
			admin: {
				description: "Short description for SEO and previews",
			},
		},
		{
			name: "content",
			type: "richText",
			required: true,
			localized: true,
		},
		{
			name: "featuredImage",
			type: "upload",
			relationTo: "media",
			required: false,
		},
		{
			name: "author",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "status",
			type: "select",
			required: true,
			defaultValue: "draft",
			options: [
				{
					label: "Draft",
					value: "draft",
				},
				{
					label: "Published",
					value: "published",
				},
			],
		},
		{
			name: "publishedAt",
			type: "date",
			admin: {
				date: {
					pickerAppearance: "dayAndTime",
				},
			},
		},
		{
			name: "seo",
			type: "group",
			fields: [
				{
					name: "metaTitle",
					type: "text",
					localized: true,
				},
				{
					name: "metaDescription",
					type: "textarea",
					localized: true,
				},
				{
					name: "metaImage",
					type: "upload",
					relationTo: "media",
				},
			],
		},
	],
};
