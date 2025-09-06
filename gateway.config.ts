import {
  createInlineSigningKeyProvider,
  defineConfig,
  type GatewayPlugin,
  type JWTAuthContextExtension,
  NATSPubSub,
} from "@graphql-hive/gateway";
import { HMAC_SECRET, JWT_SECRET } from "./env";
import { connect } from "@nats-io/transport-node";
import { openTelemetrySetup } from "@graphql-hive/gateway/opentelemetry/setup";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { hive, trace } from "@graphql-hive/gateway/opentelemetry/api";

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

export const gatewayConfig = defineConfig<JWTAuthContextExtension>({
  openTelemetry: {
    traces: true,
  },
  pubsub: new NATSPubSub(await connect({ servers: ["localhost:4222"] }), {
    subjectPrefix: "federation",
  }),
  propagateHeaders: {
    fromClientToSubgraphs: ({ context }) => ({
      "x-user-id": context.jwt?.payload.sub,
    }),
  },
  jwt: {
    signingKeyProviders: [createInlineSigningKeyProvider(JWT_SECRET)],
    reject: {
      missingToken: false,
    },
  },
  hmacSignature: {
    secret: HMAC_SECRET,
  },
  genericAuth: {
    mode: "protect-granular",
    resolveUserFn: (ctx) => {
      const user = ctx.jwt?.payload;
      const otelCtx = hive.getHttpContext(ctx.request);
      const span = trace.getSpan(otelCtx!);
      span!.setAttribute("user.id", user?.sub || "anonymous");
      return user;
    },
    rejectUnauthenticated: false,
  },
  maxDepth: 5,
  maxTokens: 1000,
  disableIntrospection: {
    disableIf: ({ context }) => !context.jwt?.payload,
  },
  blockFieldSuggestions: true,
  rateLimiting: true,
  plugins: ({ log }) => [
    {
      onRequest({ request, endResponse }) {
        if (request.url.endsWith("/toggle-debug")) {
          log.setLevel(log.level === "debug" ? "info" : "debug");
          log.info(`Changed log level to ${log.level}`);
          endResponse(new Response(`Log level is now ${log.level}`));
        }
      },
    } as GatewayPlugin,
  ],
});
