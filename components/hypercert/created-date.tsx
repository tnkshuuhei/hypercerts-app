import FormattedDate from "../formatted-date";
import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";

export default function CreatedDate({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  return (
    <div className="flex flex-col w-full">
      <span>Created on</span>
      <p>
        <FormattedDate seconds={hypercert.creation_block_timestamp} />
      </p>
    </div>
  );
}
