import { decodeEventLog, type TransactionReceipt } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { BigNumber } from "@ethersproject/bignumber";

export const generateHypercertIdFromReceipt = (
  receipt: TransactionReceipt,
  chainId: number,
) => {
  if (!receipt || !receipt.logs) {
    console.log("No receipt found");
    return;
  }
  const events = receipt.logs.map((log) =>
    decodeEventLog({
      abi: HypercertMinterAbi,
      data: log.data,
      topics: log.topics,
    }),
  );

  if (!events) {
    throw new Error("No events in receipt");
  }

  const claimEvent = events.find((e) => e.eventName === "ClaimStored");

  if (!claimEvent) {
    throw new Error("ClaimStored event not found");
  }

  const { args } = claimEvent;

  if (!args) {
    throw new Error("No args in event");
  }

  // @ts-ignore
  const tokenIdBigNumber = args["claimID"] as BigNumber;

  if (!tokenIdBigNumber) {
    throw new Error("No tokenId arg in event");
  }

  const contractId = receipt.to;
  const tokenId = tokenIdBigNumber.toString();

  return `${chainId}-${contractId}-${tokenId}`;
};
