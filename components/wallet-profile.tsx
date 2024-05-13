"use client";
import Link from "next/link";
import { normalize } from "viem/ens";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, truncateEthereumAddress } from "@/lib/utils";
import { Loader2, VenetianMaskIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";
import ConnectDialog from "./connect-dialog";
import DisconnectDialog from "./disconnect-dialog";

const WalletProfile = ({
  alignment = "end",
}: {
  alignment?: "end" | "center" | "start";
}) => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);

  const { data: nameData, error: nameError } = useEnsName({
    chainId: address ? mainnet.id : undefined,
    address,
  });

  // Use useEffect to react to nameData changes and setEnsName
  useEffect(() => {
    if (!nameError && nameData) {
      setEnsName(nameData);
    }
  }, [nameData, nameError]);

  // Call useEnsAvatar with the normalized nameData when available
  const { data: avatarData, error: avatarError } = useEnsAvatar({
    chainId: nameData ? mainnet.id : undefined,
    name: nameData ? normalize(nameData) : undefined,
  });

  // Use useEffect to react to avatarData changes and setEnsAvatar
  useEffect(() => {
    if (!avatarError && avatarData) {
      setEnsAvatar(avatarData);
    }
  }, [avatarData, avatarError]);

  if (isConnecting) return <Loader2 className="animate-spin" />;
  if (isDisconnected)
    return (
      <ConnectDialog isOpen={isConnectOpen} setIsOpen={setIsConnectOpen} />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "relative w-10 h-10 rounded-full overflow-hidden ring-[1.5px] ring-vd-beige-300 focus:outline-none focus:ring-2 focus:ring-vd-beige-400"
        )}
      >
        <Avatar className="h-10 w-10 bg-stone-50">
          {ensAvatar && (
            <AvatarImage
              src={ensAvatar}
              alt="ENS Avatar"
              className="object-center object-cover"
            />
          )}
          <AvatarFallback>
            <VenetianMaskIcon />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-vd-beige-100"
        align={alignment}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {ensName && (
              <p className="text-sm font-medium leading-none">{ensName}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {address ? truncateEthereumAddress(address) : "No address"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/profile/${address}`}>
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href={`/profile/${address}/settings`}>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DisconnectDialog
          isDisconnectOpen={isDisconnectOpen}
          setIsDisconnectOpen={setIsDisconnectOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
