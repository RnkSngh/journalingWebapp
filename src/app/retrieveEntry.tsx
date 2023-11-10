"use client";

import { usePathname } from "next/navigation";
import { getPairedHashText, readEntryFromHash } from "./actions/actions";
import { useEffect, useState } from "react";
import { Text, Box } from "@chakra-ui/layout";
import { CategoryToHash } from "./submitEntry";
import { CATEGORIES } from "./config";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

type PairedEntries = {
  [hash: string]: PairedEntry;
};

type PairedEntry = {
  prompt?: string;
  text?: string;
  parentHash?: string;
  category?: string;
};

export default function RetrieveJournalEntry() {
  const [pairedEntry, setPairedEntry] = useState("");
  const [pairedEntries, setPairedEntries] = useState<PairedEntries>({});
  const [hashDict, setHashDict] = useState<CategoryToHash>({});
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

    const loadJournalEntries = async (hashDict: CategoryToHash) => {
      const hashes = CATEGORIES.map((category) => hashDict[category]).filter(
        (hash) => hash
      );

      const hashPairings: (PairedEntry | undefined)[] = await Promise.all(
        hashes.map(async (hash) => {
          const pairedHashData = await getPairedHashText(hash);
          if (pairedHashData && pairedHashData.text) {
            return {
              text: pairedHashData.text,
              prompt: pairedHashData.prompt,
              parentHash: hash,
              category: pairedHashData.category,
            };
          }
          return {};
        })
      );

      let newPairedEntries = { ...pairedEntries };
      hashPairings.forEach((pairing) => {
        if (pairing?.category) {
          newPairedEntries[pairing?.category] = {
            text: pairing.text,
            prompt: pairing.prompt,
            category: pairing.category,
          };
        }
      });
      setPairedEntries(newPairedEntries);
    };

    const hashDict = localStorage.getItem("journalShare.hashes");
    if (hashDict) {
      const parsedDict = JSON.parse(hashDict);
      setHashDict(parsedDict);
      loadJournalEntries(parsedDict);
    }
  }, []);

  return (
    <>
      <Text color="100" fontFamily="heading" fontSize="4xl">
        {" "}
        Read a Stranger&apos;s Journal Entry{" "}
      </Text>

      <Accordion allowToggle={true}>
        {CATEGORIES.map((category) => {
          return (
            <AccordionItem key={category}>
              <Text color="100">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    {category}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Text>
              <AccordionPanel>
                {pairedEntries[category] ? (
                  <>
                    <Text color="100" fontFamily="body">
                      You&apos;ve been paired with another stranger&apos;s
                      Journal Entry for the {category} category ! Here it is:{" "}
                    </Text>
                    <Text color="100" fontFamily="mono">
                      Prompt: {pairedEntries[category].prompt}
                    </Text>
                    <Text color="100" fontFamily="mono">
                      {pairedEntries[category].text}
                    </Text>
                  </>
                ) : hashDict[category] ? (
                  <Text color="100" fontFamily="body">
                    {
                      "You've submitted a journal entry but haven't yet been paired with someone. Come back here after 3:00 am UTC to read someone else's entry! "
                    }
                  </Text>
                ) : (
                  <>
                    <Text as="span" color="100" fontFamily="body">
                      Looks like you haven&apos;t submitted a journal entry yet!
                      Submit one
                    </Text>
                    <Text as="span" color="400">
                      {" "}
                      here{" "}
                    </Text>
                  </>
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      {errorMsg && (
        <Text color="100" fontFamily="body">
          {" "}
          ERROR: {errorMsg}
        </Text>
      )}
    </>
  );
}
