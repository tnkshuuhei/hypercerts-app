import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage, http } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { celo, sepolia } from "viem/chains";
import { siteConfig } from "./site";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.origin, // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/124626532"],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [sepolia, celo],
  connectors: [walletConnect({ projectId })],
  projectId,
  pollingInterval: 2_000,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(),
    [celo.id]: http(),
  },
});
