"use client";

import { AllowListRecord } from "@/allowlists/getAllowListRecordsForAddressByClaimed";
import { Button } from "../ui/button";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { waitForTransactionReceipt } from "viem/actions";
import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/navigation";
import { useStepProcessDialogContext } from "../global/step-process-dialog";
import { revalidatePathServerAction } from "@/app/actions/revalidatePathServerAction";
import { useState } from "react";
import { Hex, ByteArray } from "viem";

interface TransformedClaimData {
  hypercertTokenIds: bigint[];
  units: bigint[];
  proofs: (Hex | ByteArray)[][];
  roots?: (Hex | ByteArray)[];
}

function transformAllowListRecords(
  records: AllowListRecord[],
): TransformedClaimData {
  return {
    hypercertTokenIds: records.map((record) => BigInt(record.token_id!)),
    units: records.map((record) => BigInt(record.units!)),
    proofs: records.map((record) => record.proof as (Hex | ByteArray)[]),
    roots: records.map((record) => record.root as Hex | ByteArray),
  };
}

export default function UnclaimedHypercertBatchClaimButton({
  allowListRecords,
}: {
  allowListRecords: AllowListRecord[];
}) {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const { refresh } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setDialogStep, setSteps, setOpen, setTitle } =
    useStepProcessDialogContext();

  const claimHypercert = async () => {
    setIsLoading(true);
    setOpen(true);
    setSteps([
      { id: "preparing", description: "Preparing to claim hypercert..." },
      { id: "claiming", description: "Claiming hypercert on-chain..." },
      { id: "confirming", description: "Waiting for on-chain confirmation" },
      { id: "done", description: "Claiming complete!" },
    ]);
    setTitle("Claim Hypercert from Allowlist");
    if (!client) {
      throw new Error("No client found");
    }
    if (!walletClient) {
      throw new Error("No wallet client found");
    }
    if (!account) {
      throw new Error("No address found");
    }

    const claimData = transformAllowListRecords(allowListRecords);
    await setDialogStep("preparing, active");
    console.log(allowListRecords);
    try {
      await setDialogStep("claiming", "active");

      const tx = await client.batchClaimFractionsFromAllowlists(claimData);
      console.log(tx);
      if (!tx) {
        await setDialogStep("claiming", "error");
        throw new Error("Failed to claim hypercert");
      }
      await setDialogStep("confirming", "active");
      const receipt = await waitForTransactionReceipt(walletClient, {
        confirmations: 3,
        hash: tx,
      });
      if (receipt.status == "success") {
        await setDialogStep("done", "completed");
        await revalidatePathServerAction([
          `/profile/${account.address}`,
          `/profile/${account.address}?tab=hypercerts-claimable`,
        ]);
      } else if (receipt.status == "reverted") {
        await setDialogStep("confirming", "error", "Transaction reverted");
      }
      console.log({ receipt });
      setTimeout(() => {
        refresh();
      }, 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={claimHypercert}
      disabled={
        isLoading ||
        !allowListRecords.length ||
        !account ||
        !client ||
        account.address !== allowListRecords[0].user_address
      }
    >
      Claim Selected
    </Button>
  );
}
