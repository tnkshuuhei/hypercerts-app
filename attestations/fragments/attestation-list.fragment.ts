import { graphql } from "@/lib/graphql";

export const AttestationListFragment = graphql(`
  fragment AttestationListFragment on Attestation {
    attester
    block_timestamp
    data
    schema
  }
`);
