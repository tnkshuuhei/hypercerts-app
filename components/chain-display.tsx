"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const ChainDisplay = () => {
  const { address, chain, connector } = useAccount();
  const { switchChain } = useSwitchChain();
  const [chosenChainId, setChosenChainId] = useState<number>(11155111);
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    if (chosenChainId === chain?.id) return;
    switchChain({ chainId: chosenChainId, connector });
  }, [chosenChainId, switchChain, connector, chain?.id]);

  if (!address || !chain) return;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex justify-between space-x-2">
          <span>{chain.name}</span>
          <ChevronDown size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Switch chains</DialogTitle>
        </DialogHeader>
        <ul>
          {Array.from(SUPPORTED_CHAINS.entries()).map(([key, value]) => {
            const isActiveChain = chain?.id === key;
            const activeChainClasses = isActiveChain
              ? "bg-slate-800 text-white"
              : "hover:bg-slate-100 text-primary";
            return (
              <li key={key.toString()}>
                <button
                  className={`p-3 cursor-pointer rounded-sm ${activeChainClasses} font-medium flex items-center justify-between text-base w-full`}
                  onClick={() => setChosenChainId(key)}
                >
                  <span>{value}</span>
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
