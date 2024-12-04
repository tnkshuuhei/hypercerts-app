import { SUPPORTED_CHAINS } from "@/configs/constants";

export function isChainIdSupported(id: number | string | undefined | null) {
  if (!id) return false;

  return SUPPORTED_CHAINS.find((c) => c.id === +id) !== undefined;
}
