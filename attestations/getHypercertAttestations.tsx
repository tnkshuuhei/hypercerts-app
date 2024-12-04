import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { AttestationListFragment } from "./fragments/attestation-list.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";

const query = graphql(
  `
    query Attestations(
      $chainId: BigInt!
      $contractAddress: String!
      $tokenId: String!
    ) {
      attestations(
        where: {
          chain_id: { eq: $chainId }
          contract_address: { eq: $contractAddress }
          token_id: { eq: $tokenId }
        }
      ) {
        count
        data {
          ...AttestationListFragment
        }
      }
    }
  `,
  [AttestationListFragment],
);

export async function getHypercertAttestations(hypercertId: string) {
  const [chainId, contractAddress, tokenId] = hypercertId.split("-");

  const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
    chainId,
    contractAddress,
    tokenId,
  });

  if (!res.attestations?.data || !res.attestations?.count) {
    return {
      count: 0,
      data: [],
    };
  }

  return {
    count: res.attestations.count,
    data: res.attestations.data.map((attestation) =>
      readFragment(AttestationListFragment, attestation),
    ),
  };
}
