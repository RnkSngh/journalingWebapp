"use client";

import { useEffect, useState } from "react";
import { addJournalHash, readEntryFromHash } from "./actions/actions";
import { RESET_TIME } from "./config";

export default function SubmitJournalEntry() {
  const [userEntry, setUserEntry] = useState("");

  useEffect(() => {
    console.log("submitEntry use effect");
    const checkHash = async (hash: string) => {
      const entry = await readEntryFromHash(hash);

      if (entry) {
        console.log(
          "date comparision",
          Date.now() - entry.updatedAt,
          RESET_TIME
        );
        if (Date.now() - entry.updatedAt > RESET_TIME) {
          localStorage.setItem("journalShare.hash", "");
        } else {
          setUserEntry(entry.text);
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
      setUserEntry(hash);
    } catch (e) {}
  };

  return (
    <div>
      <form action={handleFormSubmit}>
        <h1> Submit Journal Entry </h1>
        {!userEntry && (
          <>
            <p>
              {" "}
              Submit your Journal Entry here so that you can look it up later{" "}
            </p>
            <textarea
              disabled={Boolean(userEntry)}
              className="w-500"
              name="journal-text-form"
            />
          </>
        )}

        {userEntry ? (
          <div>
            <p>
              It looks like you already submitted an entry for today! Once
              matched, you can read a stranger&apos;s entry{" "}
              <a href="/submit"> here </a>!
            </p>
            <p> {userEntry} </p>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-blue-200 flex rounded-full flex-nowrap"
          >
            Submit Entry
          </button>
        )}
      </form>
    </div>
  );
}
