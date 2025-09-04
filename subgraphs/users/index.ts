import { buildSubgraphSchema } from "@apollo/subgraph";
import { useHmacSignatureValidation } from "@graphql-hive/gateway";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";
import { HMAC_SECRET } from "~env";
import typeDefs from "./typeDefs.graphql" with { type: "text" };

const users = [
  {
    id: "u1",
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: "u2",
    name: "Bob",
    email: "bob@example.com",
  },
  {
    id: "u3",
    name: "Charlie",
    email: "charlie@example.com",
  },
];

const yoga = createYoga({
  schema: buildSubgraphSchema([
    {
      typeDefs: parse(typeDefs),
      resolvers: {
        Query: {
          users: () => users,
        },
        User: {
          __resolveReference: (user) => users.find((u) => u.id === user.id),
        },
      },
    },
  ]),
  plugins: [useHmacSignatureValidation({ secret: HMAC_SECRET })],
});

const server = Bun.serve({
  port: 4001,
  fetch: yoga,
});

console.log(
  `Products subgraph running at http://localhost:${server.port}/graphql`,
);
