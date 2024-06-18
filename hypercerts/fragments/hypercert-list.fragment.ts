import { ResultOf, graphql } from "@/lib/graphql";

export const HypercertListFragment = graphql(`
  fragment HypercertListFragment on Hypercert {
    metadata {
      name
    }
    attestations {
      count
      data {
        data
      }
    }
    block_number
    hypercert_id
    contract {
      chain_id
    }
  }
`);
export type HypercertListFragment = ResultOf<typeof HypercertListFragment>;
