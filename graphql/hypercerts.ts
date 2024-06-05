import { initGraphQLTada } from "gql.tada";
import { introspection } from "../graphql-hypercerts-env";

export const gqlHypercerts = initGraphQLTada<{
  introspection: introspection;
}>();
