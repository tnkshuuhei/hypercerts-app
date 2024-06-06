"use client";

import { CopyButton } from "./copy-button";
import { useEnsName } from "wagmi";
import { useState } from "react";

export default function EthAddress({
  address,
  showEnsName = false,
}: {
  address?: string | undefined | null;
  showEnsName?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const { data: ensName } = useEnsName({
    address: address as `0x${string}` | undefined,
    chainId: 1,
  });

  if (!address) {
    return <div>Unknown</div>;
  }

  const copyAddress = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    void navigator.clipboard.writeText(address);
    // toast({
    //   title: "Copied.",
    //   status: "info",
    //   duration: 1000,
    //   position: "top",
    // });
  };

  return (
    <div
      className="flex items-center gap-2 content-center cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* <JazziconImage address={address} /> */}
      <div onClick={copyAddress}>
        {showEnsName && ensName
          ? ensName
          : address.slice(0, 6) + "..." + address.slice(-4)}
      </div>
      {hover && <CopyButton textToCopy={address} className="w-4 h-4" />}
    </div>
  );
}
