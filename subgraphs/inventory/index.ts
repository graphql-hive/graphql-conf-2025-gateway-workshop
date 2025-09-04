import { buildSubgraphSchema } from "@apollo/subgraph";
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import { createYoga } from "graphql-yoga";
import { parse } from "graphql";
import { useHmacSignatureValidation } from "@graphql-hive/gateway";

const inventory = [
  {
    upc: "1",
    inStock: true,
  },
  {
    upc: "2",
    inStock: false,
  },
  {
    upc: "3",
    inStock: true,
  },
  {
    upc: "4",
    inStock: true,
  },
];

const yoga = createYoga({
  schema: buildSubgraphSchema([
    {
      typeDefs: parse(typeDefs),
      resolvers: {
        Query: {
          shippingEstimate: (_, { upc }) => {
            const product = inventory.find((p) => p.upc === upc);
            if (!product || !product.inStock) {
              return null;
            }
            return Math.floor(Math.random() * 10) + 1;
          },
        },
        Product: {
          __resolveReference: (ref) => {
            const found = inventory.find((i) => i.upc === ref.upc);
            if (found) {
              return { ...ref, ...found };
            }
          },
          shippingEstimate: (product) =>
            Math.floor(product.price / product.weight),
        },
      },
    },
  ]),
  plugins: [useHmacSignatureValidation({ secret: "VERY_SECRET", })],
});

const server = Bun.serve({
  port: 4002,
  fetch: yoga,
});

console.log(
  `Inventory subgraph running at http://localhost:${server.port}/graphql`,
);
