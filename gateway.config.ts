import { defineConfig } from "@graphql-hive/gateway";
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Logger } from "@graphql-hive/gateway";

const log = new Logger();

openTelemetrySetup({
  log,
  contextManager: new AsyncLocalStorageContextManager(),
  traces: {
    // docker run --rm -p 4318:4318 -p 16686:16686 -p 4317:4317 -e 'COLLECTOR_OTLP_ENABLED=true' jaegertracing/all-in-one:1.56
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
});
