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
    forward: {
      payload: true,
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
});
