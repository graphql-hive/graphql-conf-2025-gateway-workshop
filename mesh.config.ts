import {
  defineConfig,
  loadGraphQLHTTPSubgraph,
} from "@graphql-mesh/compose-cli";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph("users", {
        endpoint: "http://localhost:4001/graphql",
        source: "./subgraphs/users/typeDefs.graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("posts", {
        endpoint: "http://localhost:4002/graphql",
        source: "./subgraphs/posts/typeDefs.graphql",
      }),
    },
  ],
  additionalTypeDefs: /* GraphQL */ `
    extend schema {
      subscription: Subscription
    }
    type Subscription {
      postAdded: Post! @resolveTo(pubsubTopic: "postAdded")
    }
  `,
});
