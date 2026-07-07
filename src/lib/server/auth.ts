// TEMPORARY mock auth (/sign-in isn't built yet) — getCurrentUser() always
// returns the same hardcoded id instead of checking a real session. Every API
// route calls this function rather than reading a session directly, so once
// real auth exists there's one place to update (or delete this file in favor
// of SvelteKit's hooks.server.ts + event.locals.user).

export type CurrentUser = {
  id: string;
};

export function getCurrentUser(): CurrentUser {
  return { id: "mock-user-1" };
}
