import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";

// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import { HMAC_SECRET } from "../../env";
import {
  useForwardedJWT,
  useHmacSignatureValidation,
} from "@graphql-hive/gateway";

const posts = [
  {
    id: "p1",
    title: "First Post",
    content: "This is the first post",
    author: { id: "u1" },
  },
  {
    id: "p2",
    title: "Second Post",
    content: "This is the second post",
    author: { id: "u2" },
  },
  {
    id: "p3",
    title: "Third Post",
    content: "This is the third post",
    author: { id: "u3" },
  },
];

const schema = buildSubgraphSchema([
  {
    typeDefs: parse(typeDefs),
    resolvers: {
      Query: {
        posts: () => posts,
      },
      Mutation: {
        createPost: (_parent, { title, content }, ctx) => {
          const newPost = {
            id: `p${posts.length + 1}`,
            title,
            content,
            author: {
              id: ctx.jwt?.payload.sub,
            },
          };
          posts.push(newPost);
          return newPost;
        },
      },
      Post: {
        __resolveReference(post) {
          return posts.find((p) => p.id === post.id);
        },
      },
    },
  },
]);

const yoga = createYoga({
  schema,
  plugins: [
    useHmacSignatureValidation({ secret: HMAC_SECRET }),
    useForwardedJWT(),
  ],
});

Bun.serve({
  port: 4002,
  fetch: yoga,
});

console.log("🚀 Posts subgraph running at http://localhost:4002/graphql");
