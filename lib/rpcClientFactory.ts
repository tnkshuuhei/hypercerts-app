import { createPublicClient, http, PublicClient, Transport } from "viem";
import { ChainFactory } from "./chainFactory";
import { filecoinApiKey } from "@/configs/constants";

interface RpcConfig {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Chain-specific RPC configuration factory
class RpcConfigFactory {
  private static readonly DEFAULT_TIMEOUT = 20_000;

  static getConfig(chainId: number, url: string): RpcConfig {
    const baseConfig: RpcConfig = {
      url,
      timeout: this.DEFAULT_TIMEOUT,
    };

    // Chain-specific configurations
    switch (chainId) {
      case 314:
      case 314159:
        return {
          ...baseConfig,
          headers: {
            Authorization: `Bearer ${filecoinApiKey}`,
          },
        };
      default:
        return baseConfig;
    }
  }
}

// Unified client factory for both Viem and Chainsauce clients
export class UnifiedRpcClientFactory {
  // Creates a Viem transport
  static createViemTransport(chainId: number, url: string): Transport {
    const config = RpcConfigFactory.getConfig(chainId, url);

    const httpConfig: any = {
      timeout: config.timeout,
    };

    if (config.headers) {
      httpConfig.fetchOptions = {
        headers: config.headers,
      };
    }

    return http(config.url, httpConfig);
  }

  // Creates a Viem public client
  static createViemClient(chainId: number, url: string) {
    return createPublicClient({
      chain: ChainFactory.getChain(chainId),
      transport: this.createViemTransport(chainId, url),
    });
  }
}

// Helper function to create appropriate client based on context
export const createRpcClient = (chainId: number, url: string) => {
  return UnifiedRpcClientFactory.createViemClient(chainId, url);
};
