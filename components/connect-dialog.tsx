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
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const walletConnectLogo = "https://avatars.githubusercontent.com/u/37784886";
  const coinbaseWalletSDKLogo =
    "https://avatars.githubusercontent.com/u/1885080";

  const customConnectors = [...connectors].sort((a, b) => {
    if (a.type === "injected" && b.type !== "injected") return -1;
    if (a.type !== "injected" && b.type === "injected") return 1;
    return 0;
  });

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
      return <Loader2 className="w-6 h-6 animate-spin" />;
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

  const ConnectorContent = () => (
    <div className="flex flex-col gap-2 pb-5">
      {customConnectors.map((connector) => (
        <Button
          className="flex items-center justify-between gap-2 py-6"
          disabled={isConnected || isPending}
          key={connector.id}
          onClick={() => connect({ connector })}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            {iconSource(connector) ? (
              <div className="relative w-6 h-6 object-c object-center rounded-sm overflow-clip">
                <Image
                  layout="fill"
                  src={iconSource(connector) ?? ""}
                  alt={`${connector.name} icon`}
                  unoptimized={true}
                />
              </div>
            ) : (
              <Wallet2 className="w-6 h-6" />
            )}
            <p className="text-sm md:text-base lg:text-lg tracking-tight">
              {connector.name === "Injected"
                ? "Browser wallet"
                : connector.name}
            </p>
          </div>
          {icon(connector)}
        </Button>
      ))}
      {error && (
        <div className="text-sm p-2 text-center text-red-600 bg-red-100 rounded-md">
          {error.message}
        </div>
      )}
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <DialogTrigger
          asChild
          className={`${buttonVariants({ variant: "outline" })} cursor-pointer`}
        >
          <div className="flex items-center justify-center gap-2">
            Connect wallet
            <Wallet2 size={16} />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>
            <p className="text-sm text-muted-foreground uppercase font-semibold tracking-wide">
              Connect wallet
            </p>
            <p className="text-2xl py-3 tracking-tight font-semibold">
              Choose a wallet
            </p>
          </DialogTitle>

          <ConnectorContent />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

      <DrawerTrigger
        asChild
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <div className="flex items-center justify-center gap-2">
          <Wallet2 size={16} />
          Connect wallet
        </div>
      </DrawerTrigger>

      <DrawerContent className="container">
        <DrawerTitle className="font-sans text-2xl py-3 tracking-tight font-semibold">
          Choose a wallet
        </DrawerTitle>

        <ConnectorContent />
      </DrawerContent>
    </Drawer>
  );
}
