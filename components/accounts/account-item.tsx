import Image from "next/image";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccountType } from "@/lib/account-store";
import { truncateEthereumAddress } from "@/lib/utils";

interface AccountItemProps {
  type: AccountType;
  name: string;
  address: `0x${string}`;
  onClick: () => void;
  isSelected?: boolean;
}

export default function AccountItem({
  type = "safe",
  name,
  address,
  onClick,
  isSelected,
}: AccountItemProps) {
  const imageSrc = type === "eoa" ? "/eth-logo.svg" : "/safe-logo.svg";
  const imageAlt = type === "eoa" ? "Ethereum" : "Safe";

  return (
    <Button
      variant="ghost"
      className="justify-between hover:bg-accent w-full"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={24}
          height={24}
          className="mr-2"
        />
        <div className="flex flex-col items-start">
          <span>{name}</span>
          <span className="text-sm text-muted-foreground">
            {truncateEthereumAddress(address)}
          </span>
        </div>
      </div>
      {isSelected && <Check className="h-4 w-4" />}
    </Button>
  );
}
