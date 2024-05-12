"use client";
import { useState } from "react";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { usePublicClient } from "wagmi";
import {
  type HypercertMetadata,
  TransferRestrictions,
} from "@hypercerts-org/sdk";

export const useMintClaim = ({ onComplete }: { onComplete?: () => void }) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();
  const publicClient = usePublicClient();

  const stepDescriptions = {
    preparing: "Preparing to mint hypercert",
    minting: "Minting hypercert on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done minting",
  };

  // const { setStep, showModal, hideModal } = useContractModal();
  // const parseError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
    transferRestrictions: TransferRestrictions
  ) => {
    // setStep("minting");
    try {
      setTxPending(true);

      if (!client) {
        // toast("No client found", {
        //   type: "error",
        // });
        console.error("No client found");
        return;
      }

      const hash = await client.mintClaim(
        metaData,
        BigInt(units),
        transferRestrictions
      );

      if (!hash) {
        // toast("No tx hash returned", {
        //   type: "error",
        // });
        console.error("No tx hash returned");
        return;
      }

      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash,
      });

      // setStep("waiting");

      if (receipt?.status === "reverted") {
        // toast("Minting failed", {
        //   type: "error",
        // });
        console.error("Minting failed");
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        // toast(mintInteractionLabels.toastSuccess, { type: "success" });
        console.log("Minting succeeded");

        // setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      // toast(parseError(error, mintInteractionLabels.toastError), {
      //   type: "error",
      // });
      console.error(error);
    } finally {
      // hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async (
      metaData: HypercertMetadata,
      units: number,
      transferRestrictions: TransferRestrictions = TransferRestrictions.FromCreatorOnly
    ) => {
      // showModal({ stepDescriptions });
      // setStep("preparing");
      console.log("Minting hypercert");
      await initializeWrite(metaData, units, transferRestrictions);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
