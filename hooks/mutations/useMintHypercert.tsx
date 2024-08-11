import { useMutation } from "@tanstack/react-query";
import {
  HypercertMetadata,
  TransferRestrictions,
  AllowlistEntry,
} from "@hypercerts-org/sdk";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { waitForTransactionReceipt } from "viem/actions";
import { useWalletClient } from "wagmi";

export const useMintHypercert = () => {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationKey: ["MINT_HYPERCERT"],
    scope: {
      id: "MINT_HYPERCERT",
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
      try {
        if (!client) {
          throw new Error("No client found");
        }

        let hash;
        try {
          hash = await client.mintHypercert({
            metaData,
            totalUnits: units,
            transferRestriction: transferRestrictions,
            allowList: allowlistRecords,
          });
        } catch (error: unknown) {
          console.error("Error minting hypercert:", error);
          if (error instanceof Error) {
            throw new Error(`Failed to mint hypercert: ${error.message}`);
          } else {
            throw new Error("Failed to mint hypercert: Unknown error");
          }
        }

        if (!hash) {
          throw new Error("No transaction hash returned");
        }

        let receipt;
        try {
          receipt = await waitForTransactionReceipt(walletClient!, {
            confirmations: 3,
            hash,
          });
        } catch (error: unknown) {
          console.error("Error waiting for transaction receipt:", error);
          if (error instanceof Error) {
            throw new Error(`Failed to confirm transaction: ${error.message}`);
          } else {
            throw new Error("Failed to confirm transaction: Unknown error");
          }
        }

        if (receipt?.status === "reverted") {
          throw new Error("Transaction reverted: Minting failed");
        }

        return receipt;
      } catch (error) {
        console.error("Unhandled error in mintHypercert:", error);
        throw error;
      }
    },
  });
};
