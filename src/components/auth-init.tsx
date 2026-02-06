"use client";

import { useRef } from "react";
import { setGlobalAuthToken } from "@/lib/api";

export function AuthInit({ token }: { token: string }) {
	// Use ref to run this only once, but since it's a global var in api.ts module,
	// running it on every render is fine too (idempotent).
	// But let's keep it safe.
	const initialized = useRef(false);
	if (!initialized.current) {
		setGlobalAuthToken(token);
		initialized.current = true;
	}
	return null;
}
