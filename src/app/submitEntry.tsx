"use client";

import { useEffect, useState } from "react";
import { addJournalHash, readEntryFromHash } from "./actions/actions";
import { RESET_TIME } from "./config";

export default function SubmitJournalEntry() {
  const [userHash, setUserHash] = useState("");

  useEffect(() => {
    const checkHash = async (hash: string) => {
      const entry = await readEntryFromHash(hash);

      if (entry) {
        if (Date.now() - entry!.createdAt > RESET_TIME) {
          localStorage.setItem("journalShare.hash", "");
        } else {
          setUserHash(entry.hash);
        }
      }
    };

    const hash = localStorage.getItem("journalShare.hash");
    if (hash) {
      checkHash(hash);
    }
  });

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const hash = await addJournalHash(formData);
      localStorage.setItem("journalShare.hash", hash);
      setUserHash(hash);
    } catch (e) {}
  };

  return (
    <div className="pl-10 pt-10">
      <form action={handleFormSubmit}>
        <h1> Submit Journal Text </h1>
        <textarea className="w-500" name="journal-text-form" />

        {userHash ? (
          <p>
            You already submitted an entry for today! Go to ./lookup to see a
            how a stranger&apos;s day was!
          </p>
        ) : (
          <p> Submit your Journal Entry to get your hash to look up later </p>
        )}
        <button
          type="submit"
          className="bg-blue-200 flex rounded-full flex-nowrap"
        >
          Submit Entry
        </button>
      </form>
    </div>
  );
}
