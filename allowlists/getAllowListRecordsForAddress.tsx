import "server-only";

import { HYPERCERTS_API_URL } from "../configs/hypercerts";
import { graphql } from "@/lib/graphql";
import request from "graphql-request";

const query = graphql(`
  query allowlistRecords($address: String) {
    allowlistRecords(where: { user_address: { contains: $address } }) {
      count
      data {
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
    }
  }
`);

export async function getAllowListRecordsForAddress(address: string) {
  const res = await request(HYPERCERTS_API_URL, query, {
    address,
  });
  return res.allowlistRecords;
}
