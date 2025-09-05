import { $ } from "bun";
import { registry } from "../hive.json" with { type: "json" };

await $`hive schema:publish \
  --service users \
  --url http://localhost:4001/graphql \
  --target ${registry.target} \
  subgraphs/users/typeDefs.graphql`;

await $`hive schema:publish \
  --service posts \
  --url http://localhost:4002/graphql \
  --target ${registry.target} \
  subgraphs/posts/typeDefs.graphql`;

// we need to add the additional type definitions for subscriptions
await $`bun mesh-compose -o supergraph.graphql`;
