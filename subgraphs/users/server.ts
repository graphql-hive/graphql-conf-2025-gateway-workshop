import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";

// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import { useHmacSignatureValidation } from "@graphql-hive/gateway";
import { HMAC_SECRET } from "../../env";

const users = [
  {
    id: "u1",
    name: "Alice",
    email: "alice@example.com",
    liked: [{ id: "p1" }, { id: "p3" }],
  },
  { id: "u2", name: "Bob", email: "bob@example.com", liked: [{ id: "p2" }] },
  { id: "u3", name: "Charlie", email: "charlie@example.com", liked: [] },
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

const yoga = createYoga({
  schema,
  plugins: [useHmacSignatureValidation({ secret: HMAC_SECRET })],
});

Bun.serve({
  port: 4001,
  fetch: yoga.fetch,
});

console.log("🚀 Users subgraph running at http://localhost:4001/graphql");
