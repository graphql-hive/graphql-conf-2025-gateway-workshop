import {
  createInlineSigningKeyProvider,
  defineConfig,
} from "@graphql-hive/gateway";
import { HMAC_SECRET, JWT_SECRET } from "./env";

export const gatewayConfig = defineConfig({
  jwt: {
    signingKeyProviders: [createInlineSigningKeyProvider(JWT_SECRET)],
  },
  hmacSignature: {
    secret: HMAC_SECRET,
  },
});
