"use client";

import { usePathname } from "next/navigation";
import { getPairedHashText, readEntryFromHash } from "./actions/actions";
import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/layout";

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
        setErrorMsg("Couldn't find your journal Entry");
      }
    };

    const hash = localStorage.getItem("journalShare.hash");
    if (hash) {
      findJournalEntry(hash);
    }
  }, []);

  return (
    <>
      <Text color="100" fontFamily="heading" fontSize="4xl">
        {" "}
        Read a Stranger&apos;s Journal Entry{" "}
      </Text>
      {entrySubmittedAt ? (
        pairedEntry ? (
          <>
            <Text color="100" fontFamily="body">
              You&apos;ve been paired with another stranger&apos;s Journal
              Entry! Here it is:{" "}
            </Text>
            <Text color="100" fontFamily="body">
              {pairedEntry}
            </Text>
          </>
        ) : (
          <Text color="100" fontFamily="body">
            {
              "You've submitted a journal entry but haven't yet been paired with someone. Come back here after 3:00 am UTC to read someone else's entry! "
            }
          </Text>
        )
      ) : (
        <Text color="100" fontFamily="body">
          Looks like you haven&apos;t submitted a journal entry yet! Submit one
          <a href="/submit"> here </a>
        </Text>
      )}
      {errorMsg && (
        <Text color="100" fontFamily="body">
          {" "}
          ERROR: {errorMsg}
        </Text>
      )}
    </>
  );
}
