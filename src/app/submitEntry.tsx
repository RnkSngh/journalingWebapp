"use client";

import { useEffect, useState } from "react";
import {
  addJournalHash,
  getTodaysPrompts,
  readEntryFromHash,
} from "./actions/actions";
import { RESET_TIME } from "./config";
import { Select, Textarea, Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";

export default function SubmitJournalEntry() {
  const [userEntry, setUserEntry] = useState("");
  const [userEntryPrompt, setUserEntryPrompt] = useState("");
  const [prompts, setUserPrompts] = useState([""]);

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
          if (entry.prompt) {
            setUserEntryPrompt(entry.prompt);
          }
        }
      }
    };

    const getPrompts = async () => {
      const prompts = await getTodaysPrompts();
      console.log("setting user prompts", prompts);
      setUserPrompts(prompts);
    };

    const hash = localStorage.getItem("journalShare.hash");
    if (hash) {
      checkHash(hash);
    }
    getPrompts();
  }, [userEntry]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      console.log("form data", formData);
      const hash = await addJournalHash(formData);
      localStorage.setItem("journalShare.hash", hash);
      setUserEntry(hash);
    } catch (e) {}
  };

  return (
    <div>
      <form action={handleFormSubmit}>
        <Text fontSize="4xl" color="100" fontFamily="heading">
          Submit Journal Entry
        </Text>
        {!userEntry && (
          <>
            <label htmlFor="prompts">Choose a prompt:</label>
            <Select name="prompts" id="prompts">
              {prompts.map((prompt) => {
                return (
                  <option key={prompt} value={prompt}>
                    {prompt}
                  </option>
                );
              })}
            </Select>
            <Text color="100" fontFamily="body">
              {" "}
              Submit your Journal Entry here so that you can look it up later{" "}
            </Text>
            <Textarea
              disabled={Boolean(userEntry)}
              className="w-500"
              name="journal-text-form"
            />
          </>
        )}

        {userEntry ? (
          <div>
            <Text color="100" fontFamily="body">
              It looks like you already submitted an entry for today! Once
              matched, you can read a stranger's entry{" "}
              <a href="/submit"> here </a>!
            </Text>
            <Text color="100" fontFamily="body">
              {" "}
              Prompt You Answered:{" "}
              <Text color="100" fontFamily="mono">
                {userEntryPrompt}{" "}
              </Text>
            </Text>
            <Text color="100" fontFamily="body">
              {" "}
              Your Entry:{" "}
            </Text>
            <Text color="100" fontFamily="mono">
              {userEntry}
            </Text>
          </div>
        ) : (
          <Button type="submit" className="bg-green-300 " colorScheme="teal">
            Submit Entry
          </Button>
        )}
      </form>
    </div>
  );
}
