import { HYPERCERTS_API_URL } from "@/configs/hypercerts";
import { graphql } from "gql.tada";
import request from "graphql-request";

export type HypercertsByCreatorQueryResponse = {
  hypercerts: {
    count: number;
    data: {
      hypercert_id: string;
      metadata: {
        name: string;
      };
      units: number;
      uri: string;
      creator_address: string;
      contract: {
        chain_id: number;
      };
      attestations: {
        data: {
            data: unknown;
        }[] | null;
        count: number | null;
      } | null;
    }[];
  };
};

const hypercertsByCreatorQuery = graphql(
  `
    query GetHypercertsByCreator($address: String!) {
      hypercerts(
        sort: { by: { claim_attestation_count: descending } }
        where: { creator_address: { contains: $address } }
        count: COUNT
      ) {
        count
        data {
          hypercert_id
          contract {
            chain_id
          }
          metadata {
            name
          }
          units
          uri
          creator_address
          attestations {
            count
            data {
              data
            }
          }
        }
      }
    }
  `
);

const getHypercertsByCreatorQuery = async (address: string) =>
  await request(HYPERCERTS_API_URL, hypercertsByCreatorQuery, { address });

export default getHypercertsByCreatorQuery;
