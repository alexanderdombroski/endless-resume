import { json, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth/auth";
import { getDb } from "$lib/db/mongo";
import { CreateResumeSchema } from "$lib/schemas";
import { createResume, type ResumeDocument } from "$lib/db/models/resume.model";

function apiError(message: string, status = 500, errors?: unknown) {
  return json({ message, status, errors }, { status });
}
// Helper function to serialize resume data
function serializeResume(resume: ResumeDocument) {
  return {
    ...resume,
    _id: resume._id.toHexString()
  };
}

// Get all resumes for the authenticated user
// GET /api/resumes
export async function GET({ request }) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user?.id) {
    return apiError("Unauthorized", 401);
  }

  const db = await getDb();
  const resumes = db.collection<ResumeDocument>("resumes");

  const url = new URL(request.url);

  const q = url.searchParams.get("q");
  const dateStart = url.searchParams.get("date_start");
  const dateEnd = url.searchParams.get("date_end");

  const page = Number(url.searchParams.get("page") ?? 1);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const limit = 10;
  const skip = offset || (page - 1) * limit;

  const filter: Record<string, unknown> = {
    user_id: session.user.id
  };

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  if (dateStart || dateEnd) {
    filter.createdAt = {};

    if (dateStart) {
      (filter.createdAt as Record<string, string>).$gte = dateStart;
    }

    if (dateEnd) {
      (filter.createdAt as Record<string, string>).$lte = dateEnd;
    }
  }

  const results = await resumes
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return json({
    resumes: results.map(serializeResume),
    page,
    offset: skip,
    returned: results.length
  });
}

// Create a new resume
// POST /api/resumes
export const POST: RequestHandler = async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user?.id) {
    return apiError("Unauthorized", 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON", 400);
  }

  const parsed = CreateResumeSchema.safeParse(body);

  if (!parsed.success) {
    return apiError("Invalid resume data", 400, parsed.error.flatten());
  }

  try {
    const resume = await createResume(parsed.data, session.user.id);

    return json(
      {
        message: "Resume created successfully",
        resume
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error("Failed to create resume:", error);

    return apiError("Failed to create resume", 500);
  }
};
