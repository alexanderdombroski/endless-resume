// src/lib/db/models/resume.model.ts
import { ObjectId, type Collection } from "mongodb";
import { getDb } from "$lib/db/mongo";
import { ResumeSchema, type CreateResumeInput, type Resume } from "$lib/schemas";

const COLLECTION_NAME = "resumes";

export type ResumeDocument = Omit<Resume, "_id"> & {
  _id: ObjectId;
};

function serializeResume(doc: ResumeDocument): Resume {
  return ResumeSchema.parse({
    ...doc,
    _id: doc._id.toHexString()
  });
}

function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid resume ID");
  }

  return new ObjectId(id);
}

async function getResumeCollection(): Promise<Collection<ResumeDocument>> {
  const db = await getDb();
  return db.collection<ResumeDocument>(COLLECTION_NAME);
}

export async function findResumesByUserId(userId: string): Promise<Resume[]> {
  const collection = await getResumeCollection();

  const documents = await collection
    .find({
      user_id: userId
    })
    .sort({
      updatedAt: -1
    })
    .toArray();

  return documents.map(serializeResume);
}

export async function findResumeById(id: string): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const document = await collection.findOne({
    _id: toObjectId(id)
  });

  return document ? serializeResume(document) : null;
}

export async function findResumeByIdAndUserId(id: string, userId: string): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const document = await collection.findOne({
    _id: toObjectId(id),
    user_id: userId
  });

  return document ? serializeResume(document) : null;
}

export async function createResume(data: CreateResumeInput, userId: string): Promise<Resume> {
  const collection = await getResumeCollection();
  const now = new Date().toISOString();

  const document: ResumeDocument = {
    ...data,
    _id: new ObjectId(),
    user_id: userId,
    createdAt: now,
    updatedAt: now
  };

  await collection.insertOne(document);

  return serializeResume(document);
}

export async function updateResumeById(
  id: string,
  data: Partial<CreateResumeInput>
): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const result = await collection.findOneAndUpdate(
    {
      _id: toObjectId(id)
    },
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
  data: Partial<CreateResumeInput>
): Promise<Resume | null> {
  const collection = await getResumeCollection();

  const result = await collection.findOneAndUpdate(
    {
      _id: toObjectId(id),
      user_id: userId
    },
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
    user_id: userId
  });

  return result.deletedCount === 1;
}
