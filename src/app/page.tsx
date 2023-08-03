"use client";

import React, { useEffect, useState } from "react";
import {
  getEntriesCountForToday,
  getTotalEntriesCount,
} from "./actions/actions";

export default function Home() {
  const [entriesToday, setEntriesToday] = useState<number | null>(null);
  const [entries, setEntries] = useState<number | null>(null);

  useEffect(() => {
    const handleSetEntries = async () => {
      const count = await getEntriesCountForToday();
      setEntriesToday(count);
      const totalCount = await getTotalEntriesCount();
      setEntries(totalCount);
    };
    handleSetEntries();
  });

  return (
    <div>
      {" "}
      {entries === undefined ? (
        <h1> Loading .. </h1>
      ) : (
        <div>
          <h1> Version 0.2.</h1>
          <h1> There were {entries} entries submitted Total! </h1>
          <h1> There were {entriesToday} entries submitted Today! </h1>
        </div>
      )}
    </div>
  );
}
