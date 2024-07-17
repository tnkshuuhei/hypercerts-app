import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { CollectionFragment } from "./collection.fragment";
import request from "graphql-request";
import { HYPERCERTS_API_URL_GRAPHQL } from "@/lib/constants";

const query = graphql(
  `
    query Collection($admin_address: String!) {
      collections(where: { admin_id: { eq: $admin_address } }) {
        data {
          ...CollectionFragment
        }
      }
    }
  `,
  [CollectionFragment],
);

export async function getCollectionsByAdminAddress(adminAddress: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPHQL, query, {
    admin_address: adminAddress,
  });

  const collectionsFragment = res.collections?.data;
  if (!collectionsFragment) {
    return undefined;
  }

  return readFragment(CollectionFragment, collectionsFragment);
}
