import "server-only";

import { ResultOf, graphql } from "@/lib/graphql";

import { HYPERCERTS_API_URL } from "../configs/hypercerts";
import request from "graphql-request";

export const AllowListRecordFragment = graphql(`
  fragment AllowListRecordFragment on AllowlistRecord {
    id
    hypercert_id
    token_id
    leaf
    entry
    user_address
    claimed
    proof
    units
    total_units
  }
`);
export type AllowListRecord = ResultOf<typeof AllowListRecordFragment>;

const query = graphql(
  `
    query allowlistRecords($address: String) {
      allowlistRecords(where: { user_address: { contains: $address } }) {
        count
        data {
          ...AllowListRecordFragment
        }
      }
    }
  `,
  [AllowListRecordFragment],
);

export async function getAllowListRecordsForAddress(address: string) {
  const res = await request(HYPERCERTS_API_URL, query, {
    address,
  });
  return res.allowlistRecords;
}
