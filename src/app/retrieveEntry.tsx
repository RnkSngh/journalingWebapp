import { cookies } from "next/headers";
import clientPromise from "../../lib/db";
import { revalidatePath } from "next/cache";

let entry: string;
export default function RetrieveJournalEntry() {
  "use client";

  const readEntryFromHash = async (data: FormData) => {
    "use server";

    const hash = data.get("journal-lookup-hash") as string;
    const client = await clientPromise;
    const db = client.db();
    entry = (await db.collection("posts").findOne({ hash: hash }))!.text;
    console.log(await db.collection("posts").findOne({ hash: hash }));
    console.log("entry", entry);
    revalidatePath("/");
    return entry;
  };

  return (
    <>
      <form action={readEntryFromHash}>
        <h1> Journal Text </h1>
        <input name="journal-lookup-hash"></input>
        <button>Read Corresponding Entry</button>
      </form>
      <p>Journal Entry: {entry}</p>
    </>
  );
}

