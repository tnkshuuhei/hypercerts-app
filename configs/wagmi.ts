import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { sepolia } from "viem/chains";
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
  chains: [sepolia], // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
