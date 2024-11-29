import { graphql, ResultOf } from "@/lib/graphql";

export const AttestationListFragment = graphql(`
  fragment AttestationListFragment on Attestation {
    id
    uid
    attester
    creation_block_number
    creation_block_timestamp
    data
  }
`);

export type AttestationResult = ResultOf<typeof AttestationListFragment>;
