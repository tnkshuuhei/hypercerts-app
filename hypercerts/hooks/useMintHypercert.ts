import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { generateHypercertIdFromReceipt } from "@/lib/generateHypercertIdFromReceipt";
import {
  AllowlistEntry,
  HypercertMetadata,
  TransferRestrictions,
} from "@hypercerts-org/sdk";
import { useMutation } from "@tanstack/react-query";
import { createElement } from "react";
import type { Chain, TransactionReceipt } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { useAccount, useWalletClient } from "wagmi";

const createExtraContent = (
  receipt: TransactionReceipt,
  hypercertId?: string,
  chain?: Chain,
) => {
  const receiptButton =
    receipt &&
    createElement(
      "a",
      {
        href: `https://${chain?.id === 1 ? "" : `${chain?.name}.`}etherscan.io/tx/${receipt.transactionHash}`,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      createElement(
        Button,
        {
          size: "default",
          className: buttonVariants({ variant: "secondary" }),
        },
        "View transaction",
      ),
    );

  const hypercertButton =
    hypercertId &&
    createElement(
      "a",
      {
        href: `/hypercerts/${hypercertId}`,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      createElement(
        Button,
        {
          size: "default",
          className: buttonVariants({ variant: "default" }),
        },
        "View hypercert",
      ),
    );

  return createElement(
    "div",
    { className: "flex flex-col space-y-2" },
    createElement(
      "p",
      { className: "text-sm font-medium" },
      "Your hypercert has been minted successfully!",
    ),
    createElement(
      "div",
      { className: "flex space-x-4" },
      receiptButton,
      hypercertButton,
    ),
  );
};

export const useMintHypercert = () => {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const { chain } = useAccount();
  const { setDialogStep, setSteps, setOpen, setTitle, setExtraContent } =
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
        console.log({ receipt });
      } catch (error: unknown) {
        console.error("Error waiting for transaction receipt:", error);
        await setDialogStep(
          "confirming",
          "error",
          error instanceof Error ? error.message : "Unknown error",
        );
        throw new Error(
          `Failed to confirm transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      if (receipt?.status === "reverted") {
        throw new Error("Transaction reverted: Minting failed");
      }

      await setDialogStep("route", "active");

      let hypercertId;
      try {
        hypercertId = generateHypercertIdFromReceipt(receipt, chain?.id!);
        console.log({ hypercertId });
      } catch (error) {
        console.error("Error generating hypercert ID:", error);
        await setDialogStep(
          "route",
          "error",
          error instanceof Error ? error.message : "Unknown error",
        );
      }

      const extraContent = createExtraContent(receipt, hypercertId, chain);
      setExtraContent(extraContent);

      await setDialogStep("done", "completed");

      return { hypercertId, receipt, chain };
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
        { id: "route", description: "Creating your new hypercert's link..." },
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