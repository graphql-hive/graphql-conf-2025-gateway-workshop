import "./telemetry";

import { defineConfig } from "@graphql-hive/gateway";

export const gatewayConfig = defineConfig({
  openTelemetry: {
    traces: true,
  },
});
