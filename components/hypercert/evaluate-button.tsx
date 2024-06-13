"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { TrustedAttestor } from "../../github/types/trusted-attestor.type";
import { useAccount } from "wagmi";

export default function EvaluateButton() {
  const { address } = useAccount();
  const [evaluator, setEvaluator] = useState<TrustedAttestor>();

  useEffect(() => {
    if (address) {
      fetch(`/evaluators/${address}`)
        .then((res) => res.json())
        .then((data) => {
          setEvaluator(data);
        });
    }
  }, [address]);

  const enabled = address && evaluator;

  if (enabled) {
    return <Button>Evaluate this Hypercert</Button>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button disabled={true}>Evaluate this Hypercert</Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Evaluation is only available to the group of trusted evaluators at
          this time.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
