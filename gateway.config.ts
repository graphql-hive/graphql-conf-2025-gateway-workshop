import {
  createInlineSigningKeyProvider,
  defineConfig,
  type GatewayPlugin,
  type JWTAuthContextExtension,
} from "@graphql-hive/gateway";
import { hiveTracingSetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { NATSPubSub } from "@graphql-hive/pubsub/nats";
import { connect } from "@nats-io/transport-node";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { HMAC_SECRET, JWT_SECRET } from "~env";
import hiveConf from "./hive.json" with { type: "json" };

hiveTracingSetup({
  contextManager: new AsyncLocalStorageContextManager(),
  endpoint: hiveConf.registry.traceEndpoint,
  target: hiveConf.registry.target,
  accessToken: hiveConf.registry.accessToken,
});

export const gatewayConfig = defineConfig<JWTAuthContextExtension>({
  supergraph: {
    type: "hive",
    endpoint: hiveConf.cdn.endpoint,
    key: hiveConf.cdn.key,
  },
  pubsub: new NATSPubSub(await connect({ servers: ["localhost:4222"] }), {
    // we make sure to use the same prefix for all gateways and publishers
    // think of it as an application identifier
    // TODO: the gatway will resolve all missing fields from subgraphs automatically
    subjectPrefix: "my-app",
  }),
  openTelemetry: {
    // enables otel in the gateway
    traces: true,
  },
  propagateHeaders: {
    // we want to forward the authenticated user to the subgraphs
    fromClientToSubgraphs: ({ context }) => ({
      "x-user-id": context.jwt?.payload?.sub,
    }),
  },
  jwt: {
    signingKeyProviders: [
      // verifies the jwt signature locally
      createInlineSigningKeyProvider(JWT_SECRET),
    ],
    reject: {
      // wont reject requests when token is missing
      missingToken: false,
      // wont reject requests when tokens are invalid
      invalidToken: false,
    },
  },
  // TODO: enabling introspection wihtou beingauthenticatd
  genericAuth: {
    // instructs gateway to use the auth directive (like @authenticated, @requiresScopes, @policy)
    mode: "protect-granular",
    // wont completely reject unauthenticated requests, but will not execute the field
    rejectUnauthenticated: false,
    // resolve the user from the token and provides it for the auth directives
    // omitted extractScopes function which by default uses `payload.scope`
    resolveUserFn: (context) => context.jwt?.payload,
  },
  disableIntrospection: {
    // only disables introspection for non-admins
    // TODO: admins should be able to introspect
    disableIf: ({ context }) => !context.jwt?.payload?.scope?.includes("admin"),
  },
  hmacSignature: {
    // hash secret used to verify the integrity of the gateway request to subgraphs
    secret: HMAC_SECRET,
  },
  // enables rate limiting
  rateLimiting: true,
  // caches the responses from subgraphs of identical queries for the same session
  responseCaching: {
    session: (req) => req.headers.get("authorization"),
  },
  // depth limiting
  maxDepth: 6,
  // token limiting
  maxTokens: 1000,
  reporting: {
    type: "hive",
    target: hiveConf.registry.target,
    token: hiveConf.registry.accessToken,
    selfHosting: {
      // we're running a selfhosted Hive registry
      graphqlEndpoint: hiveConf.registry.endpoint,
      usageEndpoint: hiveConf.registry.usageEndpoint,
      applicationUrl: hiveConf.registry.applicationUrl,
    },
    // TODO: missing client info in hive console insights tab
  },
  plugins: ({ log }) => [
    {
      // ⚠️ insecure and should not be used in production
      onRequest({ request, endResponse }) {
        if (request.url.endsWith("/toggle-debug-log-level")) {
          // we use the (plugin) context logger to make sure all child loggers inherit the change
          log.setLevel(log.level === "debug" ? "info" : "debug");
          log.info(`Log level changed to ${log.level}`);
          endResponse(new Response(`Log level set to ${log.level}`));
        }
      },
    } as GatewayPlugin,
  ],
  additionalTypeDefs: /* GraphQL */ `
    extend schema {
      subscription: Subscription
    }
    type Subscription {
      newPost: Post! @resolveTo(pubsubTopic: "newPost")
    }
  `,
});
