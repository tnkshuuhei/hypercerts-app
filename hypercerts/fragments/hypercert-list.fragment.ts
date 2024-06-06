import { gqlHypercerts } from "../../graphql/hypercerts";

export const HypercertListFragment = gqlHypercerts(`
  fragment HypercertListFragment on Hypercert {
    metadata {
      name
			image
    }
    attestations {
      count
    }
    creation_block_timestamp
    hypercert_id
		contract {
        chain_id
      }
  }
`);
