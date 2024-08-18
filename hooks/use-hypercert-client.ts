"use client";
import React, { useEffect } from "react";

import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { base, baseSepolia, celo, optimism, sepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";

const isSupportedChain = (chainId: number) => {
  const supportedChainIds = [
    base.id,
    baseSepolia.id,
    celo.id,
    optimism.id,
    sepolia.id,
  ] as number[];

  return supportedChainIds.includes(chainId);
};
export const useHypercertClient = ({
  overrideChainId,
}: {
  overrideChainId?: number;
} = {}) => {
  const { chain } = useAccount();
  const clientConfig = React.useMemo(
    () => ({
      chain: overrideChainId ? { id: overrideChainId } : chain,
    }),
    [overrideChainId, chain]
  );
  const [client, setClient] = React.useState<HypercertClient | null>(() => {
    if (clientConfig.chain?.id && isSupportedChain(clientConfig.chain.id)) {
      return new HypercertClient(clientConfig);
    }
    return null;
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data: walletClient,
    isError,
    isLoading: walletClientLoading,
  } = useWalletClient();

  useEffect(() => {
    const chainId = overrideChainId || chain?.id;
    if (
      chainId &&
      isSupportedChain(chainId) &&
      !walletClientLoading &&
      !isError &&
      walletClient
    ) {
      setIsLoading(true);

      try {
        const config: Partial<HypercertClientConfig> = {
          ...clientConfig,
          chain: { id: chainId },
          walletClient,
        };

        const client = new HypercertClient(config);
        setClient(client);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
  }, [
    chain?.id,
    clientConfig,
    isError,
    overrideChainId,
    walletClient,
    walletClientLoading,
  ]);

  return { client, isLoading };
};
