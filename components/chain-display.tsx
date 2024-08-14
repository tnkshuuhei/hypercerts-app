"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supportedChains } from "@/lib/constants";
import { isChainIdSupported } from "@/lib/isChainIdSupported";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";

const ChainDisplay = () => {
  const { address, chain: connectedChain, connector } = useAccount();
  const { switchChain } = useSwitchChain();
  const [chosenChainId, setChosenChainId] = useState<number | undefined>();
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    if (!chosenChainId || chosenChainId === connectedChain?.id) {
      return;
    }

    switchChain({ chainId: chosenChainId, connector });
  }, [chosenChainId, switchChain, connector, connectedChain?.id]);

  if (!address) return;

  const isConnectedChainSupported = isChainIdSupported(connectedChain?.id);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={`flex justify-between space-x-2 border-2 ${
            !isConnectedChainSupported
              ? "border-red-600 bg-red-50"
              : "border-transparent"
          }`}
          size={"sm"}
        >
          <span className="text-sm">
            {connectedChain?.name || "Not connected"}
          </span>
          <ChevronDown size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Switch chains</DialogTitle>
        </DialogHeader>
        <ul>
          {supportedChains.map((chain) => {
            const isActiveChain = connectedChain?.id === chain.id;
            const activeChainClasses = isActiveChain
              ? "bg-slate-800 text-white"
              : "hover:bg-slate-100 text-primary";
            return (
              <li key={chain.id}>
                <button
                  className={`p-3 cursor-pointer rounded-sm ${activeChainClasses} font-medium flex items-center justify-between text-base w-full`}
                  onClick={() => setChosenChainId(chain.id)}
                >
                  <span>{chain.name}</span>
                  {isActiveChain && (
                    <section className="flex gap-2 text-xs items-center text-slate-50">
                      <span>Connected</span>
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    </section>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ChainDisplay;
