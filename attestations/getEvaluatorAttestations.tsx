import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { AttestationListFragment } from "./fragments/attestation-list.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(
  `
    query Attestations($attester: String) {
      attestations(where: { attester: { eq: $attester } }) {
        count
        data {
          ...AttestationListFragment
        }
      }
    }
  `,
  [AttestationListFragment],
);

export async function getEvaluatorAttestations(attester: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    attester: attester,
  });
  const attestations = res.attestations?.data?.[0];

  if (!attestations) {
    return undefined;
  }

  // TODO: Throw error?
  if (!res.attestations?.data) {
    return undefined;
  }

  const processedFragments = res.attestations.data.map((attestation) => {
    return readFragment(AttestationListFragment, attestation);
  });

  return {
    count: res.attestations.count,
    data: processedFragments,
  };
}
