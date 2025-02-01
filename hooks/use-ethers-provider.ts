import { PublicClient } from "viem";
import { JsonRpcProvider } from "ethers";

import { usePublicClient } from "wagmi";
import React from "react";
import { EvmClientFactory } from "@/lib/evmClient";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  if (!chain || !transport) return undefined;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const rpcUrl = EvmClientFactory.getFirstAvailableUrl(chain.id);
  return new JsonRpcProvider(rpcUrl, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => {
    if (publicClient === undefined) return undefined;
    return publicClientToProvider(publicClient);
  }, [publicClient]);
}
