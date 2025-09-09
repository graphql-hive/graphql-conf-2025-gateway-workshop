import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga, type YogaInitialContext } from "graphql-yoga";

// @ts-expect-error
import typeDefs from "./typeDefs.graphql" with { type: "text" };
import {
  useForwardedJWT,
  useHmacSignatureValidation,
  type JWTAuthContextExtension,
} from "@graphql-hive/gateway";
import { HMAC_SECRET } from "../../env";

const posts = [
  {
    id: "p1",
    title: "Post 1",
    content: "Content 1",
    author: { id: "u1" },
  },
  {
    id: "p2",
    title: "Post 2",
    content: "Content 2",
    author: { id: "u2" },
  },
  {
    id: "p3",
    title: "Post 3",
    content: "Content 3",
    author: { id: "u1" },
  },
];

const schema = buildSubgraphSchema({
  typeDefs: parse(typeDefs),
  resolvers: {
    Query: {
      posts: () => posts,
    },
    Mutation: {
      createPost: (_, { title, content }, ctx) => {
        const newPost = {
          id: `p${posts.length + 1}`,
          title,
          content,
          author: {
            id:
              (ctx as YogaInitialContext).request.headers.get("x-user-id") ||
              "unknown",
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
});

const yoga = createYoga({
  schema,
  plugins: [
    useHmacSignatureValidation({ secret: HMAC_SECRET }),
    useForwardedJWT(),
  ],
});

Bun.serve({
  port: 4002,
  fetch: yoga.fetch,
});

console.log("🚀 Posts subgraph running at http://localhost:4002/graphql");
