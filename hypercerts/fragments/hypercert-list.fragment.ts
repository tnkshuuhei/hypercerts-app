import { gqlHypercerts } from "../../graphql/hypercerts";

export const HypercertListFragment = gqlHypercerts(`
  fragment HypercertListFragment on Hypercert {
    metadata {
      name
    }
    attestations {
      count
    }
		block_number
    hypercert_id
		contract {
        chain_id
      }
  }
`);
