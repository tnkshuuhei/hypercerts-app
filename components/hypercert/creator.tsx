import { FragmentOf, readFragment } from "gql.tada";

import EthAddress from "../eth-address";
import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";

export default function Creator({ hypercert }: { hypercert: HypercertFull }) {
  if (!hypercert) return null;
  return (
    <div className="flex flex-col items-start w-full">
      <span>Creator</span>
      <div>
        <EthAddress address={hypercert.owner_address} />
      </div>
    </div>
  );
}
