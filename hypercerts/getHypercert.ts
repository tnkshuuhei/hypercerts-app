import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { HypercertFullFragment } from "./fragments/hypercert-full.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(
  `
    query Hypercert($hypercert_id: String) {
      hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
        data {
          ...HypercertFullFragment
        }
      }
    }
  `,
  [HypercertFullFragment],
);

export async function getHypercert(hypercertId: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    hypercert_id: hypercertId,
  });

  const hypercertFullFragment = res.hypercerts?.data?.[0];
  if (!hypercertFullFragment) {
    return undefined;
  }

  return readFragment(HypercertFullFragment, hypercertFullFragment);
}
