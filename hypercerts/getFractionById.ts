import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { HYPERCERTS_API_URL } from "../configs/hypercerts";
import { FractionStateFragment } from "./fragments/fraction-state.fragment";
import request from "graphql-request";

const query = graphql(
  `
    query Fraction($fraction_id: String!) {
      fractions(where: { fraction_id: { eq: $fraction_id } }) {
        data {
          ...FractionStateFragment
        }
      }
    }
  `,
  [FractionStateFragment],
);

export async function getFraction(fractionId: string) {
  const res = await request(HYPERCERTS_API_URL, query, {
    fraction_id: fractionId,
  });

  const fractionStateFragment = res.fractions?.data?.[0];
  if (!fractionStateFragment) {
    return undefined;
  }

  return readFragment(FractionStateFragment, fractionStateFragment);
}
