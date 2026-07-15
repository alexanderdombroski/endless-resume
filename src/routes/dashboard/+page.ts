import type { Resume } from "$lib/schemas";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/api/resumes");
  const data: { resumes: Resume[] } = await res.json();
  return { resumes: data.resumes };
};
