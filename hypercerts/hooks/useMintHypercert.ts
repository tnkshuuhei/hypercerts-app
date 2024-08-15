import {
  type StepState,
  useStepProcessDialogContext,
} from "@/components/global/step-process-dialog";
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
    onError: async (e) => {
      console.error(e);
      await setDialogStep("minting", "error", e.message);
      toast({
        title: "Error",
        description: e.message,
        duration: 5000,
      });
    },
    onSuccess: async (hash) => {
      await setDialogStep("confirming", "active");
      let receipt;

      try {
        receipt = await waitForTransactionReceipt(walletClient!, {
          confirmations: 3,
          hash,
        });
      } catch (error: unknown) {
        console.error("Error waiting for transaction receipt:", error);
        setOpen(false);
        throw new Error(
          `Failed to confirm transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      if (receipt?.status === "reverted") {
        throw new Error("Transaction reverted: Minting failed");
      }

      await setDialogStep("done", "completed");
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
      setSteps([
        { id: "preparing", description: "Preparing to mint hypercert..." },
        { id: "minting", description: "Minting hypercert on-chain..." },
        { id: "confirming", description: "Waiting for on-chain confirmation" },
        { id: "done", description: "Minting complete!" },
      ]);
      setTitle("Minting hypercert");
      await setDialogStep("preparing", "active");
      console.log("preparing...");

      let hash;
      try {
        await setDialogStep("minting", "active");
        console.log("minting...");
        hash = await client.mintHypercert({
          metaData,
          totalUnits: units,
          transferRestriction: transferRestrictions,
          allowList: allowlistRecords,
        });
      } catch (error: unknown) {
        console.error("Error minting hypercert:", error);
        throw new Error(
          `Failed to mint hypercert: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      if (!hash) {
        throw new Error("No transaction hash returned");
      }

      return hash;
    },
  });
};
