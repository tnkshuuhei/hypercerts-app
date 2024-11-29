import "server-only";

import { graphql, readFragment } from "@/lib/graphql";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";
import request from "graphql-request";

const ordersQuery = graphql(
  `
    query OrdersQuery($where: OrderWhereInput) {
      orders(where: $where) {
        count
        data {
          ...OrderFragment
        }
      }
    }
  `,
  [OrderFragment],
);

interface GetOrdersParams {
  filter?: {
    chainId?: bigint | number | string;
    signer?: `0x${string}`;
    hypercertId?: string;
  };
}

export async function getOrders({ filter }: GetOrdersParams) {
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

  const res = await request(HYPERCERTS_API_URL_GRAPH, ordersQuery, { where });

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
