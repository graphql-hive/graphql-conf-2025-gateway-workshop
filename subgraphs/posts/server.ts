import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";

// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import { idText } from "typescript";

const posts = [
  {
    id: "post-1",
    title: "Post 1",
    content: "Content 1",
    authorId: { id: "u1" },
  },
  {
    id: "post-2",
    title: "Post 2",
    content: "Content 2",
    authorId: { id: "u2" },
  },
  {
    id: "post-3",
    title: "Post 3",
    content: "Content 3",
    authorId: { id: "u1" },
  },
];

const schema = buildSubgraphSchema({
  typeDefs: parse(typeDefs),
  resolvers: {
    Posts: {
      __resolveReference(post) {
        return posts.find((p) => p.id === post.id);
      },
    },
  },
});

const yoga = createYoga({ schema });

Bun.serve({
  port: 4002,
  fetch: yoga.fetch,
});

console.log("🚀 Posts subgraph running at http://localhost:4002/graphql");
