// import { getEntriesCountForToday } from "@/app/actions/actions";
import { RESET_TIME } from "@/app/config";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const now = new Date(Date.now() - RESET_TIME);

  const setDbHash = async (parentHash: string, pairedHash: string) => {
    console.log("setting hash", parentHash, pairedHash);
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
    console.log("done setting hash");
  };

  console.log("CRON JOB RUNNING PAIR JOURNAL ENTRIES");
  const sortedDocuments = await db
    .collection("posts")
    .find({ updatedAt: { $gte: now } })
    .sort({ hash: 1 })
    .toArray();

  if (sortedDocuments.length % 2 === 0) {
    await Promise.all(
      sortedDocuments.map(async (item, idx) => {
        if (idx % 2 == 0) {
          await setDbHash(item.hash, sortedDocuments[idx + 1].hash);
          // console.log("pairedHash", sortedDocuments[idx + 1].hash);
        } else {
          await setDbHash(item.hash, sortedDocuments[idx - 1].hash);
          // console.log("pairedhash", sortedDocuments[idx - 1].hash);
        }
      })
    );
  } else if (sortedDocuments.length > 1) {
    await Promise.all(
      sortedDocuments.map(async (item, idx) => {
        if (idx % 2 == 0 && idx < sortedDocuments.length - 1) {
          await setDbHash(item.hash, sortedDocuments[idx + 1].hash);
          // console.log("pairedHash", sortedDocuments[idx + 1].hash);
        } else {
          await setDbHash(item.hash, sortedDocuments[idx - 1].hash);
          // console.log("pairedhash", sortedDocuments[idx - 1].hash);
        }
      })
    );
  }

  return NextResponse.json({ ok: true, body: { documents: sortedDocuments } });
}
