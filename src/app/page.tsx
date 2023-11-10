"use server";

import {
  getEntriesCountForToday,
  getTotalEntriesCount,
} from "./actions/actions";
import { Text} from "@chakra-ui/layout";
import InfoPage from "@/components/InfoPage";

export default async function Home() {
  const entries = await getTotalEntriesCount();
  const entriesToday = await getEntriesCountForToday();
  return (
    <>
      <Text fontSize="4xl" color="100" fontFamily="heading">
        {" "}
        Hi ... What is this?{" "}
      </Text>
      <InfoPage />
      {entries === undefined ? (
        <h1> Loading Info data .. </h1>
      ) : (
        <div>
          <Text color="100" fontSize="2xl">
            {" "}
            Stats{" "}
          </Text>
          <Text color="100" fontFamily="body">
            {" "}
            Journals Reset at 3:00 AM UTC{" "}
          </Text>
          <Text color="100" fontFamily="body">
            {" "}
            There were {entries} entries submitted Total!{" "}
          </Text>

          <Text color="100" fontFamily="body">
            {" "}
            There were {entriesToday} entries submitted Today!{" "}
          </Text>
        </div>
      )}
    </>
  );
}
