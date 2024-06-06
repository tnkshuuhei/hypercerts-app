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

const MAX_FRACTIONS_DISPLAYED = 5;

function Fraction({
  ownerAddress,
  units,
}: {
  ownerAddress: string | null;
  units: unknown;
}) {
  return (
    <div className="flex flex-col w-full">
      {ownerAddress} owns {units as string} units
    </div>
  );
}

export default function Fractions({ hypercert }: { hypercert: HypercertFull }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!hypercert || !hypercert.fractions?.data) return null;

  console.log(hypercert.fractions.data);

  if (hypercert.fractions.data.length <= MAX_FRACTIONS_DISPLAYED) {
    return (
      <div className="flex flex-col w-full">
        <span>Ownership</span>
        <div>
          {hypercert.fractions.data.map((fraction) => (
            <Fraction
              ownerAddress={fraction.owner_address}
              units={fraction.units}
              key={fraction.owner_address}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <span>Ownership</span>
      {!isOpen && (
        <div>
          {hypercert.fractions.data
            .slice(0, MAX_FRACTIONS_DISPLAYED)
            .map((fraction) => (
              <Fraction
                ownerAddress={fraction.owner_address}
                units={fraction.units}
                key={fraction.owner_address}
              />
            ))}
        </div>
      )}
      <Collapsible onOpenChange={setIsOpen}>
        <CollapsibleContent>
          {hypercert.fractions.data.map((fraction) => (
            <Fraction
              ownerAddress={fraction.owner_address}
              units={fraction.units}
              key={fraction.owner_address}
            />
          ))}
        </CollapsibleContent>
        <CollapsibleTrigger>Read more</CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
