import {
  createInlineSigningKeyProvider,
  defineConfig,
} from "@graphql-hive/gateway";
import { JWT_SECRET } from "./env";

export const gatewayConfig = defineConfig({
  jwt: {
    signingKeyProviders: [createInlineSigningKeyProvider(JWT_SECRET)],
  },
});
