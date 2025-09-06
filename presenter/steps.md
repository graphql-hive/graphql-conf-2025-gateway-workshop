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
    import: ["@rateLimit"]
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

# edfs

Enough about security, I'd like to get to something interesting

EDFS, event driven federated subscriptions

We will be using NATS as our message broker for this, lets set it up with docker

Create compose.yml

```yml
services:
  nats:
    image: nats
    ports:
      - 4222:4222
```

New terminal tab and

```sh
docker compose up
```

look at and it's running

Now lets install our the nats transport for node, which is also compatible with bun

```sh
bun i @nats-io/transport-node
```

and use it as our pubsub in the gateway.config.ts

(explain subject prefix)

```ts
import { connect } from "@nats-io/transport-node";
import { NATSPubSub } from "@graphql-hive/pubsub/nats" or "@graphql-hive/gateway";

export const gatewayConfig = defineConfig<JWTAuthContextExtension>({
  pubsub: new NATSPubSub(
    await connect({ servers: ["nats://localhost:4222"] }),
    {
      subjectPrefix: "federation",
    }
  ),
```

Ok great! Now lets set up publishing with our handy pubsubOperation directive

Open subgraphs/posts/typeDefs.graphql

(make sure to add "@pubsubOperation" to mesh link imports in gql)

```gql
directive @pubsubOperation(pubsubTopic: String!) on FIELD_DEFINITION

type Subscription {
  postCreated: Post! @pubsubOperation(pubsubTopic: "postAdded")
}
```

Explain that this will indicate to the gateway to subscribe to the "postAdded" event for subscriptions

Open subgraphs/posts/server.ts

```ts
import { NATSPubSub } from "@graphql-hive/pubsub/nats";
import { connect } from "@nats-io/transport-node";

const pubsub = new NATSPubSub<{ postAdded: { id: string } }>(
  await connect({ servers: ["nats://localhost:4222"] }),
  {
    // same as gateway
    subjectPrefix: "federation",
  },
);

createPost: () => {
  //
  pubsub.publish("postAdded", { id: newPost.id });
};
```

Subscribe to postcreated on one browser tab

Create post on other tab

(beware of [Bun.serve]: request timed out after 10 seconds. Pass `idleTimeout` to configure.)

Return to see event

Explain how the gateway resolved the rest of fields by querying subgraphs

Explain that this means you can scale your gateways but not the subgraphs to handle the load of many subscriptions

TODO: explain more?

TODO: maybe start another gateway and show that?

Commit

# otel

Ok we've come a long way!

It's time to get some insights in what's happening in the gateway

We want to see it resolving queries, how long thing takes, which subrequests are made

and of course, which queries errored out or failed for whatever reason

The best tool for that would be opentelemetry! Let's see how easy it is to set up

Before we begin, we have to prepare a service that will consume the opentelemetry traces,

for that we're going to use the great jaeger: the open source, distributed tracing platform

```yml
jaeger:
  image: cr.jaegertracing.io/jaegertracing/jaeger:2.10.0
  ports:
    - 16686:16686 # app
    - 4318:4318 # tracing over http
```

```sh
docker compose up
```

Load up http://localhost:16686/ to show it's running

Now, to set up hive gateway

First we have to install the opentelemetry toolset from their official sdk

```sh
bun add @opentelemetry/context-async-hooks @opentelemetry/exporter-trace-otlp-http
```

Open gateway.config.ts

```ts
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

openTelemetrySetup({
  contextManager: new AsyncLocalStorageContextManager(),
  traces: {
    exporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  },
  resource: {
    // identify the resource and its version
    serviceName: "federation",
    serviceVersion: "0.0.0",
  },
});

export const gatewayConfig = defineConfig({
  openTelemetry: {
    traces: true,
  },
});
```

AAAnd, thats it! Lets see how this all works

Do some requests and check jaeger (create a nested query to show off everything)

Wow that was easy! Right?

But, maybe you want to add some custom attributes to opentelemetry's traces

For example the authenticated user id?

Like with the official otel javascript sdk, we're going to import the trace from the opentelemetry api and add an attribute to it in gateway.config.ts

```ts
import { trace } from "@graphql-hive/gateway/opentelemetry/api";
genericAuth: {
    resolveUserFn: (ctx) => {
      const user = ctx.jwt?.payload;
      const span = trace.getActiveSpan();
      span!.setAttribute("user.id", user?.sub || "anonymous");
      return user;
    },
}
```

Simple as that! Now lets go back to our jaeger app and look at the traces again

(Remember to use "Find traces" button to refrehs, not a browser reload)

Look at the "graphql.context" attribute

Wow that's great, we have the attribute set in graphql's context. But

the attribute seems to be far too deep.

Thats's because we set the attribute only on that specific active span,

let's try to to set it on a root span, like for the whole request!

```ts
import { hive, trace } from "@graphql-hive/gateway/opentelemetry/api";

const otelCtx = hive.getHttpContext(ctx.request);
const span = trace.getSpan(otelCtx);
```

Nice, now look at the root http span and we'll see the user id appear!

TODO: confirm after Valentin fix

Commit
