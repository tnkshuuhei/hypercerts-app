"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";
import ListDialog from "./list-dialog";
import { StepProcessDialogProvider } from "../global/step-process-dialog";
import { useAccount, useReadContract } from "wagmi";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { useState } from "react";
import { Address } from "viem";

export function ListForSaleButton({ hypercert }: { hypercert: HypercertFull }) {
  const { isConnected, address } = useAccount();
  const { client } = useHypercertClient();

  const contractAddress = hypercert.contract?.contract_address;
  const tokenID = hypercert.token_id ? BigInt(hypercert.token_id) : null;

  console.log("contractAddress", contractAddress);
  console.log("tokenId", tokenID);

  const { data: transferRestrictions } = useReadContract({
    // ! Don't know if we really need to pass the ABI here
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "tokenID", type: "uint256" }],
        name: "readTransferRestriction",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: contractAddress as Address,
    functionName: "readTransferRestriction",
    args: [tokenID!],
    query: {
      enabled: !!contractAddress && !!tokenID,
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const hypercertId = hypercert.hypercert_id;
  const fractions = hypercert.fractions?.data || [];
  const fractionsOwnedByUser = fractions.filter(
    (fraction) => fraction.owner_address === address,
  );

  const disabled =
    !hypercert ||
    !hypercertId ||
    !client ||
    !client.isClaimOrFractionOnConnectedChain(hypercertId) ||
    !fractionsOwnedByUser.length ||
    transferRestrictions === "DisallowAll" ||
    (transferRestrictions === "FromCreatorOnly" &&
      address?.toLocaleLowerCase() !== hypercert.creator_address);

  const getToolTipMessage = () => {
    if (!hypercert || !hypercertId) return;

    if (!isConnected || !address) {
      return "Connect your wallet to access this feature";
    }

    if (!client) {
      return "Hypercert client is not connected";
    }

    if (!client.isClaimOrFractionOnConnectedChain(hypercertId)) {
      return "This hypercert is not on the connected chain";
    }

    if (!fractionsOwnedByUser.length) {
      return "You do not own any fractions of this hypercert";
    }

    if (transferRestrictions === "DisallowAll") {
      return "Secondary sales are not allowed for this hypercert";
    }

    if (transferRestrictions === "FromCreatorOnly") {
      return "Only the creator can sell this hypercert";
    }

    return null;
  };

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button disabled>List for sale</Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>{getToolTipMessage()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>List for sale</Button>
      <StepProcessDialogProvider>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <ListDialog hypercert={hypercert} setIsOpen={setIsOpen} />
        </Dialog>
      </StepProcessDialogProvider>
    </>
  );
}
