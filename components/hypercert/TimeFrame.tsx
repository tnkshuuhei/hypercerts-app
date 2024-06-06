import * as R from "remeda";

import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";

export default function WorkTimeFrame({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  if (
    !R.isNumber(hypercert.metadata?.work_timeframe_from) ||
    !R.isNumber(hypercert.metadata?.work_timeframe_to)
  ) {
    return null;
  }

  let workTimeFrameFrom = hypercert.metadata?.work_timeframe_from
    ? new Date(hypercert.metadata?.work_timeframe_from)
    : null;
  let workTimeFrameTo = hypercert.metadata.work_timeframe_to
    ? new Date(hypercert.metadata.work_timeframe_to)
    : null;

  return (
    <div className="flex flex-col w-full">
      <span>Work Timeframe</span>
      <p>
        {workTimeFrameFrom && workTimeFrameTo
          ? workTimeFrameFrom.toISOString().substring(0, 10) +
            " → " +
            workTimeFrameTo.toISOString().substring(0, 10)
          : "No work time frame"}
      </p>
    </div>
  );
}
