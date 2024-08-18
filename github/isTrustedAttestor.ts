import { TrustedAttestor } from "./types/trusted-attestor.type";

export function isTrustedAttestor(
  trustedAttestors: TrustedAttestor[] | undefined,
  address: string
) {
  if (!trustedAttestors) {
    return false;
  }
  return trustedAttestors.some(
    (attestor) => attestor.eth_address.toLowerCase() === address.toLowerCase()
  );
}
