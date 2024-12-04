import { graphql, readFragment } from "@/lib/graphql";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";
import request from "graphql-request";

const ordersQuery = graphql(
  `
    query OrdersQuery($where: OrderWhereInput, $first: Int, $offset: Int) {
      orders(where: $where, first: $first, offset: $offset) {
        count
        data {
          ...OrderFragment
        }
      }
    }
  `,
  [OrderFragment],
);

export interface GetAllListingsParams {
  first: number;
  offset: number;
  filter?: {
    chainId?: number;
    hypercertId?: string;
    signer?: `0x${string}`;
    invalidated?: boolean;
  };
}

export async function getAllListings({
  first,
  offset,
  filter,
}: GetAllListingsParams) {
  const where: Record<string, any> = {};

  if (filter?.chainId) {
    where.chainId = { eq: filter.chainId.toString() };
  }
  if (filter?.signer) {
    where.signer = { eq: filter.signer };
  }
  if (filter?.hypercertId) {
    where.hypercert_id = { eq: filter.hypercertId };
  }
  if (filter?.invalidated !== undefined) {
    where.invalidated = { eq: filter.invalidated };
  }

  const res = await request(HYPERCERTS_API_URL_GRAPH, ordersQuery, {
    first,
    offset,
    where,
  });

  if (!res.orders?.data || !res.orders?.count) {
    return {
      count: 0,
      data: [],
    };
  }

  const processedFragments = res.orders.data.map((order) => {
    return readFragment(OrderFragment, order);
  });

  return {
    count: res.orders.count,
    data: processedFragments,
  };
}
