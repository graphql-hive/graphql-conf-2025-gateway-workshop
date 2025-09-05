import {
  createInlineSigningKeyProvider,
  defineConfig,
  type JWTAuthContextExtension,
} from "@graphql-hive/gateway";
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { NATSPubSub } from "@graphql-hive/pubsub/nats";
import { connect } from "@nats-io/transport-node";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HMAC_SECRET, JWT_SECRET } from "~env";

openTelemetrySetup({
  // using a context menager will help bind traces to asyncronous operations
  contextManager: new AsyncLocalStorageContextManager(),
  traces: {
    // docker compose up jaeger
    exporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  },
  resource: {
    // identify the resource and its version
    serviceName: "graphql-conf-2025-gateway-workshop",
    serviceVersion: "0.0.0",
  },
});

export const gatewayConfig = defineConfig<JWTAuthContextExtension>({
  pubsub: new NATSPubSub(await connect({ servers: ["localhost:4222"] }), {
    // we make sure to use the same prefix for all gateways and publishers
    // think of it as an application identifier
    subjectPrefix: "my-app",
  }),
  openTelemetry: {
    // enables otel in the gateway
    traces: true,
  },
  propagateHeaders: {
    // we want to forward the authorization header to the subgraphs
    fromClientToSubgraphs: ({ context }) => ({
      "x-user-id": context.jwt?.payload.sub,
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
  maxTokens: 100,
});
