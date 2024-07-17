import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { FractionStateFragment } from "./fragments/fraction-state.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

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
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    fraction_id: fractionId,
  });

  const fractionStateFragment = res.fractions?.data?.[0];
  if (!fractionStateFragment) {
    return undefined;
  }

  return readFragment(FractionStateFragment, fractionStateFragment);
}
