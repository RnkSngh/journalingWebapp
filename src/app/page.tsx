// "use server";

import React, { useEffect, useState } from "react";
import {
  getEntriesCountForToday,
  getTotalEntriesCount,
} from "./actions/actions";
import InfoPage from "@/components/InfoPage";

export default async function Home() {
  // const [entriesToday, setEntriesToday] = useState<number | null>(null);
  // const [entries, setEntries] = useState<number | null>(null);

  // useEffect(() => {
  //   const handleSetEntries = async () => {
  //     const count = await getEntriesCountForToday();
  //     setEntriesToday(count);
  //     const totalCount = await getTotalEntriesCount();
  //     setEntries(totalCount);
  //   };
  //   handleSetEntries();
  // });

  const entries = await getTotalEntriesCount();
  const entriesToday = await getEntriesCountForToday();
  return (
    <div>
      <InfoPage />
      {entries === undefined ? (
        <h1> Loading Info data .. </h1>
      ) : (
        <div>
          <p> Journals Reset at 3:00 AM UTC </p>
          <p> There were {entries} entries submitted Total! </p>
          <p> There were {entriesToday} entries submitted Today! </p>
        </div>
      )}
    </div>
  );
}
