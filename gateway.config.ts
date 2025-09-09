import {
  createInlineSigningKeyProvider,
  defineConfig,
  type JWTAuthContextExtension,
} from "@graphql-hive/gateway";
import { HMAC_SECRET, JWT_SECRET } from "./env";

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
    async getPersistedOperation(key) {
      const docs = await Bun.file("./doc.json").json();
      return docs[key];
    },
    allowArbitraryDocuments: true,
  },
});
