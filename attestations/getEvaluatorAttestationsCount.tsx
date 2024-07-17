import "server-only";

import { graphql } from "@/lib/graphql";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(`
  query Attestations($attester: String) {
    attestations(where: { attester: { eq: $attester } }) {
      count
    }
  }
`);

export async function getEvaluatorAttestationsCount(attester: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    attester: attester,
  });
  return res.attestations?.count;
}
