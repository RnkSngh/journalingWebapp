"use client";

import { usePathname } from "next/navigation";
import { getPairedHashText, readEntryFromHash } from "./actions/actions";
import { useEffect, useState } from "react";

export default function RetrieveJournalEntry() {
  const [pairedEntry, setPairedEntry] = useState("");
  const [entrySubmittedAt, setEntrySubmittedAt] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const findJournalEntry = async (hash: string) => {
      const entry = await readEntryFromHash(hash);

      if (entry && entry.updatedAt) {
        setEntrySubmittedAt(entry!.updatedAt);
        const pairedHashText = await getPairedHashText(hash);
        if (pairedHashText?.text) {
          setPairedEntry(pairedHashText.text);
        }
      } else {
        setErrorMsg("Couldn&apos;t find your jouranl Entry");
      }
    };

    const hash = localStorage.getItem("journalShare.hash");
    if (hash) {
      findJournalEntry(hash);
    }
  }, []);

  return (
    <>
      <h1> Read a Stranger&apos;s Journal Entry </h1>
      {entrySubmittedAt ? (
        pairedEntry ? (
          <>
            <p>
              You&apos;ve been paired with another stranger&apos;s Journal
              Entry! Here it is:{" "}
            </p>
            <p>{pairedEntry}</p>
          </>
        ) : (
          <p>
            {" "}
            You&apos;ve submitted a journal entry but haven&apos;t yet been
            paired with someone. Come back here after 3:00 am UTC to read
            someone else&apos;s entry!{" "}
          </p>
        )
      ) : (
        <p>
          Looks like you haven&apos;t submitted a journal entry yet! Submit one
          <a href="/submit"> here </a>
        </p>
      )}
      {errorMsg && <p> ERROR: {errorMsg}</p>}
    </>
  );
}
