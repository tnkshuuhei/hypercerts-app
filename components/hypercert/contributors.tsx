"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import EthAddress from "../eth-address";
import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";
import { useState } from "react";

const MAX_CONTRIBUTORS_DISPLAYED = 5;

export default function Contributors({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!hypercert || !hypercert.metadata?.contributors) return null;

  if (hypercert.metadata?.contributors.length <= MAX_CONTRIBUTORS_DISPLAYED) {
    return (
      <div className="flex flex-col w-full">
        <span>Contributors</span>
        <div>
          {hypercert.metadata?.contributors.map((contributor) => (
            <EthAddress address={contributor} key={contributor} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <span>Contributors</span>
      {!isOpen && (
        <div>
          {hypercert.metadata?.contributors
            .slice(0, MAX_CONTRIBUTORS_DISPLAYED)
            .map((contributor) => (
              <EthAddress address={contributor} key={contributor} />
            ))}
        </div>
      )}
      <Collapsible onOpenChange={setIsOpen}>
        <CollapsibleContent>
          {hypercert.metadata?.contributors.map((contributor) => (
            <EthAddress address={contributor} key={contributor} />
          ))}
        </CollapsibleContent>
        <CollapsibleTrigger>Read more</CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
