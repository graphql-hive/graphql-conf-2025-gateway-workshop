import { buildSubgraphSchema } from "@apollo/subgraph";
import { useHmacSignatureValidation } from "@graphql-hive/gateway";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";
import { HMAC_SECRET } from "~env";
import typeDefs from "./typeDefs.graphql" with { type: "text" };

const products = [
  {
    upc: "1",
    name: "Laptop",
    price: 999,
    weight: 30,
  },
  {
    upc: "2",
    name: "Smartphone",
    price: 699,
    weight: 5,
  },
  {
    upc: "3",
    name: "Headphones",
    price: 199,
    weight: 4,
  },
  {
    upc: "4",
    name: "Monitor",
    price: 299,
    weight: 50,
  },
];

const yoga = createYoga({
  schema: buildSubgraphSchema([
    {
      typeDefs: parse(typeDefs),
      resolvers: {
        Query: {
          topProducts: (_, args) => products.slice(0, args.first),
        },
        Product: {
          __resolveReference: (product) =>
            products.find((p) => p.upc === product.upc),
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
