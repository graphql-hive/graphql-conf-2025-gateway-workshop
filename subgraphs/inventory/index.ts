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
  port: 4002,
  fetch: yoga,
});

console.log(
  `Inventory subgraph running at http://localhost:${server.port}/graphql`,
);
