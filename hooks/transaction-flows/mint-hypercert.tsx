import { useTransaction } from "@/contexts/TransactionProvider";
import { useMintClaim, mintSteps } from "@/hooks/use-mint-claim";
import { useEffect } from "react";
import {
  StepData,
  useStepProcessDialogContext,
} from "@/components/global/step-process-dialog";
import type {
  AllowlistEntry,
  HypercertMetadata,
  TransferRestrictions,
} from "@hypercerts-org/sdk";

export const useMintHypercertFlow = () => {
  const { setTransactionSteps } = useTransaction();
  const { setOpen, setSteps, setTitle, setDialogStep } =
    useStepProcessDialogContext();
  const { write: mintClaimWrite, ...mintClaimProps } = useMintClaim({
    onComplete: () => {
      setDialogStep(mintSteps[mintSteps.length - 1].id); // Set the last step as completed
    },
    setCurrentStep: (stepId, errorMessage) => {
      setDialogStep(stepId, errorMessage);
    },
  });

  useEffect(() => {
    setSteps(mintSteps);
    setTransactionSteps(mintSteps);
    setTitle("Minting Hypercert");
  });

  const write = async (
    metaData: HypercertMetadata,
    units: bigint,
    transferRestrictions: TransferRestrictions,
    allowlistRecords?: AllowlistEntry[] | string,
  ) => {
    setOpen(true);
    setDialogStep(mintSteps[0].id); // Set the first step as active
    await mintClaimWrite(
      metaData,
      units,
      transferRestrictions,
      allowlistRecords,
    );
  };

  return {
    write,
    ...mintClaimProps,
  };
};
