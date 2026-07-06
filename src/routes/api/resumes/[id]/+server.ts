import { error } from "@sveltejs/kit";
import { getCurrentUser } from "$lib/server/auth";
import { deleteResume } from "$lib/server/resumes";

export function DELETE({ params }) {
  const user = getCurrentUser();
  const deleted = deleteResume(user.id, params.id);

  if (!deleted) {
    throw error(404, "Resume not found");
  }

  return new Response(null, { status: 204 });
}
