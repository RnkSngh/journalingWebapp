"use server";
import clientPromise from "../../../lib/db";
import { sha256 } from "../../../lib/hash";
import { RESET_TIME, PROMPTS } from "../config";

export async function addJournalHash(data: FormData) {
  const client = await clientPromise;
  const db = client.db();

  const category = data.get("category");
  const keysArray = Array.from(data.keys());
  const prompt = keysArray.find(
    (key) => key !== "category" && data.get(key) !== ""
  );
  const text = data.get(prompt!);
  let hash = await sha256(text!.toString());
  db.collection("posts").insertOne({
    text,
    hash: hash,
    updatedAt: new Date(),
    prompt: prompt,
    category,
  });

  return hash;
}

// Looks up a corresponding entry from a hash
export async function readEntryFromHash(lookupHash: string) {
  "use server";

  const client = await clientPromise;
  const db = client.db();

  const record = await db.collection("posts").findOne({ hash: lookupHash });
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

  const now = new Date(Date.now() - RESET_TIME);

  const count = await db.collection("posts").countDocuments({
    updatedAt: { $gte: now },
  });
  return count;
}

export async function getTotalEntriesCount() {
  const client = await clientPromise;
  const db = client.db();
  const count = db.collection("posts").estimatedDocumentCount();
  return count;
}

export async function getTodaysPrompts() {
  const weekday = new Date().getDay();
  return PROMPTS.map((prompts) => prompts[weekday % prompts.length]);
}
