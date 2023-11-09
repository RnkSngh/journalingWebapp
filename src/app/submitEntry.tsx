"use client";

import { useEffect, useState } from "react";
import {
  addJournalHash,
  getTodaysPrompts,
  readEntryFromHash,
} from "./actions/actions";
import { RESET_TIME, CATEGORIES } from "./config";
import {
  Textarea,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Box,
  AccordionIcon,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import SubmittedJournalAccordionItem from "@/components/SubmittedJournalAccordionItem";

export type SubmitFormData = FormData & {
  category?: string;
};
type UserEntries = {
  [category: string]: UserEntry;
};

export type CategoryToHash = {
  [category: string]: string;
};

export type UserEntry = {
  text: string;
  prompt: string;
  hash: string;
  category?: string;
  updatedAt?: number;
};

export default function SubmitJournalEntry() {
  const [userEntries, setUserEntries] = useState<UserEntries>({});
  const [prompts, setUserPrompts] = useState([""]);

  useEffect(() => {
    const checkHashes = async (categoriesToHashes: CategoryToHash) => {
      const savedEntries: (UserEntry | undefined)[] = await Promise.all(
        Object.keys(categoriesToHashes)
          .filter((category) => categoriesToHashes[category] !== undefined)
          .map(async (category) => {
            const hash = categoriesToHashes[category];
            const entry = await readEntryFromHash(hash);
            if (entry && entry.updatedAt > RESET_TIME) {
              return {
                text: entry.text,
                hash,
                category,
                prompt: entry.prompt,
              };
            }
          })
      );

      let newUserEntries = { ...userEntries };

      savedEntries.forEach((entry) => {
        if (entry?.category) {
          newUserEntries[entry.category] = entry;
        }
      });
      setUserEntries(newUserEntries);
    };

    const getPrompts = async () => {
      const prompts = await getTodaysPrompts();
      setUserPrompts(prompts);
    };

    const hashDict = localStorage.getItem("journalShare.hashes");
    if (hashDict) {
      checkHashes(JSON.parse(hashDict));
    }
    getPrompts();
  }, []);

  const handleFormSubmit = async (formData: SubmitFormData) => {
    try {
      const category = formData.get("category");
      const keysArray = Array.from(formData.keys());
      const prompt: string | undefined = keysArray.find(
        (key) => key !== "category" && formData.get(key) !== ""
      );

      const text: string | undefined = formData.get(prompt!)?.toString();
      const hash = await addJournalHash(formData);
      const beforeHashMap = localStorage.getItem("journalShare.hashes");
      let newHashMap: CategoryToHash =
        beforeHashMap === null ? {} : JSON.parse(beforeHashMap);
      newHashMap[category!.toString()] = hash;

      localStorage.setItem("journalShare.hashes", JSON.stringify(newHashMap));
      let newEntries: UserEntries = { ...userEntries };

      if (text && prompt) {
        newEntries[category!.toString()] = { hash, text, prompt };
        setUserEntries(newEntries);
      }
    } catch (e) {}
  };

  return (
    <div>
      <form action={handleFormSubmit}>
        <Text fontSize="4xl" color="100" fontFamily="heading">
          Submit Journal Entry
        </Text>
        <label htmlFor="prompts">Choose a prompt:</label>
        <Accordion allowToggle={true}>
          {prompts.map((prompt, index) => {
            return (
              <AccordionItem key={prompt}>
                <Text color="100">
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {CATEGORIES[index]}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel>
                  {userEntries[CATEGORIES[index]] ? (
                    <SubmittedJournalAccordionItem
                      userEntry={userEntries[CATEGORIES[index]]}
                    ></SubmittedJournalAccordionItem>
                  ) : (
                    <>
                      <Text color="100"> {prompt} </Text>
                      <Textarea
                        disabled={Boolean(userEntries[CATEGORIES[index]])}
                        name={prompt}
                        id="submission"
                      />
                      <Button
                        type="submit"
                        name="category"
                        value={CATEGORIES[index]}
                        colorScheme="blue"
                        id="prompt"
                      >
                        Submit Entry
                      </Button>
                    </>
                  )}
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Text color="100" fontFamily="body">
          {" "}
          Submit your Journal Entry here so that you can look it up later{" "}
        </Text>
      </form>
    </div>
  );
}
