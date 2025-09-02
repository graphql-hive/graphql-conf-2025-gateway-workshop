import { buildSubgraphSchema } from "@apollo/subgraph";
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import { createYoga } from "graphql-yoga";
import { parse } from "graphql";

const yoga = createYoga({
  schema: buildSubgraphSchema([
    {
      typeDefs: parse(typeDefs),
      // TODO: resolvers
    },
  ]),
});

const server = Bun.serve({
  port: 4001,
  fetch: yoga,
});

console.log(
  `Products subgraph running at http://localhost:${server.port}/graphql`,
);
