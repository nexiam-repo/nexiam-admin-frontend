import type { Access } from "payload";

/** Grants unconditional access — use only on public-facing collections. */
export const anyone: Access = () => true;
