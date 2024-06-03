import "server-only";

import { VariablesOf, readFragment } from "gql.tada";

import { HYPERCERTS_API_URL } from "../configs/hypercerts";
import { HypercertListFragment } from "./fragments/hypercert-list.fragment";
import { gqlHypercerts } from "../graphql/hypercerts";
import request from "graphql-request";

export type ClaimsOrderBy =
  | "timestamp_asc"
  | "timestamp_desc"
  | "name_asc"
  | "name_desc"
  | "attestations_asc"
  | "attestations_desc";

export type ClaimsFilter = "all" | "evaluated";

const query = gqlHypercerts(
  `
    query AllHypercerts($where: HypercertsWhereInput, $sort: HypercertFetchInput, $first: Int, $offset: Int) {
      hypercerts(where: $where, first: $first, offset: $offset, count: COUNT, sort: $sort) {
        count
        data {
          ...HypercertListFragment
        }
      }
    }
  `,
  [HypercertListFragment]
);

type VariableTypes = VariablesOf<typeof query>;

function createOrderBy({
  orderBy,
}: {
  orderBy?: ClaimsOrderBy;
}): VariableTypes["sort"] {
  if (orderBy) {
    const orderByAttribute = orderBy.split("_")[0];
    const orderByDirection = orderBy.split("_")[1];
    if (orderByAttribute === "timestamp") {
      return {
        by: {
          creation_block_timestamp:
            orderByDirection === "asc" ? "ascending" : "descending",
        },
      };
    }
    if (orderByAttribute === "attestations") {
      return {
        by: {
          claim_attestation_count:
            orderByDirection === "asc" ? "ascending" : "descending",
        },
      };
    }
  }
}

function createFilter({
  filter,
  search,
}: {
  filter?: ClaimsFilter;
  search?: string;
}): VariableTypes["where"] {
  const where: VariableTypes["where"] = {};
  if (search && search.length > 2) {
    where.metadata = { name: { contains: search } };
  }
  if (filter === "evaluated") {
    where.attestations = {};
  }
  return where;
}

type GetAllHypercertsParams = {
  first: number;
  offset: number;
  orderBy?: ClaimsOrderBy;
  search?: string;
  filter?: ClaimsFilter;
};

export async function getAllHypercerts({
  first,
  offset,
  orderBy,
  search,
  filter,
}: GetAllHypercertsParams) {
  const res = await request(HYPERCERTS_API_URL, query, {
    first,
    offset,
    sort: createOrderBy({ orderBy }),
    where: createFilter({ search, filter }),
  });

  // TODO: Throw error?
  if (!res.hypercerts?.data) {
    return undefined;
  }

  const processedFragments = res.hypercerts.data.map((hypercert) => {
    return readFragment(HypercertListFragment, hypercert);
  });

  return {
    count: res.hypercerts.count,
    data: processedFragments,
  };
}
