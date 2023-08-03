"use client";

import { readEntryFromHash } from "./actions/actions";
import { useEffect, useState } from "react";

export default function RetrieveJournalEntry() {
  const [userEntry, setUserEntry] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const lookForCorrespondingJournal = async (hash: string) => {
      const entry = await readEntryFromHash(hash);
      if (entry?.text) {
        setUserEntry(entry.text);
      } else {
        setErrorMsg("Couldn't find Entry");
      }
    };

    const hash = localStorage.getItem("journalShare.hash");
    if (hash) {
      lookForCorrespondingJournal(hash);
    }
  });

  return (
    <>
      <p>Journal Entry: </p>
      <p>{userEntry}</p>
      {errorMsg && <p> ERROR: {errorMsg}</p>}
    </>
  );
}
