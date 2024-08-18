import { useWalletClient } from "wagmi";
import { addressesByNetwork, utils } from "@hypercerts-org/marketplace-sdk";
import { readContract } from "viem/actions";
import {
  HypercertMinterAbi,
  parseClaimOrFractionId,
  TransferRestrictions,
} from "@hypercerts-org/sdk";
import { useQuery } from "@tanstack/react-query";

export const useReadTransferRestrictions = (hypercertId: string) => {
  const { id, chainId } = parseClaimOrFractionId(hypercertId);

  const minterAddress =
    addressesByNetwork[utils.asDeployedChain(chainId)].MINTER;

  const { data: walletClient } = useWalletClient({
    chainId,
  });

  return useQuery({
    queryKey: ["readTransferRestrictions", hypercertId],
    queryFn: async () => {
      if (!walletClient) {
        console.log("no wallet client");
        return null;
      }

      const data = await readContract(walletClient, {
        abi: HypercertMinterAbi,
        address: minterAddress as `0x${string}`,
        functionName: "readTransferRestrictions",
        args: [id],
      });

      return data as TransferRestrictions;
    },
    enabled: !!walletClient,
  });
};
