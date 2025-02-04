"use client";

import { AllowListRecord } from "@/allowlists/getAllowListRecordsForAddressByClaimed";
import { Button } from "../ui/button";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { waitForTransactionReceipt } from "viem/actions";
import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

interface UnclaimedHypercertClaimButtonProps {
  allowListRecord: Row<AllowListRecord>;
}

export default function UnclaimedHypercertClaimButton({
  allowListRecord,
}: UnclaimedHypercertClaimButtonProps) {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { refresh } = useRouter();

  const claimHypercert = async () => {
    if (!client) {
      throw new Error("No client found");
    }

    if (!walletClient) {
      throw new Error("No wallet client found");
    }

    if (!address) {
      throw new Error("No address found");
    }

    if (
      !allowListRecord.original?.units ||
      !allowListRecord.original?.proof ||
      !allowListRecord.original?.token_id
    ) {
      throw new Error("Invalid allow list record");
    }

    console.log(allowListRecord);

    const tx = await client.mintClaimFractionFromAllowlist(
      BigInt(allowListRecord.original?.token_id),
      BigInt(allowListRecord.original?.units),
      allowListRecord.original?.proof as `0x${string}`[],
      undefined,
    );
    console.log(tx);
    if (!tx) {
      throw new Error("Failed to claim hypercert");
    }

    await waitForTransactionReceipt(walletClient, {
      hash: tx,
    });

    setTimeout(() => {
      refresh();
    }, 5000);
  };
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={claimHypercert}
      disabled={allowListRecord.original?.user_address !== address}
    >
      Claim
    </Button>
  );
}
