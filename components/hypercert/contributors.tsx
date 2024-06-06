"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import EthAddress from "../eth-address";
import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";
import { isAddress } from "viem";
import { useState } from "react";

const MAX_CONTRIBUTORS_DISPLAYED = 5;

function Contributor({ contributor }: { contributor: string }) {
  return isAddress(contributor) ? (
    <EthAddress address={contributor} />
  ) : (
    <div>{contributor}</div>
  );
}

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
          {hypercert.metadata?.contributors.length === 0 && "No contributors"}
          {hypercert.metadata?.contributors.map((contributor) => (
            <Contributor contributor={contributor} key={contributor} />
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
              <Contributor contributor={contributor} key={contributor} />
            ))}
        </div>
      )}
      <Collapsible onOpenChange={setIsOpen}>
        <CollapsibleContent>
          {hypercert.metadata?.contributors.map((contributor) => (
            <Contributor contributor={contributor} key={contributor} />
          ))}
        </CollapsibleContent>
        <CollapsibleTrigger>Read more</CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
