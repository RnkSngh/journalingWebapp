// import { getEntriesCountForToday } from "@/app/actions/actions";
import { RESET_TIME } from "@/app/config";
import clientPromise from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const now = new Date(Date.now() - RESET_TIME);

  console.log("CRON JOB RUNNING PAIR JOURNAL ENTRIES");
  const sortedAggregate = db.collection("posts").aggregate([
    {
      $match: {
        updatedAt: {
          $gte: now,
        },
      },
    },
    {
      $sort: { hash: 1 },
    },
    {
      $group: {
        _id: "$prompt",
        entries: {
          $push: {
            text: "$text",
            prompt: "$prompt",
            hash: "$hash",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
  ]);

  for await (const doc of sortedAggregate) {
    console.log("document", doc);
    await pairAndSend(doc.entries);
  }
  return NextResponse.json({ ok: true, body: { success: true } });
}

const pairAndSend = async (sortedDocuments: any) => {
  let pinkySwear: Array<Promise<void>> = []; // Named pinkySwear because Sasha said so
  let index = sortedDocuments.length - 1;
  while (index > 0) {
    if (index == 2) {
      // When index is 2, there are 3 elements left, meaning index 0 also needs to be paired.
      // Index can only be equal to 2 on odd length sortedDocuments

      pinkySwear.push(setDbHash(sortedDocuments[0], sortedDocuments[1]));
    }
    const left = sortedDocuments[index - 1];
    const right = sortedDocuments[index];
    pinkySwear.push(setDbHash(left.hash, right.hash));
    index -= 2;
  }

  await Promise.all(pinkySwear);
};

const setDbHash = async (pairedHash1: string, pairedHash2: string) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    await db.collection("posts").updateOne(
      {
        hash: pairedHash1,
      },
      {
        $set: {
          pairedHash: pairedHash2,
        },
      }
    );
    await db.collection("posts").updateOne(
      {
        hash: pairedHash2,
      },
      {
        $set: {
          pairedHash: pairedHash1,
        },
      }
    );
  } catch (e) {
    console.log("ERR", e);
  }
};
