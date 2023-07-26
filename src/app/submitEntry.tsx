import { cookies } from "next/headers";
import { useState } from "react";
import clientPromise from "../../lib/db";
import { sha256 } from "../../lib/hash";
import { revalidatePath } from "next/cache";

let hash: string;
export default function SubmitJournalEntry() {
  "use client";

  async function addItem(data: FormData) {
    "use server";

    const client = await clientPromise;
    const db = client.db();
    const journalText = data.get("journal-text-form") as string;
    hash = await sha256(journalText);
    db.collection("posts").insertOne({
      text: data.get("journal-text-form"),
      hash: hash,
    });

    revalidatePath("/");
  }

  return (
    <>
      <form action={addItem}>
        <h1> Submit Journal Text </h1>
        <textarea name="journal-text-form" />
        <button type="submit">Submit Entry</button>
      </form>
      {hash ? (
        <p>
          Submitted! Your hash is : {hash} . Save this and use this to read
          another journal entry!
        </p>
      ) : (
        <p> Submit your Journal Entry to get your hash to look up later </p>
      )}
    </>
  );
}

