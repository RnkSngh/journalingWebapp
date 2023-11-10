"use client";
import {
  Text,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
} from "@chakra-ui/layout";
import { CheckIcon } from "@chakra-ui/icons";
import { CATEGORIES } from "@/app/config";

const JOURNAL_TIPS = [
  "Don't be afraid to be vulnerable! How are you feeling, what happened today that was noteworthy?",
  "Try to keep it anonymous as possible! It's easier to do the above step when you are worrying less about who might read it.",
  "If you run out of things to write about, or if you can't come up with anything notable that happened, feel free to share a link (e.g. a video or song or post) that you've enjoyed recently, or talk more generally about yourself (e.g. what do you like most about yourself) or about people you admire.",
];

export default function InfoPage() {
  return (
    <>
      <Text fontFamily="body" color="100">
        {" "}
        What would it be like to live a day in the life of a stranger? Well you
        can find out here!
      </Text>
      <Text fontFamily="body" color="100">
        {" "}
        Each day, you can submit a journal entry for each category. Each
        category has a prompt (which can change each day). If you&apos;d rather
        write something that&apos;s free-form, rather than addressing a prompt,
        there&apos;s a &quot;General&quot; category as well. You can submit
        entries for as many (or as little) categories as you&apos;d like.
      </Text>
      <Text color="100"> The current Categories Are:</Text>
      <UnorderedList>
        {CATEGORIES.map((item) => {
          return <ListItem key={item}> {item} </ListItem>;
        })}
      </UnorderedList>
      <Text fontFamily="body" color="100">
        At the end of the day, every entry you submit will be paired with
        someone else&apos;s from the same category. You will be able to read
        another person&apos;s entries and they will be able to read yours! Both
        are anonymous - so you won&apos;t be able to tell who it was just based
        on the match (But maybe based on the content of your journal entry){" "}
      </Text>
      <Text fontFamily="body" color="100">
        To make things interesting, I&apos;d recommend following the{" "}
        <a href="/"> guidelines for connecting with strangers</a>
      </Text>

      {""}
      <Text fontFamily="body" color="100">
        {" "}
        Journal Entry writing Guidelines
      </Text>
      <List>
        {JOURNAL_TIPS.map((item) => {
          return (
            <ListItem key={item}>
              <ListIcon as={CheckIcon} color="100" />
              {item}
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
