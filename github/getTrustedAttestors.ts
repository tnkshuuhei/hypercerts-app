import { TrustedAttestor } from "./types/trusted-attestor.type";

export async function getTrustedAttestors(): Promise<TrustedAttestor[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/hypercerts-org/hypercerts-attestor-registry/refs/headst /main/attestor.json",
  );
  return res.json();
}
