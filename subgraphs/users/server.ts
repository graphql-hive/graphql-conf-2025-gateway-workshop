import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";

// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };

const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
  { id: "3", name: "Charlie", email: "charlie@example.com" },
];

const schema = buildSubgraphSchema({
  typeDefs: parse(typeDefs),
  resolvers: {
    User: {
      __resolveReference(user) {
        return users.find((u) => u.id === user.id);
      },
    },
  },
});

const yoga = createYoga({ schema });

Bun.serve({
  port: 4001,
  fetch: yoga.fetch,
});

console.log("🚀 Users subgraph running at http://localhost:4001/graphql");
