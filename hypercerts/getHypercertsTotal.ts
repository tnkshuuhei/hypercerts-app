import "server-only";

import { HYPERCERTS_API_URL_GRAPH } from "@/configs/hypercerts";
import { graphql } from "@/lib/graphql";
import request from "graphql-request";

const query = graphql(`
  query hypercertsTotal {
    hypercerts {
      count
    }
  }
`);

export async function getHypercertsTotal() {
  const res = await request(HYPERCERTS_API_URL_GRAPH, query);
  return res.hypercerts.count;
}
