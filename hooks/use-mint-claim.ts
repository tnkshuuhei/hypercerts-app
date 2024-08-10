"use client";
import { type StepData } from "@/components/global/step-process-dialog";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import {
  TransferRestrictions,
  type HypercertMetadata,
  AllowlistEntry,
} from "@hypercerts-org/sdk";
import { useState } from "react";
import { TransactionReceipt } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { useWalletClient } from "wagmi";

export const mintSteps: StepData[] = [
  {
    id: "preparing",
    description: "Preparing to mint hypercert...",
  },
  {
    id: "minting",
    description: "Minting hypercert on-chain...",
  },
  {
    id: "confirming",
    description: "Awaiting confirmation...",
  },
  {
    id: "done",
    description: "Minting complete!",
  },
];

interface IuseMintClaim {
  onComplete?: (receipt: TransactionReceipt) => void;
  setCurrentStep?: (step: StepData["id"], errorMessage?: string) => void;
}
export const useMintClaim = ({ onComplete, setCurrentStep }: IuseMintClaim) => {
  const [txPending, setTxPending] = useState(false);

  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: bigint,
    transferRestrictions: TransferRestrictions,
    allowlistRecords?: AllowlistEntry[] | string,
  ) => {
    try {
      setTxPending(true);

      if (!client) {
        setCurrentStep?.("preparing", "No client found");
        console.error("No client found");
        return;
      }

      setCurrentStep?.("minting");
      let hash;
      try {
        hash = await client.mintHypercert({
          metaData,
          totalUnits: units,
          transferRestriction: transferRestrictions,
          allowList: allowlistRecords,
        });
      } catch (error) {
        console.error("Error minting hypercert:", error);
        // setCurrentStep?.("minting", `Error minting hypercert: ${error.message}`);
        throw error; // Re-throw the error to be caught by the outer try-catch
      }

      if (!hash) {
        setCurrentStep?.("minting", "No transaction hash returned");
        console.error("No tx hash returned");
        return;
      }

      setCurrentStep?.("confirming");
      const receipt = await waitForTransactionReceipt(walletClient!, {
        confirmations: 3,
        hash,
      });

      if (receipt?.status === "reverted") {
        setCurrentStep?.("confirming", "Minting failed");
        console.error("Minting failed");
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        console.log("Minting succeeded");
        setCurrentStep?.("done");
        onComplete?.(receipt);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setCurrentStep?.("minting", `Error: ${error.message}`);
      } else {
        setCurrentStep?.("minting", "An unknown error occurred");
      }
      console.error(error);
    } finally {
      setTxPending(false);
    }
  };

  return {
    write: async (
      metaData: HypercertMetadata,
      units: bigint,
      transferRestrictions: TransferRestrictions = TransferRestrictions.FromCreatorOnly,
      allowlistRecords?: AllowlistEntry[] | string,
    ) => {
      await initializeWrite(
        metaData,
        units,
        transferRestrictions,
        allowlistRecords,
      );
    },
    txPending,
    mintSteps,
    readOnly: !client || client.readOnly,
  };
};
