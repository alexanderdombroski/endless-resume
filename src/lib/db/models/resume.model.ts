// src/lib/db/models/resume.model.ts
import { ObjectId, type Collection, type Document } from "mongodb";
import { getDb } from "$lib/db/mongo";
import { ResumeSchema, type Resume } from "$lib/schemas";

const COLLECTION_NAME = "resumes";

export type ResumeDocument = Omit<Resume, "_id"> & {
  _id: ObjectId;
  userId?: ObjectId;
};

function serializeResume(doc: ResumeDocument): Resume {
  return ResumeSchema.parse({
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId?.toString()
  });
}

function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  return new ObjectId(id);
}

async function getResumeCollection(): Promise<Collection<ResumeDocument>> {
  const db = await getDb();
  return db.collection<ResumeDocument>(COLLECTION_NAME);
}

export async function findResumesByUserId(userId: string): Promise<Resume[]> {
  const collection = await getResumeCollection();

  const docs = await collection
    .find({ userId: toObjectId(userId) } as Document)
    .sort({ updatedAt: -1 })
    .toArray();

  return docs.map(serializeResume);
}

export async function findResumeById(id: string): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const doc = await collection.findOne({
    _id: toObjectId(id)
  });

  return doc ? serializeResume(doc) : null;
}

export async function findResumeByIdAndUserId(id: string, userId: string): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const doc = await collection.findOne({
    _id: toObjectId(id),
    userId: toObjectId(userId)
  } as Document);

  return doc ? serializeResume(doc) : null;
}

export async function createResume(
  data: Omit<Resume, "_id" | "createdAt" | "updatedAt">,
  userId?: string
): Promise<Resume> {
  const collection = await getResumeCollection();

  const now = new Date().toISOString();

  const doc: ResumeDocument = {
    ...data,
    _id: new ObjectId(),
    ...(userId ? { userId: toObjectId(userId) } : {}),
    createdAt: now,
    updatedAt: now
  };

  await collection.insertOne(doc);

  return serializeResume(doc);
}

export async function updateResumeById(
  id: string,
  data: Partial<Omit<Resume, "_id" | "createdAt" | "updatedAt">>
): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const result = await collection.findOneAndUpdate(
    { _id: toObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    },
    {
      returnDocument: "after"
    }
  );

  return result ? serializeResume(result) : null;
}

export async function updateResumeByIdAndUserId(
  id: string,
  userId: string,
  data: Partial<Omit<Resume, "_id" | "createdAt" | "updatedAt">>
): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const result = await collection.findOneAndUpdate(
    {
      _id: toObjectId(id),
      userId: toObjectId(userId)
    } as Document,
    {
      $set: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    },
    {
      returnDocument: "after"
    }
  );

  return result ? serializeResume(result) : null;
}

export async function deleteResumeById(id: string): Promise<boolean> {
  const collection = await getResumeCollection();

  const result = await collection.deleteOne({
    _id: toObjectId(id)
  });

  return result.deletedCount === 1;
}

export async function deleteResumeByIdAndUserId(id: string, userId: string): Promise<boolean> {
  const collection = await getResumeCollection();

  const result = await collection.deleteOne({
    _id: toObjectId(id),
    userId: toObjectId(userId)
  } as Document);

  return result.deletedCount === 1;
}
