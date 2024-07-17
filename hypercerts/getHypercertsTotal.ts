import "server-only";

import { graphql } from "@/lib/graphql";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(`
  query hypercertsTotal {
    hypercerts(count: COUNT) {
      count
    }
  }
`);

export async function getHypercertsTotal() {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query);
  return res.hypercerts.count;
}
