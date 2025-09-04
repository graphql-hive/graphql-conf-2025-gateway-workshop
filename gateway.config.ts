import {
  createInlineSigningKeyProvider,
  defineConfig,
  type JWTExtendContextFields,
} from "@graphql-hive/gateway";
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Logger } from "@graphql-hive/gateway";
import { HMAC_SECRET, JWT_SECRET } from "~env";

const log = new Logger();

openTelemetrySetup({
  log,
  // using a context menager will help bind traces to asyncronous operations
  contextManager: new AsyncLocalStorageContextManager(),
  traces: {
    // start jaeger with:
    // docker run --rm -p 4318:4318 -p 16686:16686 -p 4317:4317 -e 'COLLECTOR_OTLP_ENABLED=true' jaegertracing/all-in-one:1.56
    // app is available at: http://localhost:16686/
    exporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  },
  resource: {
    // identify the resource and its version
    serviceName: "graphql-conf-2025-gateway-workshop",
    serviceVersion: "0.0.0",
  },
});

export const gatewayConfig = defineConfig({
  logging: log,
  openTelemetry: {
    // enables otel in the gateway
    traces: true,
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
    // instructs gateway to use the `@authenticated` directive
    mode: "protect-granular",
    // wont completely reject unauthenticated requests, but will not execute the field
    rejectUnauthenticated: false,
    // resolve the user from the token and provides it for the auth directives
    // omitted extractScopes function which by default uses `payload.scope`
    resolveUserFn: (context) => context.jwt?.payload,
  },
  disableIntrospection: {
    // only disables introspection for non-admins
    disableIf: ({ context }) =>
      !context.jwt?.payload?.scopes?.includes("admin"),
  },
  hmacSignature: {
    // hash secret used to verify the integrity of the gateway request to subgraphs
    secret: HMAC_SECRET,
  },
  // enables rate limiting
  rateLimiting: true,
  // depth limiting is enabled by default with 8 max depth
  // maxDepth: 8,
  // token limiting is enabled by default with 1000 tokens
  // maxLimit: 1000,
});
