import {
  createInlineSigningKeyProvider,
  defineConfig,
  NATSPubSub,
  type GatewayPlugin,
  type JWTAuthContextExtension,
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
    exporter: new OTLPTraceExporter({
      url: "http://localhost:54318/v1/traces",
    }),
  },
  resource: {
    serviceName: "gateway",
    serviceVersion: "1.0.0",
  },
});

export const gatewayConfig = defineConfig<JWTAuthContextExtension>({
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
      const otelctx = hive.getHttpContext(ctx.request);
      const span = trace.getSpan(otelctx!);
      span?.setAttribute("user.id", user?.sub ?? "anonymous");
      return user;
    },
    rejectUnauthenticated: false,
  },
  propagateHeaders: {
    fromClientToSubgraphs: ({ context }) => ({
      "x-user-id": context.jwt?.payload.sub,
    }),
  },
  maxDepth: 5,
  maxTokens: 1000,
  disableIntrospection: {
    disableIf: ({ context }) => !context.jwt?.payload,
  },
  blockFieldSuggestions: true,
  rateLimiting: true,
  persistedDocuments: {
    getPersistedOperation: async (key) => {
      const docs = await Bun.file("./docs.json").json();
      return docs[key];
    },
    allowArbitraryDocuments: true,
  },
  // graphiql: false,
  pubsub: new NATSPubSub(
    await connect({ servers: ["nats://localhost:4222"] }),
    {
      subjectPrefix: "gw",
    }
  ),
  plugins: ({ log }) => [
    {
      onRequest({ request, endResponse }) {
        if (request.url.endsWith("/toggle-debug")) {
          log.setLevel(log.level === "debug" ? "info" : "debug");
          log.info(`Toggled log level to ${log.level}`);
          endResponse(new Response(`Toggled log level to ${log.level}`));
        }
      },
    } as GatewayPlugin,
  ],
  openTelemetry: {
    traces: true,
  },
});
