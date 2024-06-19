import { mainnet, optimism, sepolia } from "viem/chains";

export const SUPPORTED_CHAINS = new Map([
  [sepolia.id, "Sepolia"],
  [mainnet.id, "Ethereum"],
  // [42220, "Celo"],
  [optimism.id, "OP Mainnet"],
  // [84532, "Base Sepolia Testnet"],
  // [8453, "Base"],
]);
