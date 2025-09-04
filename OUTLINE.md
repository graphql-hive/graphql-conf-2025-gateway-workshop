# Workshop: Unleash the Power of Federation with Hive Gateway v2

**Duration:** 90 minutes
**Format:** Live coding with audience participation
**Prerequisites:** Basic GraphQL knowledge, federation familiarity

## Workshop Outline

### Opening (5 minutes)

- Welcome & what we'll build together
- Quick overview of Hive Gateway v2 highlights
- Demo environment setup

### Part 1: Foundation Setup (20 minutes)

**Goal:** Build a simple federated setup from scratch

#### 1.1 Create Two Simple Subgraphs (15 minutes)

- **Users subgraph**: `{ id, name, email, role }` with GraphQL Yoga
- **Posts subgraph**: `{ id, title, content, authorId }` with federation key on User, also GraphQL Yoga
- Live code both subgraphs
- Add `@authenticated` directive to sensitive fields (like email)
- Add `@requiresScopes` directive to admin-only fields (like role)
- Explain federation directives as we write them

#### 1.2 Bootstrap Hive Gateway (5 minutes)

- Install and configure Hive Gateway v2
- Connect to our two subgraphs
- First federated query across schemas

### Part 2: Production Features (45 minutes)

#### 2.1 OpenTelemetry Integration (10 minutes)

- Configure OTEL with config and setup
- Execute some queries
- **Live demo**: Show traces in pre-configured Jaeger instance
- Point out the improved span hierarchy and contextual data

#### 2.2 Advanced Logging & Observability (8 minutes)

- Enable structured logging with metadata
- Execute queries and show request-level tracing in logs
- **Key highlight**: Dynamic log level switching without restarts
  - Start with `info` level
  - Switch to `debug` during "production issue" simulation
  - Switch back to `info` - all without downtime
- Show how request IDs flow through entire request lifecycle

#### 2.3 Authentication & Authorization (15 minutes)

- **JWT Authentication Setup (8 minutes)**:
  - Configure JWT validation plugin with RS256/HS256
  - Create demo JWT tokens with user claims and scopes
  - Show authenticated vs unauthenticated requests
  - Configure introspection to be allowed only for authenticated users
- **Federation-Level Authorization (4 minutes)**:
  - Add `@authenticated` directive to sensitive fields
  - Add `@requiresScopes` directive for role-based access control
  - Demonstrate granular field-level protection
  - Show how unauthorized users get null values for protected fields
  - Test different user roles with different scopes in JWT tokens
- **HMAC Signature Security (3 minutes)**:
  - Configure HMAC signatures between gateway and GraphQL Yoga subgraphs
  - Show secure subgraph communication
  - Explain protection against request tampering

#### 2.4 Security Features (5 minutes)

- Configure rate limiting (requests per minute)
- Use `@rateLimit` directive to configure the rate limiting on the subgraph
- Set max query depth limits
- Set max query complexity/characters
- Live demo: Show these protections in action with malicious queries

#### 2.5 Event-Driven Federated Subscriptions (10 minutes)

- Add subscription support to Posts subgraph (`postAdded`)
- Configure EDFS with NATS adapter (pre-running NATS instance)
- Create subscription service that publishes to NATS
- **Live demo**:
  - Open subscription in one tab
  - Create post in another tab
  - Show real-time update across distributed system
- Explain how this scales horizontally vs traditional subscriptions

### Part 3: Production Polish (15 minutes)

#### 3.1 Caching Layer (8 minutes)

- Add response caching configuration
- Show intelligent response deduplication

#### 3.2 Performance Monitoring (7 minutes)

- Connect gateway to pre-configured Jaeger instance
- Execute various queries
- **Live demo**: Show performance traces and query analysis through OpenTelemetry
- Highlight how distributed tracing helps with performance monitoring

### Wrap-up & Q&A (5 minutes)

- Recap what we built
- Highlight v2's key improvements
- Resources for getting started
- Q&A

---

## Example App Structure

### Simple Domain: Blog Platform

```
Users Service (GraphQL Yoga):
- User @key(fields: "id") {
    id,
    name,
    email @authenticated
  }

Posts Service (GraphQL Yoga):
- Post { id, title, content, authorId }
- Mutation {
    createPost(input: PostInput!): Post!
      @requiresScopes(scopes: [["editor"]])
      @rateLimit(max: 5, window: 60)
    deletePost(id: ID!): Boolean!
      @requiresScopes(scopes: [["editor"], ["admin"]])
  }
- User @key(fields: "id") @external { id }
- Post.author -> User (via federation)
```

This domain is:

- **Simple enough** to build live in 15 minutes
- **Rich enough** to demonstrate federation, auth, subscriptions
- **Realistic enough** to show production patterns

---

## Technical Requirements

### Pre-workshop Setup:

- Local NATS instance running
- Jaeger instance configured
- Node.js v20+ environment
- Basic code editor

### Live Coding Flow:

1. Start with empty directory
2. Build GraphQL Yoga subgraphs from scratch (audience can follow along)
3. Layer on production features incrementally
4. Each feature gets immediate demo/validation

This structure maximizes hands-on learning while showcasing v2's most compelling production features in a realistic progression.
