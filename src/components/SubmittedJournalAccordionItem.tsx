import { UserEntry } from "@/app/submitEntry";
import { Text } from "@chakra-ui/layout";

export default function SubmittedJournalAccordionItem(props: {
  userEntry: UserEntry;
}) {
  return (
    <>
      <Text color="100" fontFamily="body">
        It looks like you already submitted an entry for today! Once matched,
        you can read a stranger's entry <a href="/submit"> here </a>!
      </Text>
      <Text color="100" fontFamily="body">
        {" "}
        Prompt You Answered:{" "}
      </Text>
      <Text color="100" fontFamily="mono">
        {props.userEntry.prompt}{" "}
      </Text>
      <Text color="100" fontFamily="body">
        {" "}
        Your Entry:{" "}
      </Text>
      <Text color="100" fontFamily="mono">
        {props.userEntry.text}
      </Text>
    </>
  );
}
