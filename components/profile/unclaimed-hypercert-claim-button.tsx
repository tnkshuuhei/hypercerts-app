"use client";

import { AllowListRecord } from "../../allowlists/getAllowListRecordsForAddress";
import { Button } from "../ui/button";
import { useHypercertClient } from "@/hooks/use-hypercert-client";

export default function UnclaimedHypercertClaimButton({
  allowListRecord,
}: {
  allowListRecord: AllowListRecord;
}) {
  const { client } = useHypercertClient();

  const claimHypercert = async () => {
    if (
      !allowListRecord.units ||
      !allowListRecord.proof ||
      !allowListRecord.token_id
    ) {
      throw new Error("Invalid allow list record");
    }

    // DUMMY VALUES
    const root: `0x${string}` =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

    const tx = await client.mintClaimFractionFromAllowlist(
      BigInt(allowListRecord.token_id),
      BigInt(allowListRecord.units),
      allowListRecord.proof as `0x${string}`[],
      root,
    );

    console.log(tx);
  };
  return <Button onClick={claimHypercert}>Claim</Button>;
}
