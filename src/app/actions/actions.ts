"use server";
import clientPromise from "../../../lib/db";
import { sha256 } from "../../../lib/hash";
import { RESET_TIME } from "../config";

export async function addJournalHash(data: FormData) {
  const client = await clientPromise;
  const db = client.db();
  const journalText = data.get("journal-text-form") as string;
  let hash = await sha256(journalText);
  db.collection("posts").insertOne({
    text: data.get("journal-text-form"),
    hash: hash,
    updatedAt: new Date(),
  });

  return hash;
}

// Looks up a corresponding entry from a hash
export async function readEntryFromHash(lookupHash: string) {
  "use server";

  const hash = lookupHash;
  const client = await clientPromise;
  const db = client.db();

  const record = await db.collection("posts").findOne({ hash: hash });
  return record;
}

// Looks up a corresponding entry from a hash
export async function getPairedHashText(lookupHash: string) {
  "use server";

  const hash = lookupHash;
  const client = await clientPromise;
  const db = client.db();

  const record = await db.collection("posts").findOne({ hash: hash });

  if (record && record.pairedHash) {
    const pairedRecord = await db
      .collection("posts")
      .findOne({ hash: record.pairedHash });
    return pairedRecord;
  } else {
    return { text: "" };
  }
}

// Returns the total amount of entries from the past time
export async function getEntriesCountForToday() {
  const client = await clientPromise;
  const db = client.db();

  // const current = Date,();
  const now = new Date(Date.now() - RESET_TIME);
  console.log("entriesfrom today", new Date(), now);
  // now.toISOString();

  const count = await db.collection("posts").countDocuments({
    updatedAt: { $gte: now },
  });
  console.log("count", count);
  return count;
}

export async function getTotalEntriesCount() {
  const client = await clientPromise;
  const db = client.db();
  const count = db.collection("posts").estimatedDocumentCount();
  return count;
}
