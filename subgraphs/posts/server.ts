import { buildSubgraphSchema } from "@apollo/subgraph";
import {
  useForwardedJWT,
  useHmacSignatureValidation,
} from "@graphql-hive/gateway";
import { parse } from "graphql";
import { createYoga, type YogaInitialContext } from "graphql-yoga";
import { HMAC_SECRET } from "../../env";
// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };

const posts = [
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

const schema = buildSubgraphSchema([
  {
    typeDefs: parse(typeDefs),
    resolvers: {
      Query: {
        posts: () => posts,
      },
      Mutation: {
        createPost: (_, { title, content }, ctx: YogaInitialContext) => {
          const userId = ctx.request.headers.get("x-user-id");
          if (!userId) {
            throw new Error("Missing user id header");
          }
          const newPost = {
            id: `p${posts.length + 1}`,
            title,
            content,
            author: {
              id: userId,
            },
          };
          posts.push(newPost);
          return newPost;
        },
      },
      Post: {
        __resolveReference: (post) => posts.find((p) => p.id === post.id),
      },
    },
  },
]);

const yoga = createYoga({
  schema,
  plugins: [
    useHmacSignatureValidation({ secret: HMAC_SECRET }),
    useForwardedJWT({}),
  ],
});

Bun.serve({
  port: 4002,
  fetch: yoga,
});

console.log("Posts subgraph running on http://localhost:4002/graphql");
