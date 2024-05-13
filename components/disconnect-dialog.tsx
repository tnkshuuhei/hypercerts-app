import { useAccount, useDisconnect } from "wagmi";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { truncateEthereumAddress } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Wallet2 } from "lucide-react";
import { useEffect } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function DisconnectDialog({
  isDisconnectOpen,
  setIsDisconnectOpen,
}: {
  isDisconnectOpen: boolean;
  setIsDisconnectOpen: (isDisconnectOpen: boolean) => void;
}) {
  const {
    disconnect,
    isPending: isDisconnectPending,
    reset,
    connectors,
  } = useDisconnect();
  const { address } = useAccount();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDisconnectOpen) reset();
  }, [isDisconnectOpen, reset]);

  // const icon = (connector: Connector) => {
  //   if (
  //     isPending &&
  //     variables &&
  //     "id" in variables.connector &&
  //     connector.id === variables.connector.id
  //   ) {
  //     return <Loader2 className="w-6 h-6 animate-spin" />;
  //   }
  //   return undefined;
  // };

  // const iconSource = (connector: Connector) => {
  //   // WalletConnect does not provide an icon, so we provide a custom one.
  //   if (connector.id === "walletConnect") {
  //     return walletConnectLogo;
  //   }
  //   if (connector.id === "coinbaseWalletSDK" && !connector.icon) {
  //     return coinbaseWalletSDKLogo;
  //   }
  //   return connector.icon;
  // };

  const DisconnectorContent = () => (
    <div className="flex flex-col gap-2 pb-5">
      {/* {customConnectors.map((connector) => ( */}
      {address && (
        <p className="text-sm text-muted-foreground uppercase font-semibold tracking-wide">
          {truncateEthereumAddress(address)}
        </p>
      )}
      <Button
        className="flex items-center justify-between gap-2 py-6"
        disabled={isDisconnectPending}
        onClick={() => disconnect()}
        variant="outline"
      >
        Disconnect
        {/* <div className="flex items-center gap-2">
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
          </div> */}
        {/* {icon(connector)} */}
      </Button>
      {/* ))} */}
      {/* {error && (
        <div className="text-sm p-2 text-center text-red-600 bg-red-100 rounded-md">
          {error.message}
        </div>
      )} */}
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={isDisconnectOpen} onOpenChange={setIsDisconnectOpen}>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <DialogTrigger asChild className="cursor-pointer px-2 py-1.5">
          <p>Disconnect</p>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle className="text-2xl py-3 tracking-tight font-semibold">
            Disconnect
          </DialogTitle>

          <DisconnectorContent />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isDisconnectOpen} onOpenChange={setIsDisconnectOpen}>
      <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

      <DrawerTrigger
        asChild
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <div className="flex items-center justify-center gap-2">
          <Wallet2 size={16} />
          Disconnect
        </div>
      </DrawerTrigger>

      <DrawerContent className="container">
        <DialogTitle className="text-2xl py-3 tracking-tight font-semibold">
          Disconnect
        </DialogTitle>

        <DisconnectorContent />
      </DrawerContent>
    </Drawer>
  );
}
