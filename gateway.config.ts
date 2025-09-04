import { createInlineSigningKeyProvider, defineConfig, type JWTExtendContextFields } from "@graphql-hive/gateway";
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Logger } from "@graphql-hive/gateway";

const log = new Logger();

openTelemetrySetup({
  log,
  contextManager: new AsyncLocalStorageContextManager(),
  traces: {
    // start jaeger with:
    // docker run --rm -p 4318:4318 -p 16686:16686 -p 4317:4317 -e 'COLLECTOR_OTLP_ENABLED=true' jaegertracing/all-in-one:1.56
    // app is available at: http://localhost:16686/
    exporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  },
  resource: {
    serviceName: "graphql-conf-2025-gateway-workshop",
    serviceVersion: "0.0.0",
  },
});

export const gatewayConfig = defineConfig({
  logging: log,
  openTelemetry: {
    traces: true,
  },
  jwt: {
    signingKeyProviders: [createInlineSigningKeyProvider("VERY_SECRET")],
    reject: {
      missingToken: false,
      invalidToken: false,
    },
  },
  genericAuth: {
    mode: "protect-granular",
    resolveUserFn: (context: { jwt?: JWTExtendContextFields }) =>
      context.jwt?.payload,
    rejectUnauthenticated: false,
  },
  disableIntrospection: {
    disableIf: ({ context }) =>
      !context.jwt?.payload?.scopes?.includes("admin"),
  },
  hmacSignature: {
    secret: "VERY_SECRET",
  },
  rateLimiting: true,
});
