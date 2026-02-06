// Biome v2 + lint-staged

// .lintstagedrc.mjs — Biome v2
export default {
	"*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}": [
		"biome check --write --files-ignore-unknown=true --no-errors-on-unmatched",
	],

	"*.{json,jsonc,yaml,yml,toml,gql,graphql,md}": ["dprint fmt --allow-no-files"],

	"Dockerfile{,.*}": ["dprint fmt --allow-no-files"],
};
