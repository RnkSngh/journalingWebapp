import { getEntriesCountForToday } from "@/app/actions/actions";
import { RESET_TIME } from "@/app/config";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const now = new Date(Date.now() - RESET_TIME);

  console.log("CRON JOB RUNNING PAIR JOURNAL ENTRIES");

  const sortedDocuments = await db
    .collection("posts")
    .find({ updatedAt: { $gte: now } })
    .sort({ hash: 1 });

  console.log("got sorted docs", sortedDocuments);

  return NextResponse.json({ ok: true });
}
