"use client";

import * as R from "remeda";

import { type HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { useEffect, useState } from "react";
import { fromUnixTime } from "date-fns";

export default function WorkTimeFrame({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    setLanguage(window.navigator.language);
  }, []);

  if (
    !R.isNumber(hypercert.metadata?.work_timeframe_from) ||
    !R.isNumber(hypercert.metadata?.work_timeframe_to)
  ) {
    return null;
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(language, {
      dateStyle: "medium",
    }).format(date);

  let workTimeFrameFrom = hypercert.metadata?.work_timeframe_from
    ? fromUnixTime(hypercert.metadata?.work_timeframe_from)
    : null;
  let workTimeFrameTo = hypercert.metadata.work_timeframe_to
    ? fromUnixTime(hypercert.metadata.work_timeframe_to)
    : null;

  const workTimeFrame =
    workTimeFrameFrom && workTimeFrameTo
      ? formatDate(workTimeFrameFrom) === formatDate(workTimeFrameTo)
        ? `${formatDate(workTimeFrameFrom)}`
        : `${formatDate(workTimeFrameFrom)} — ${formatDate(workTimeFrameTo)}`
      : null;

  return (
    <div className="space-y-2 w-full">
      <p className="text-base text-gray-800 font-medium">
        {workTimeFrame ?? "--"}
      </p>
    </div>
  );
}
