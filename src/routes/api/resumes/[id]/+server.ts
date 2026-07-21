import { json, type RequestEvent } from "@sveltejs/kit";
import { ObjectId, type OptionalId } from "mongodb";
import { z } from "zod";

import { auth } from "$lib/auth/auth";
import { getDb } from "$lib/db/mongo";
import { SectionSchema } from "$lib/schemas";
import type { ResumeDocument } from "$lib/db/models/resume.model";
import { sanitizeResumeSections } from "$lib/rich-text";

type NewResumeDocument = OptionalId<ResumeDocument>;

// Define the schema for the resume body
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

// Define the schema for duplicating a resume
const DuplicateResumeBodySchema = z.object({
  title: z.string().min(1)
});

// Get the current user from the authentication session
async function getCurrentUser(event: RequestEvent) {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  return session?.user ?? null;
}

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

// Get a specific resume by ID
// GET /api/resumes/:id
export async function GET(event: RequestEvent) {
  const user = await getCurrentUser(event);

  if (!user) {
    return apiError("Unauthorized", 401);
  }

  const { id } = event.params;

  if (!id || !ObjectId.isValid(id)) {
    return apiError("Invalid resume ID", 400);
  }

  const db = await getDb();
  const resumes = db.collection<ResumeDocument>("resumes");

  const resume = await resumes.findOne({
    _id: new ObjectId(id),
    user_id: user.id
  });

  if (!resume) {
    return apiError("Resume not found", 404);
  }

  return json({
    resume: serializeResume(resume)
  });
}

// Duplicate a specific resume by ID
// POST /api/resumes/:id/
export async function POST(event: RequestEvent) {
  const user = await getCurrentUser(event);

  if (!user) {
    return apiError("Unauthorized", 401);
  }

  const { id } = event.params;

  if (!id || !ObjectId.isValid(id)) {
    return apiError("Invalid resume ID", 400);
  }

  const body = await event.request.json();
  const parsed = DuplicateResumeBodySchema.safeParse(body);

  if (!parsed.success) {
    return apiError("Invalid duplicate resume data", 400, parsed.error.flatten());
  }

  const db = await getDb();
  const resumes = db.collection("resumes");

  const originalResume = await resumes.findOne({
    _id: new ObjectId(id),
    user_id: user.id
  });

  if (!originalResume) {
    return apiError("Resume not found", 404);
  }

  const now = new Date().toISOString();

  const resumeWithoutId: Omit<ResumeDocument, "_id"> = {
    user_id: originalResume.user_id,
    title: originalResume.title,
    subtitle: originalResume.subtitle,
    sections: originalResume.sections,
    spacing: originalResume.spacing,
    font: originalResume.font,
    createdAt: originalResume.createdAt,
    updatedAt: originalResume.updatedAt
  };

  const duplicatedResume: NewResumeDocument = {
    ...resumeWithoutId,
    title: parsed.data.title,
    user_id: user.id,
    createdAt: now,
    updatedAt: now
  };

  const result = await resumes.insertOne(duplicatedResume);

  return json({
    message: "Resume duplicated successfully",
    originalResumeId: id,
    _id: result.insertedId.toHexString(),
    title: duplicatedResume.title,
    createdAt: duplicatedResume.createdAt
  });
}

// Update a specific resume by ID
// PUT /api/resumes/:id
export async function PUT(event: RequestEvent) {
  const user = await getCurrentUser(event);

  if (!user) {
    return apiError("Unauthorized", 401);
  }

  const { id } = event.params;

  if (!id || !ObjectId.isValid(id)) {
    return apiError("Invalid resume ID", 400);
  }

  const body = await event.request.json();
  const parsed = ResumeBodySchema.safeParse(body);

  if (!parsed.success) {
    return apiError("Invalid resume data", 400, parsed.error.flatten());
  }

  const db = await getDb();
  const resumes = db.collection("resumes");

  const updatedAt = new Date().toISOString();

  const result = await resumes.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      user_id: user.id
    },
    {
      $set: {
        ...parsed.data,
        sections: sanitizeResumeSections(parsed.data.sections),
        updatedAt
      }
    },
    {
      returnDocument: "after"
    }
  );

  if (!result) {
    return apiError("Resume not found", 404);
  }

  return json({
    message: "Resume updated successfully",
    id,
    title: result.title,
    updatedAt: result.updatedAt
  });
}

// Delete a specific resume by ID
// DELETE /api/resumes/:id
export async function DELETE(event: RequestEvent) {
  const user = await getCurrentUser(event);

  if (!user) {
    return apiError("Unauthorized", 401);
  }

  const { id } = event.params;

  if (!id || !ObjectId.isValid(id)) {
    return apiError("Invalid resume ID", 400);
  }

  const db = await getDb();
  const resumes = db.collection("resumes");

  const result = await resumes.findOneAndDelete({
    _id: new ObjectId(id),
    user_id: user.id
  });

  if (!result) {
    return apiError("Resume not found", 404);
  }

  return json({
    message: "Resume deleted successfully",
    id,
    title: result.title,
    updatedAt: result.updatedAt
  });
}
