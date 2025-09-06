TODO: introspection without auth

# bun init

After installing bun, initialise the repository with `bun init`. Some files have been removed for brevity.

Commit

# add prettier

Install and configure prettier for code consistency and format on save.

```sh
bun add prettier
```

Add "format" script to package.json.

# create subgraphs

Since this is a monorepo, we'll have subgraphs as workspaces.

Create subgraphs/users/package.json

```json
{
  "name": "users"
}
```

Create subgraphs/posts/package.json

```json
{
  "name": "posts"
}
```

Define "workspaces" in package.json

```sh
bun i
```

Create subgraphs/users/typeDefs.graphql

```gql
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}
```

```sh
cd subgraphs/users
bun add graphql @apollo/subgraph graphql-yoga
```

Create subgraphs/users/server.ts

```ts
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { createYoga } from "graphql-yoga";
// @ts-expect-error
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

const schema = buildSubgraphSchema([
  {
    typeDefs: parse(typeDefs),
    resolvers: {
      User: {
        __resolveReference: (user) => users.find((u) => u.id === user.id),
      },
    },
  },
]);

const yoga = createYoga({ schema });

Bun.serve({
  port: 4001,
  fetch: yoga,
});

console.log("Users subgraph running on http://localhost:4001/graphql");
```

```sh
bun run server.ts
```

Works

Add "start" with --watch script to package.json

```sh
bun start
```

Open new terminal tab

```sh
../posts
```

Create subgraphs/posts/typeDefs.graphql

```gql
type Query {
  posts: [Post!]!
}

type Post @key(fields: "id") {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type User @key(fields: "id") {
  id: ID!
}
```

Copy package.json from users to posts

Change "name" to posts

```sh
bun i
```

Copy server.ts from users to posts

Change data to posts

Change resolvers

Change port and log

```sh
bun start
```

Open new terminal tab

Commit

# compose

cd to root

```sh
bun add @graphql-mesh/compose-cli
```

Create mesh.config.ts

```ts
import {
  defineConfig,
  loadGraphQLHTTPSubgraph,
} from "@graphql-mesh/compose-cli";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph("users", {
        endpoint: "http://localhost:4001/graphql",
        source: "./subgraphs/users/typeDefs.graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("posts", {
        endpoint: "http://localhost:4002/graphql",
        source: "./subgraphs/posts/typeDefs.graphql",
      }),
    },
  ],
});
```

Add "compose" script to package.json

```sh
mesh-compose -o supergraph.graphql
```

```sh
bun compose
```

.prettierignore supergraph.graphql

Commit

# set up gateway

```sh
bun add @graphql-hive/gateway
```

Add "start" to package.json

```sh
hive-gateway supergraph
```

```sh
bun start
```

Visit gateway url

```gql
{
  posts {
    title
    author {
      name
    }
  }
}
```

Make gateway auto-restart, change "start" script

```sh
bun run --watch node_modules/.bin/hive-gateway supergraph
```

```sh
bun start
```

Open new terminal tab

Commit

# set up jwt

Create env.ts

```ts
export const JWT_SECRET = "123";
```

Create gateway.config.ts

```ts
import {
  createInlineSigningKeyProvider,
  defineConfig,
} from "@graphql-hive/gateway";
import { JWT_SECRET } from "./env";

export const gatewayConfig = defineConfig({
  jwt: {
    signingKeyProviders: [createInlineSigningKeyProvider(JWT_SECRET)],
  },
});
```

Gateway is automatically restarted

Visit gateway url and graphql, show unauthenticated

Empty terminal tab

```sh
bun add jsonwebtoken
```

Create genjwt.ts

```ts
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";

const payload = {};

const token = jwt.sign(payload, JWT_SECRET);

console.log(JSON.stringify({ Authorization: `Bearer ${token}` }));
```

```sh
bun genjwt.ts
```

Use token in gateway url show authenticated

Commit

# set up hmac

Open env.ts

```ts
export const HMAC_SECRET = "321";
```

Open subgraphs/users/server.ts

Add to plugins

```ts
import { useHmacSignatureValidation } from "@graphql-hive/gateway";
import { HMAC_SECRET } from "../../env";
[useHmacSignatureValidation({ secret: HMAC_SECRET })];
```

Do the same in subgraphs/posts/server.ts

Subgraphs are automatically restarted

Try query gateway, internal server error, show subgraph logs

Open gateway.config.ts

```ts
hmacSignature: {
  secret: HMAC_SECRET,
}
```

Query again, working

Commit
