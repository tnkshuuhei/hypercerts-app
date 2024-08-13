import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import { useMutation } from "@tanstack/react-query";
import {
  HypercertMetadata,
  TransferRestrictions,
  AllowlistEntry,
} from "@hypercerts-org/sdk";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { waitForTransactionReceipt } from "viem/actions";
import { useWalletClient } from "wagmi";
import { toast } from "@/components/ui/use-toast";

export const useMintHypercert = () => {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const { setDialogStep, setSteps, setOpen, setTitle } =
    useStepProcessDialogContext();

  return useMutation({
    mutationKey: ["MINT_HYPERCERT"],
    scope: { id: "MINT_HYPERCERT" }, // Ensure only one instance runs
    onError: (e) => {
      console.error(e);
      toast({
        title: "Error",
        description: e.message,
        duration: 5000,
      });
    },
    onSuccess: async (hash) => {
      setDialogStep("confirming");
      let receipt;

      try {
        receipt = await waitForTransactionReceipt(walletClient!, {
          confirmations: 3,
          hash,
        });
      } catch (error: unknown) {
        console.error("Error waiting for transaction receipt:", error);
        setOpen(false);
        if (error instanceof Error) {
          throw new Error(`Failed to confirm transaction: ${error.message}`);
        } else {
          throw new Error("Failed to confirm transaction: Unknown error");
        }
      }

      if (receipt?.status === "reverted") {
        setOpen(false);
        throw new Error("Transaction reverted: Minting failed");
      }

      setDialogStep("done", "completed");
      return receipt;
    },
    mutationFn: async ({
      metaData,
      units,
      transferRestrictions,
      allowlistRecords,
    }: {
      metaData: HypercertMetadata;
      units: bigint;
      transferRestrictions: TransferRestrictions;
      allowlistRecords?: AllowlistEntry[] | string;
    }) => {
      if (!client) {
        setOpen(false);
        throw new Error("No client found");
      }

      setOpen(true);
      setTitle("Minting Hypercert");
      setSteps([
        { id: "preparing", description: "Preparing to mint hypercert..." },
        { id: "minting", description: "Minting hypercert on-chain..." },
        { id: "confirming", description: "Waiting for on-chain confirmation" },
        { id: "done", description: "Minting complete!" },
      ]);
      setDialogStep("preparing");

      let hash;
      try {
        setDialogStep("minting");
        hash = await client.mintHypercert({
          metaData,
          totalUnits: units,
          transferRestriction: transferRestrictions,
          allowList: allowlistRecords,
        });
      } catch (error: unknown) {
        console.error("Error minting hypercert:", error);
        setOpen(false);
        if (error instanceof Error) {
          throw new Error(`Failed to mint hypercert: ${error.message}`);
        } else {
          throw new Error("Failed to mint hypercert: Unknown error");
        }
      }

      if (!hash) {
        setOpen(false);
        throw new Error("No transaction hash returned");
      }

      return hash;
    },
  });
};
