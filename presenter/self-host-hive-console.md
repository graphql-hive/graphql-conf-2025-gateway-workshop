```sh
pnpm graphql:generate
pnpm build
pnpm docker:build
```

```sh
export HIVE_ENCRYPTION_SECRET=$(openssl rand -hex 16)
export HIVE_APP_BASE_URL="http://localhost:8080"
export HIVE_EMAIL_FROM="no-reply@graphql-hive.com"
export SUPERTOKENS_API_KEY=$(openssl rand -hex 16)
export CLICKHOUSE_USER="clickhouse"
export CLICKHOUSE_PASSWORD=$(openssl rand -hex 16)
export REDIS_PASSWORD=$(openssl rand -hex 16)
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD=$(openssl rand -hex 16)
export POSTGRES_DB="registry"
export MINIO_ROOT_USER="minioadmin"
export MINIO_ROOT_PASSWORD="minioadmin"
export CDN_AUTH_PRIVATE_KEY=$(openssl rand -hex 16)
```

```sh
docker compose \
  -f docker/docker-compose.community.yml \
  up
```

```sh
docker compose \
  -f docker/docker-compose.community.yml \
  exec db bash
```

```sh
psql -U postgres
```

```sh
\x auto
\c registry
```

```sql
UPDATE "organizations"
SET "feature_flags" = jsonb_set(
  COALESCE("feature_flags", '{}'),
  '{otelTracing}',
  'true',
  true
);
```
