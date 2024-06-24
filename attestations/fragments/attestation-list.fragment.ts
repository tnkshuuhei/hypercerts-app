import { graphql } from "@/lib/graphql";

export const AttestationListFragment = graphql(`
  fragment AttestationListFragment on Attestation {
    id
    attester
    creation_block_number
    creation_block_timestamp 
    data
  }
`);
