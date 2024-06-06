import "server-only";

import { HYPERCERTS_API_URL } from "../configs/hypercerts";
import { HypercertFullFragment } from "./fragments/hypercert-full.fragment";
import { gqlHypercerts } from "../graphql/hypercerts";
import { readFragment } from "gql.tada";
import request from "graphql-request";

const query = gqlHypercerts(
  `
    query Hypercert($hypercert_id: String) {
      hypercerts(where: {hypercert_id: {eq: $hypercert_id}}) {
        data {
          ...HypercertFullFragment
        }
      }
    }
  `,
  [HypercertFullFragment]
);

export async function getHypercert(hypercertId: string) {
  const res = await request(HYPERCERTS_API_URL, query, {
    hypercert_id: hypercertId,
  });
  const hypercertFullFragment = res.hypercerts?.data?.[0];
  if (!hypercertFullFragment) {
    return undefined;
  }

  return readFragment(HypercertFullFragment, hypercertFullFragment);
}
