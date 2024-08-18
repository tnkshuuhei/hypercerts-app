import "server-only";

import { graphql } from "@/lib/graphql";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";

const query = graphql(`
  query Attestations($attester: String) {
    attestations(where: { attester: { eq: $attester } }) {
      count
    }
  }
`);

export async function getEvaluatorAttestationsCount(attester: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
    attester: attester,
  });
  return res.attestations?.count;
}
