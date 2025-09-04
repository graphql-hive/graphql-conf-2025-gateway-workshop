import {
  defineConfig,
  loadGraphQLHTTPSubgraph,
} from "@graphql-mesh/compose-cli";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph("products", {
        endpoint: "http://localhost:4001/graphql",
        source: "./subgraphs/products/typeDefs.graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("inventory", {
        endpoint: "http://localhost:4002/graphql",
        source: "./subgraphs/inventory/typeDefs.graphql",
      }),
    },
  ],
});
