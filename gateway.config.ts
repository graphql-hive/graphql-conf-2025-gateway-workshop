import {
  createInlineSigningKeyProvider,
  defineConfig,
  NATSPubSub,
  type JWTAuthContextExtension,
} from "@graphql-hive/gateway";
import { HMAC_SECRET, JWT_SECRET } from "./env";
import { connect } from "@nats-io/transport-node";

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
    resolveUserFn: (ctx) => ctx.jwt?.payload,
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
});
