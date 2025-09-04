import { buildSubgraphSchema } from "@apollo/subgraph";
import { useHmacSignatureValidation } from "@graphql-hive/gateway";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";
import { HMAC_SECRET } from "~env";
import typeDefs from "./typeDefs.graphql" with { type: "text" };

let posts = [
  {
    id: "p1",
    title: "GraphQL Basics",
    content: "An introduction to GraphQL...",
    author: { id: "u1" },
  },
  {
    id: "p2",
    title: "Advanced GraphQL",
    content: "Deep dive into GraphQL features...",
    author: { id: "u1" },
  },
  {
    id: "p3",
    title: "GraphQL in Production",
    content: "Best practices for using GraphQL in production...",
    author: { id: "u2" },
  },
];

const yoga = createYoga({
  schema: buildSubgraphSchema([
    {
      typeDefs: parse(typeDefs),
      resolvers: {
        Query: {
          posts: () => posts,
        },
        Mutation: {
          createPost: (_, { title, content }) => {
            const newPost = {
              id: `p${posts.length + 1}`,
              title,
              content,
              author: { id: "u1" }, // TODO: get from token
            };
            posts = [...posts, newPost];
            return newPost;
          },
          deletePost: (_, { id }) => {
            const deletedPost = posts.find((p) => p.id === id);
            posts = posts.filter((p) => p !== deletedPost);
            return deletedPost;
          },
        },
        Post: {
          __resolveReference: (post) => posts.find((p) => p.id === post.id),
        },
      },
    },
  ]),
  plugins: [useHmacSignatureValidation({ secret: HMAC_SECRET })],
});

const server = Bun.serve({
  port: 4002,
  fetch: yoga,
});

console.log(
  `Posts subgraph running at http://localhost:${server.port}/graphql`,
);
