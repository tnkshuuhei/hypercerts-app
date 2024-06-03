import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";

interface HypercertMiniDisplayProps {
  hypercertId: string;
  name: string;
  image: string;
  hasTrustedEvaluator: boolean;
  percentAvailable: number;
  lowestPrice: string;
}

const HypercertMiniDisplay = ({
  hypercertId,
  name,
  image,
  hasTrustedEvaluator,
  percentAvailable,
  lowestPrice,
}: HypercertMiniDisplayProps) => {
  return (
    <Link href={`/hypercert/${hypercertId}`}>
      <article
        className="w-[275px] rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 bg-slate-800 relative"
        title={name}
      >
        {image && (
          <div className="relative h-[170px] w-full rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={name}
              unoptimized
              fill
              objectFit="cover"
              objectPosition="top"
            />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <p className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white tracking-wide">
            Sepolia Testnet
          </p>
        </div>
        <section className="p-3 bg-white text-primary overflow-hidden rounded-lg border-[1.5px] border-slate-500 space-y-3">
          <div className="flex gap-1 items-center justify-between">
            <p className="flex-1 text-sm font-semibold line-clamp-1 text-ellipsis">
              {name}
            </p>
            {hasTrustedEvaluator && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <ShieldCheck size={12} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="bg-green-600 text-white"
                  >
                    <small>Evaluated by a trusted attester</small>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <hr className="border-t-[1.5px] border-slate-300" />
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-slate-700 font-semibold">
                {percentAvailable}%
              </p>
              <p className="text-xs text-slate-500">Available</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-700 font-semibold">
                {lowestPrice}
              </p>
              <p className="text-xs text-slate-500">Lowest per %</p>
            </div>
          </div>
        </section>
      </article>
    </Link>
  );
};

export { HypercertMiniDisplay as default };
