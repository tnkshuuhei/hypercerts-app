import SafeApiKit from "@safe-global/api-kit";

export interface SafeApiKitStrategy {
  createInstance(): SafeApiKit;
}

export class FilecoinMainnetStrategy implements SafeApiKitStrategy {
  createInstance(): SafeApiKit {
    return new SafeApiKit({
      chainId: BigInt(314),
      txServiceUrl: "https://transaction.safe.filecoin.io/api",
    });
  }
}

export class FilecoinTestnetStrategy implements SafeApiKitStrategy {
  createInstance(): SafeApiKit {
    console.log("chainId", BigInt(314159), typeof BigInt(314159));
    return new SafeApiKit({
      chainId: BigInt(314159),
      txServiceUrl: "https://transaction-testnet.safe.filecoin.io/api",
    });
  }
}

export class DefaultSafeApiStrategy implements SafeApiKitStrategy {
  constructor(private chainId: number) {}

  createInstance(): SafeApiKit {
    return new SafeApiKit({
      chainId: BigInt(this.chainId),
    });
  }
}

export class SafeApiStrategyFactory {
  static getStrategy(chainId: number): SafeApiKitStrategy {
    switch (chainId) {
      case 314:
        return new FilecoinMainnetStrategy();
      case 314159:
        return new FilecoinTestnetStrategy();
      default:
        return new DefaultSafeApiStrategy(chainId);
    }
  }
}
