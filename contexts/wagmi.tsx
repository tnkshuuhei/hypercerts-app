"use client";

import type { ReactNode } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, projectId } from "@/configs/wagmi";
import { type State, WagmiProvider } from "wagmi";
import { sepolia } from "viem/chains";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
	wagmiConfig: config,
	projectId,
	defaultChain: sepolia, // TODO: Change for final release
	enableAnalytics: true,
});

export function Web3ModalProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
