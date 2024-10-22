"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { isChainIdSupported } from "@/lib/isChainIdSupported";
import { useAccount } from "wagmi";
import { SendHorizonal } from "lucide-react";

export default function TransferButton({
  hypercert,
  onClick,
}: {
  hypercert: HypercertFull;
  onClick?: () => void;
}) {
  const { isConnected, address, chainId } = useAccount();
  const owners = hypercert.fractions?.data?.map(
    (fraction) => fraction.owner_address,
  );

  const owner = owners?.find((owner) => owner === address);

  const getTooltipMessage = () => {
    if (!isConnected) {
      return "Connect your wallet to access this feature.";
    }

    if (!isChainIdSupported(chainId)) {
      return "Transfers are only available on supported chains.";
    }

    if (!owner) {
      return "You don't appear to own a fraction of this hypercert.";
    }

    return "Transfers are only available on supported chains.";
  };

  const enabled = address && owner && isChainIdSupported(chainId);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div onClick={enabled ? onClick : undefined}>
            <SendHorizonal
              className={`w-6 h-6 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200 ${enabled ? "" : "stroke-slate-500"}`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>{getTooltipMessage()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
