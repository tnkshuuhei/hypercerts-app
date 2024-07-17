//TODO server-only?
import { graphql, readFragment } from "@/lib/graphql";

import { FractionStateFragment } from "./fragments/fraction-state.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(
  `
    query Fraction($hypercert_id: String!) {
      fractions(where: { hypercert_id: { eq: $hypercert_id } }, count: COUNT) {
        count
        data {
          ...FractionStateFragment
        }
      }
    }
  `,
  [FractionStateFragment],
);

export async function getFractionsByHypercert(hypercertId: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    hypercert_id: hypercertId,
  });

  if (!res.fractions?.data) {
    return undefined;
  }

  const processedFragments = res.fractions.data.map((fraction) => {
    return readFragment(FractionStateFragment, fraction);
  });

  return {
    count: res.fractions.count,
    data: processedFragments,
  };
}
