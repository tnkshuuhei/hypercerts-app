import { isAddress } from "viem";
import { useCallback, useEffect, useState } from "react";

import { useAccount, useBalance } from "wagmi";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { supportedChains } from "@/lib/constants";

export type WriteableErrorCategory =
  | "connection"
  | "address"
  | "balance"
  | "chain"
  | "client";
export type WriteableErrors = Record<WriteableErrorCategory, string>;

const useIsWriteable = () => {
  const { address, isConnected, chain } = useAccount();
  const { client } = useHypercertClient();
  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const [checking, setChecking] = useState(false);
  const [writeable, setWriteable] = useState(false);
  const [errors, setErrors] = useState<WriteableErrors>();

  const checkWriteable = useCallback(async () => {
    setChecking(true);
    const currentErrors: WriteableErrors = {
      address: "",
      client: "",
      chain: "",
      connection: "",
      balance: "",
    };

    if (!isConnected)
      currentErrors["connection"] =
        "You appear to not be connected. Please connect your wallet";
    if (!address || !isAddress(address))
      currentErrors["address"] =
        `No valid address found [${address}]. Please connect your wallet`;
    if (!balance || balance.value === BigInt(0))
      currentErrors["balance"] = "Please add funds to your wallet";
    if (!chain)
      currentErrors["chain"] =
        "No connection chain found. Please connect your wallet";
    if (chain && !supportedChains.map((c) => c.id).includes(chain.id))
      currentErrors["chain"] =
        `Wrong network. Please connect to one of "${supportedChains.map((c) => c.id).join(", ")}"`;
    if (!client)
      currentErrors["client"] =
        "Unable to locate client. Please check your configuration and connection settings.";

    setWriteable(Object.keys(currentErrors).length === 0);
    setErrors(currentErrors);
    setChecking(false);
  }, [isConnected, address, balance, chain, client]);

  useEffect(() => {
    checkWriteable();
  }, [address, isConnected, balance, chain, client, checkWriteable]);

  return { checking, writeable, errors };
};

export default useIsWriteable;
