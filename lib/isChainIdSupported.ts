import { SUPPORTED_CHAINS } from "@/configs/constants";

export function isChainIdSupported(id: number | undefined) {
  if (id === undefined) return false;
  return SUPPORTED_CHAINS.find((c) => c.id === id) !== undefined;
}
