import { SUPPORTED_CHAINS } from "@/configs/constants";
import { Chain } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  celo,
  filecoin,
  filecoinCalibration,
  optimism,
  sepolia,
} from "viem/chains";

export class ChainFactory {
  static getChain(chainId: number): Chain {
    const chains: Record<number, Chain> = {
      10: optimism,
      314: filecoin,
      8453: base,
      42161: arbitrum,
      42220: celo,
      84532: baseSepolia,
      314159: filecoinCalibration,
      421614: arbitrumSepolia,
      11155111: sepolia,
    };

    const chain = chains[chainId];
    if (!chain) throw new Error(`Unsupported chain ID: ${chainId}`);
    return chain;
  }

  static getSupportedChains(): number[] {
    return SUPPORTED_CHAINS.map((chain) => chain.id);
  }
}
