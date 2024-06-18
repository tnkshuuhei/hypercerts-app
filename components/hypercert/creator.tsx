import { type HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import EthAddress from "../eth-address";
import { Cuboid } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export default function Creator({ hypercert }: { hypercert: HypercertFull }) {
  if (!hypercert) return null;
  return (
    <div className="flex flex-wrap items-center space-x-1 text-sm text-slate-600 font-medium">
      {hypercert.creator_address && (
        <div className="flex space-x-1 items-center">
          <span>by</span>
          <EthAddress address={hypercert.creator_address} />
        </div>
      )}
      {hypercert.contract?.chain_id && (
        <div className="flex space-x-2 items-center">
          <span className="text-slate-400">•</span>
          <span>
            {SUPPORTED_CHAINS.get(Number(hypercert.contract?.chain_id))}
          </span>
        </div>
      )}
      {hypercert?.block_number && (
        <div className="flex space-x-2 items-center">
          <span className="text-slate-400"> — </span>
          <span
            className="flex space-x-1 items-center"
            title={`Minted on block ${hypercert.block_number}`}
            aria-label={`Minted on block ${hypercert.block_number}`}
          >
            <Cuboid className="w-4 h-4" />
            <p>{hypercert.block_number}</p>
          </span>
        </div>
      )}
    </div>
  );
}
