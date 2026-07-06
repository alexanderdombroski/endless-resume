export type CurrentUser = {
  id: string;
};

/**
 * Stand-in for real session auth (sign-in is not implemented yet).
 * Single call site so it can be swapped for real user lookup later.
 */
export function getCurrentUser(): CurrentUser {
  return { id: "mock-user-1" };
}
