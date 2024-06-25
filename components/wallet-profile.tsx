"use client";
import Link from "next/link";
import { normalize } from "viem/ens";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import ConnectDialog from "@/components/connect-dialog";
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
import DisconnectDialog from "@/components/disconnect-dialog";
import Image from "next/image";

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

  useEffect(() => {
    if (!nameError && nameData) {
      setEnsName(nameData);
    }
  }, [nameData, nameError]);

  const { data: avatarData, error: avatarError } = useEnsAvatar({
    chainId: nameData ? mainnet.id : undefined,
    name: nameData ? normalize(nameData) : undefined,
  });

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
          "relative w-8 h-8 rounded-full overflow-hidden ring-[1.5px] ring-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400",
        )}
      >
        <Avatar className="h-8 w-8 bg-stone-50">
          {ensAvatar && (
            <AvatarImage
              src={ensAvatar}
              alt="ENS Avatar"
              className="object-center object-cover"
            />
          )}
          <AvatarFallback>
            <Image src="/avatar-default.jpg" fill alt="Default avatar" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-slate-50"
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
          setIsConnectOpen={setIsConnectOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
