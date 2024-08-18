"use client";

import React, { Suspense } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";

import { ImageIcon } from "./user-icon/ImageIcon";
import { SvgIcon } from "./user-icon/SvgIcon";
import { mainnet } from "viem/chains";

type UserIconProps = {
  address?: string;
  variant?: "round" | "square";
  size?: "tiny" | "small" | "large" | "huge";
  className?: string;
  plusOne?: boolean;
};

export function UserIconInner({ address, size = "small" }: UserIconProps) {
  const { data: username } = useEnsName({
    address: address as `0x${string}`,
    chainId: mainnet.id,
  });
  const { data: avatarUrl } = useEnsAvatar({
    name: username as string,
    chainId: 1,
  });
  if (!address || !avatarUrl) {
    return <SvgIcon size={size} />;
  }

  return <ImageIcon url={avatarUrl} size={size} />;
}

export function UserIcon({ address, size = "small" }: UserIconProps) {
  return (
    <Suspense fallback={<SvgIcon size={size} />}>
      <UserIconInner address={address} size={size} />
    </Suspense>
  );
}
