import { type HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import EthAddress from "../eth-address";

export default function Creator({ hypercert }: { hypercert: HypercertFull }) {
  if (!hypercert) return null;
  return (
    <div className="flex items-center space-x-1 text-sm text-slate-500 font-medium">
      {hypercert.creator_address && (
        <div className="flex space-x-1 items-center">
          <span>by</span>
          <EthAddress address={hypercert.creator_address} />
        </div>
      )}
      {hypercert?.block_number && (
        <div className="flex space-x-2 items-center">
          <span>•</span>
          <span>{hypercert.block_number}</span>
        </div>
      )}
    </div>
  );
}
