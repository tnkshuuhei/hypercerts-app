"use client";
import { useMemo } from "react";
import { useChainId, useWalletClient } from "wagmi";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { HYPERCERTS_API_URL_REST } from "@/configs/hypercerts";
import { SUPPORTED_CHAINS } from "@/configs/constants";

export const useHypercertExchangeClient = () => {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const client = useMemo(() => {
    if (
      !SUPPORTED_CHAINS.find((chain) => chain.id === walletClient?.chain.id)
    ) {
      return null;
    }

    return new HypercertExchangeClient(
      chainId,
      // @ts-expect-error - wagmi and viem have different typing
      provider,
      signer,
      {
        apiEndpoint: HYPERCERTS_API_URL_REST,
      },
    );
  }, [walletClient, chainId, provider, signer]);

  return { client };
};
