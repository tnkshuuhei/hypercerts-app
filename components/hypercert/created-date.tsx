import FormattedDate from "../formatted-date";
import { type HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";

export default function CreatedDate({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  return (
    <div className="flex flex-col w-full">
      <span>Created on</span>
      <FormattedDate seconds={hypercert.block_number} />
    </div>
  );
}
