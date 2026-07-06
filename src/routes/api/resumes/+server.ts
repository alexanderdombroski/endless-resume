import { error, json } from "@sveltejs/kit";
import { getCurrentUser } from "$lib/server/auth";
import { createResume, listResumes } from "$lib/server/resumes";
import { templates } from "$lib/assets/data/templates";

export function GET() {
  const user = getCurrentUser();
  return json(listResumes(user.id));
}

export async function POST({ request }) {
  const body = await request.json();
  const templateName = body?.templateName;

  const template = templates.find((t) => t.template === templateName);
  if (!template) {
    throw error(400, "Unknown templateName");
  }

  const user = getCurrentUser();
  const resume = createResume(user.id, template);
  return json(resume, { status: 201 });
}
