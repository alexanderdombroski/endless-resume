import { MongoClient } from 'mongodb';
import {
  DATABASE_URL,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_CLUSTER
} from '$env/static/private';

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function buildMongoUri() {
  if (DATABASE_URL) {
    return DATABASE_URL;
  }

  const username = encodeURIComponent(DATABASE_USERNAME);
  const password = encodeURIComponent(DATABASE_PASSWORD);

  return `mongodb+srv://${username}:${password}@${DATABASE_CLUSTER}/${DATABASE_NAME}?retryWrites=true&w=majority`;
}

const client = new MongoClient(buildMongoUri());

if (!globalThis.__mongoClientPromise) {
  globalThis.__mongoClientPromise = client.connect();
}

export async function getDb() {
  const client = await globalThis.__mongoClientPromise!;
  return client.db(DATABASE_NAME);
}