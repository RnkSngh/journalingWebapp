"use client";

import { getPairedHashText} from "./actions/actions";
import { useEffect, useState } from "react";

export default function RetrieveJournalEntry() {
  const [userEntry, setUserEntry] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const lookForCorrespondingJournal = async (hash: string) => {
      const entry = await getPairedHashText(hash);
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
      <p>
        You&apos;ve been paired with another stranger&apos;s Journal Entry! Here
        it is:{" "}
      </p>
      <p>{userEntry}</p>
      {errorMsg && <p> ERROR: {errorMsg}</p>}
    </>
  );
}
