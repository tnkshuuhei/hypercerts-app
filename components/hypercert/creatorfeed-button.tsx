"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";
import { isChainIdSupported } from "@/lib/isChainIdSupported";
import { useAccount } from "wagmi";
import { CreatorFeedDrawer } from "./creatorfeed-drawer";

export default function CreatorFeedButton({
  hypercertId,
}: {
  hypercertId: string;
}) {
  const { isConnected, address } = useAccount();

  const { chainId } = useAccount();

  const getTooltipMessage = () => {
    if (!isConnected) {
      return "Connect your wallet to access this feature.";
    }

    if (!isChainIdSupported(chainId)) {
      return "Evaulations are only available on supported chains.";
    }

    return "Evaluation is only available to the group of trusted evaluators at this time.";
  };

  const enabled = address && isChainIdSupported(chainId); // TODO: Add check if user is a creator of the hypercert

  if (enabled) {
    return (
      <Drawer.Root direction="right">
        <Drawer.Trigger asChild>
          <div>
            <Button>Submit Addtional Information</Button>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] mt-24 fixed bottom-0 right-0">
            <div className="p-4 bg-white flex-1 h-full">
              <div className="max-w-md mx-auto flex flex-col gap-5">
                <CreatorFeedDrawer hypercertId={hypercertId} />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button disabled={true}>Submit Addtional Information</Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>{getTooltipMessage()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
