import { graphql, readFragment } from "@/lib/graphql";
import { AttestationListFragment } from "./fragments/attestation-list.fragment";
import request from "graphql-request";
import { Address, Hex } from "viem";
import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";

const query = graphql(
  `
    query AttestationsQuery($where: AttestationWhereInput) {
      attestations(
        where: $where
        sort: { by: { creation_block_timestamp: descending } }
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
interface GetAttestationsParams {
  first?: number;
  offset?: number;
  filter?: {
    chainId?: bigint;
    contractAddress?: Address;
    tokenId?: bigint;
    schemaId?: Hex;
  };
}

export async function getCreatorFeedAttestations({
  first,
  offset,
  filter,
}: GetAttestationsParams) {
  const where: Record<string, any> = {};

  if (filter?.chainId) {
    where.chain_id = { eq: filter.chainId.toString() };
  }
  if (filter?.contractAddress) {
    where.contract_address = { eq: filter.contractAddress };
  }
  if (filter?.tokenId) {
    where.token_id = { eq: filter.tokenId.toString() };
  }

  if (filter?.schemaId) {
    where.eas_schema = { uid: { eq: filter.schemaId } };
  }

  const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
    first,
    offset,
    where,
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
