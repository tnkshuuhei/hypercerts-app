import "server-only";

import { VariablesOf, graphql, readFragment } from "@/lib/graphql";

import { HYPERCERTS_API_URL } from "@/configs/hypercerts";
import { HypercertListFragment } from "@/hypercerts/fragments/hypercert-list.fragment";
import request from "graphql-request";

export type ClaimsOrderBy =
  | "block_number_asc"
  | "block_number_desc"
  | "claim_attestation_count_asc"
  | "claim_attestation_count_desc";

export function isClaimsOrderBy(value: string): value is ClaimsOrderBy {
  return [
    "block_number_asc",
    "block_number_desc",
    "claim_attestation_count_asc",
    "claim_attestation_count_desc",
  ].includes(value);
}

export type ClaimsFilter = "all" | "evaluated";

const query = graphql(
  `
    query AllHypercerts(
      $where: HypercertsWhereInput
      $sort: HypercertFetchInput
      $first: Int
      $offset: Int
    ) {
      hypercerts(
        where: $where
        first: $first
        offset: $offset
        count: COUNT
        sort: $sort
      ) {
        count

        data {
          ...HypercertListFragment
        }
      }
    }
  `,
  [HypercertListFragment],
);

type VariableTypes = VariablesOf<typeof query>;

function createOrderBy({
  orderBy,
}: {
  orderBy?: ClaimsOrderBy;
}): VariableTypes["sort"] {
  if (orderBy) {
    const directionDivider = orderBy.lastIndexOf("_");
    const orderByAttribute = orderBy.substring(0, directionDivider);
    const orderByDirection = orderBy.substring(directionDivider + 1);
    if (orderByAttribute === "block_number") {
      return {
        by: {
          block_number: orderByDirection === "asc" ? "ascending" : "descending",
        },
      };
    }
    if (orderByAttribute === "claim_attestation_count") {
      return {
        by: {
          claim_attestation_count:
            orderByDirection === "asc" ? "ascending" : "descending",
        },
      };
    }
  }
  return {
    by: {
      block_number: "descending",
    },
  };
}

function createFilter({
  filter,
  search,
  chainId,
}: {
  filter?: ClaimsFilter;
  search?: string;
  chainId?: number;
}): VariableTypes["where"] {
  const where: VariableTypes["where"] = {};
  if (search && search.length > 2) {
    where.metadata = { name: { contains: search } };
  }
  if (filter === "evaluated") {
    where.attestations = {};
  }
  if (chainId) {
    where.contract = {
      chain_id: {
        eq: chainId.toString(),
      },
    };
  }
  return where;
}

export type GetAllHypercertsParams = {
  first: number;
  offset: number;
  orderBy?: ClaimsOrderBy;
  search?: string;
  filter?: ClaimsFilter;
  chainId?: number;
};

export async function getAllHypercerts({
  first,
  offset,
  orderBy,
  search,
  filter,
  chainId,
}: GetAllHypercertsParams) {
  const res = await request(HYPERCERTS_API_URL, query, {
    first,
    offset,
    sort: createOrderBy({ orderBy }),
    where: createFilter({ search, filter, chainId }),
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
