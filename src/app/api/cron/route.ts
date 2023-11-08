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
  if (sortedDocuments.length % 2 === 0) {
    await Promise.all(
      sortedDocuments.map(async (item: any, idx: number) => {
        if (idx % 2 == 0) {
          await setDbHash(item.hash, sortedDocuments[idx + 1].hash);
        } else {
          await setDbHash(item.hash, sortedDocuments[idx - 1].hash);
        }
      })
    );
  } else if (sortedDocuments.length > 1) {
    await Promise.all(
      sortedDocuments.map(async (item: any, idx: number) => {
        if (idx % 2 == 0 && idx < sortedDocuments.length - 1) {
          await setDbHash(item.hash, sortedDocuments[idx + 1].hash);
        } else {
          await setDbHash(item.hash, sortedDocuments[idx - 1].hash);
        }
      })
    );
  }
};

const setDbHash = async (parentHash: string, pairedHash: string) => {
  const client = await clientPromise;
  const db = client.db();

  try {
    await db.collection("posts").updateOne(
      {
        hash: parentHash,
      },
      {
        $set: {
          pairedHash: pairedHash,
        },
      }
    );
  } catch (e) {
    console.log("ERR", e);
  }
};
