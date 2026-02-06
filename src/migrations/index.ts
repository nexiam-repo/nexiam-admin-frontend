import * as migration_20260206_233626_initial from "./20260206_233626_initial";

export const migrations = [
	{
		up: migration_20260206_233626_initial.up,
		down: migration_20260206_233626_initial.down,
		name: "20260206_233626_initial",
	},
];
