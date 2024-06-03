import { initGraphQLTada } from "gql.tada";
import { introspection } from "../graphql-eas-env";

export const gqlEas = initGraphQLTada<{
  introspection: introspection;
}>();
