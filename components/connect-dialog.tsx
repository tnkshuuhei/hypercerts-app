import { Connector, useAccount, useConnect } from "wagmi";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Loader2, Wallet2 } from "lucide-react";
import Image from "next/image";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function ConnectDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { connect, connectors, error, isPending, variables, reset } =
    useConnect();
  const { isConnected } = useAccount();
  const walletConnectLogo = "https://avatars.githubusercontent.com/u/37784886";
  const coinbaseWalletSDKLogo =
    "https://avatars.githubusercontent.com/u/1885080";

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const icon = (connector: Connector) => {
    if (
      isPending &&
      variables &&
      "id" in variables.connector &&
      connector.id === variables.connector.id
    ) {
      return <Loader2 className="w-4 h-4" />;
    }
    return undefined;
  };

  const iconSource = (connector: Connector) => {
    // WalletConnect does not provide an icon, so we provide a custom one.
    if (connector.id === "walletConnect") {
      return walletConnectLogo;
    }
    if (connector.id === "coinbaseWalletSDK" && !connector.icon) {
      return coinbaseWalletSDKLogo;
    }
    return connector.icon;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

      <DialogTrigger asChild className={buttonVariants({ variant: "outline" })}>
        <div className="flex items-center justify-center gap-2">
          Connect wallet
          <Wallet2 size={16} />
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="font-serif text-3xl">
          Connect Wallet
        </DialogTitle>

        {connectors.map((connector) => (
          <Button
            className="justify-between w-52"
            disabled={isConnected || isPending}
            key={connector.id}
            onClick={() => connect({ connector })}
            variant="outline"
          >
            {connector.name}
            {iconSource(connector) ? (
              <Image
                width={16}
                height={16}
                src={iconSource(connector) ?? ""}
                alt={`${connector.name} icon`}
                unoptimized={true}
              />
            ) : (
              <Wallet2 className="w-4 h-4" />
            )}
          </Button>
        ))}
        {error && (
          <div className="p-2 text-center text-red-600 bg-red-200">
            {error.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
