import { json } from "@sveltejs/kit";
import { z } from "zod";

import { auth } from "$lib/auth/auth";
import { getDb } from "$lib/db/mongo";
import { SectionSchema } from "$lib/schemas";
import type { OptionalId } from "mongodb";
import type { ResumeDocument } from "$lib/db/models/resume.model";

type NewResumeDocument = OptionalId<ResumeDocument>;

// Schema for validating resume data
const ResumeBodySchema = z.object({
  title: z.string().min(1),
  subtitle: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  sections: z.array(SectionSchema),
  spacing: z.object({
    bullet: z.number().positive(),
    section: z.number().positive()
  }),
  font: z.object({
    family: z.string(),
    sizes: z.object({
      title: z.number().positive(),
      heading: z.number().positive(),
      bullet: z.number().positive()
    })
  })
});

// Helper function to create API errors
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
export async function POST({ request }) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user?.id) {
    return apiError("Unauthorized", 401);
  }

  const body = await request.json();
  const parsed = ResumeBodySchema.safeParse(body);

  if (!parsed.success) {
    return apiError("Invalid resume data", 400, parsed.error.flatten());
  }

  const now = new Date().toISOString();

  const resume = {
    ...parsed.data,
    user_id: session.user.id,
    createdAt: now,
    updatedAt: now
  };

  const db = await getDb();
  const resumes = db.collection<NewResumeDocument>("resumes");

  const result = await resumes.insertOne(resume);

  return json(
    {
      message: "Resume created successfully",
      _id: result.insertedId.toHexString(),
      title: resume.title,
      createdAt: resume.createdAt
    },
    { status: 201 }
  );
}
