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

# add @authenticated

Open gateway.config.ts

```ts
defineConfig<JWTAuthContextExtension>

genericAuth: {
  mode: "protect-granular",
  resolveUserFn: (ctx) => ctx.jwt?.payload,
},
```

Open subgraphs/users/typeDefs.graphql

We need to upgrade federation version

```gql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.7"
    import: ["@key", "@authenticated"]
  )
```

Add @authenticated to email field

Compose

Show email unauthenticated graphql query

Whole request fails, add to gateway.config.ts

```ts
reject: {
  missingToken: false,
},
```

Request goes through but whole subgraph request fails, add to gateway.config.ts

```ts
genericAuth: {
  rejectUnauthenticated: false,
},
```

Show email unauthenticated graphql query, only field is null

Add bearer token and show success

Commit

# add @requiresScopes

Open subgraphs/posts/typeDefs.graphql

We need to upgrade federation version

```gql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.7"
    import: ["@key", "@requiresScopes"]
  )
```

Add @requiresScope editor to email field

Compose

Try creating new post in url authenticated, unauthorized

We need to define and pass the scope

Open genjwt.ts and add `scope: ['editor']`

Explain that the gateway will automatically pull from scope field

User can change where scope field is by defining `genericAuth.extractScopes`

Try creating new post again, internal server error, need to implement the resolver

Open subgraphs/posts/server.ts

```ts
Mutation: {
  createPost: (_, { title, content }) => {
    posts.push({
      id: `p${posts.length + 1}`,
      title,
      content,
      author: {
        // TODO:
      },
    });
  },
},
```

Explain that we can forward the JWT token to the subgraphs in gateway.config.ts

```ts
  jwt: {
    forward: {
      payload: true,
    },
  },
```

Which will include the jwt in the graphql query extensions field when making subgraph request

To extract in subgraph define plugin in subgraphs/posts/server.ts

```ts
import { useForwardedJWT } from "@graphql-hive/gateway";
useForwardedJWT();
```

Payload will now be in yoga context

Console log the payload inside the createPost mutation but throw a TODO error

```ts
createPost: (_, { title, content }, ctx: JWTAuthContextExtension) => {
  console.log(ctx.jwt);
  throw "todo";
  posts.push({
}
```

Execute createPost in graphiql

See logs, token does not have user id

Got to genjwt and add `sub: "u2"` field, run genjwt

Use new header and execute create post

Show sub in console logs

Implement the resolver

```ts
createPost: (_, { title, content }, ctx: JWTAuthContextExtension) => {
  const userId = ctx.jwt?.payload.sub;
  if (!userId) {
    throw new Error("Unauthorized");
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
```

Execute create post works

Query posts show author and post fields too

Commit

# propagate headers

This might put the burden of understanding the jwt structure and making sure it exists

Instead we can extract the user id and forward it to the subgraph

Open gateway.config.ts

```diff
+  propagateHeaders: {
+    fromClientToSubgraphs: ({ context }) => ({
+      "x-user-id": context.jwt?.payload.sub,
+    }),
+  },
  jwt: {
-   forward: {
-     payload: true,
-   },
  },
```

Open subgraphs/posts/server.ts

```ts
createPost: (_, { title, content }, ctx: YogaInitialContext) => {
  const userId = ctx.request.headers.get("x-user-id");
  if (!userId) {
    throw new Error("Missing user id header");
  }
```

Execute create post query and require the author field to see that it is being propagated

Commit

# depth tokeb limit

Ok the system is pretty secure now

But we want to add more security features to prevent potential abuse and attacks

Common attacks on graphql endpoinds include constructing malicious queries

Like queries with nested depths or queries with crazy amount of tokens

Lets refine our subgraphs to showcase a common scenario of recursive releationships

Open subgraphs/users/typeDefs.graphql

```gql
type User {
  liked: [Post!]!
}

type Post @key(fields: "id") {
  id: ID!
}
```

Open subgraphs/users/server.ts

Add some liked posts

Compose

Show nested query with relation `posts.author.liked.author.liked`

Explain that it's not only an issue of putting stress on the subgraphs and the gateway with nested resolvers

But attacker can also construct a huge response really fast, clogging the bandwith and gateway resources

Lets protect ourselves

Open gateway.config.ts

```ts
maxDepth: 5;
```

Try execute, see query fail.

Another potential atack is not abusing the recirsive nature of graphql,

but requesting a large, but valid, query with many tokens

Show

```gql
{
  posts {
    a: content
    a: content
    a: content
    ...
  }
}
```

It is valid, but the query contains a lot of tokens here

To protect ourselves, we can limit the token size

Open gateway.config.ts

```ts
maxToken: 10;
// then increase to 1000 to allow introspection and things
```

There's even more ways to exploit a graphql schema that has common semantics

Let's say you disabled schema introspection

Open gateway.config.ts

```ts
disableIntrospection: {
  disableIf: () => true,
},
```

Refresh graphiql, show no types or documentation.

Explain that you can enable introspection for auth users and how

Refresh again, show types when header is set with jwt

We're safer now...

Nope there's more!

Execute query

```gql
{
  posts {
    contenta
  }
}
```

The error contains a suggestion on which field you were missing "you meant 'content'?"

Using a sophisticated attack, like "clairvoyance graphql", you can figure out the schema using only the validation suggestions! Even when introspection is blocked!

To protect, do

```ts
blockFieldSuggestions: true;
```

Show it works.

Much better now!

Commit

# rate limiting

Ok we got some common attacks covered

But these _still_ dont protect us against abuse

People can still try sending a lot of queries to the gateway to overwhelm it

Or to polute the database with jibberish

For example, if you spam the create post mutation - you can create a LOT of posts real fast

Let's protect that field by rate limiting it

Open subgraphs/posts/typeDefs.graphql

```gql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.7"
    import: ["@key", "@requiresScopes", "@composeDirective"]
  )
  @link(
    url: "https://the-guild.dev/graphql/mesh/spec/v1.0"
    import: ["@rateLimit", "@pubsubOperation"]
  )
  @composeDirective(name: "@rateLimit")

directive @rateLimit(
  max: Int
  window: String
  message: String
) on FIELD_DEFINITION

type Mutation {
  createPost: Post
    @rateLimit(
      max: 5
      window: "1m"
      message: "Too many posts created, please try again later."
    )
}
```

Compose

Then enable rate limit in gateway.config.ts

Abuse `createPost` mutation and show how it fails

TODO: explain that if you would like to rate limit the whole gateway it would be best to use nginx, proxy, cloudflare, load balancer or anything in front of the gateway

Commit
