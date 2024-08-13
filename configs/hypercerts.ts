import { parseUnits } from "viem";

export const HYPERCERTS_API_URL_REST = "https://staging-api.hypercerts.org/v1";
export const HYPERCERTS_API_URL = process.env.NEXT_PUBLIC_HYPERCERT_API_ENDPOINT
  ? `${process.env.NEXT_PUBLIC_HYPERCERT_API_ENDPOINT}/graphql`
  : "https://staging-api.hypercerts.org/v1/graphql";
export const HYPERCERTS_DEFAULT_CONTRACT =
  "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941";

export const DEFAULT_NUM_FRACTIONS = parseUnits("1", 8);

export const DEFAULT_DISPLAY_CURRENCY = "usd";
