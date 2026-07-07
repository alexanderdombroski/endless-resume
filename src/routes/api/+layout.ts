// API routes are server endpoints — they must NOT be prerendered.
// This overrides the root layout's prerender = true for all /api/* routes.
export const prerender = false;
export const ssr = true;
