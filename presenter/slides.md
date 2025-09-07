---
theme: default
transition: none
layout: cover
---

# Unleash the Power of Federation with Hive Gateway v2 🚀

Denis and Arda from The Guild

<PoweredBySlidev />

<!--
- Welcome everyone to this hands-on workshop
- Today we're building a federated GraphQL system from scratch
- This is interactive so feel free to code along or just watch and ask questions
-->

---
layout: two-cols-header
---

# About Us & The Guild

The team behind your GraphQL tooling

::left::

## Denis [Placeholder]

- [Role/Background placeholder]
- [Experience placeholder]
- [Fun fact placeholder]

::right::

## Arda [Placeholder]

- [Role/Background placeholder]
- [Experience placeholder]
- [Fun fact placeholder]

<!--
- Let me start by introducing ourselves and the company behind the tools you probably use
- I'm Denis, this is Arda, we're from The Guild
- We build open-source GraphQL tools that power thousands of applications
- We're passionate about federation, gateways and making GraphQL better for everyone
-->

---

TODO: **GraphQL Yoga** - Production-ready GraphQL server
TODO: **GraphQL Code Generator** - Generate anything from GraphQL schemas
TODO: **GraphQL Mesh** - Query any API with GraphQL
TODO: **GraphQL Hive** - Complete GraphQL platform with gateway, registry & observability

---

# Also Interesting to See Conference

- [Time] - [Talk Title Placeholder]
- [Time] - [Talk Title Placeholder]
- [Time] - Our Workshop (You are here!)
- [Time] - [Talk Title Placeholder]

<!--
- Before we dive into the workshop, let me mention some other interesting talks happening during the conference
- There are several other sessions that might interest you if you're working with GraphQL
- But for now, let's focus on what we're building together
-->

---
layout: center
---

# Who here has _heard_ about Hive Gateway?

<!--
- Who here has heard about Hive Gateway? Can I see a raise of hands?
- Perfect! Now I can see who I'm talking to
-->

---
layout: center
---

# Who here has _worked_ with Hive Gateway?

<!--
- Who here has worked with Hive Gateway? Can I see a raise of hands?
- That gives me a good sense of experience levels in the room
- Whether you're new to Hive Gateway or have been using it, today will be valuable
- We're going to build something pretty impressive together
-->

---
layout: two-cols-header
---

# What is Hive Gateway?

Production-ready GraphQL federation gateway

::left::

## Drop-in Replacement

- **Apollo Router compatible** - Use existing `supergraph.graphql`
- **Zero migration effort** - Seamless integration
- **Full Federation v2** support with Apollo spec compliance

## Cloud-Native Ready

- **Serverless optimized** - AWS Lambda, Cloudflare Workers, GCP, Azure
- **JavaScript native** - No binary dependencies
- **Horizontal scaling** - Built for modern cloud architectures

::right::

## Core Capabilities

### Federation Features

- Query planning and execution across subgraphs
- Automatic schema composition and validation
- Entity resolution and type merging

### Built-in Security

- JWT authentication with configurable algorithms
- HMAC signature validation for subgraphs
- Query depth limits and rate limiting

### Observability Ready

- OpenTelemetry integration out-of-box
- Structured logging with request correlation
- Prometheus, StatsD, and custom metrics

<!--
- For those of you who might not be familiar with Hive Gateway yet, let me explain what it is first
- It's a GraphQL Federation gateway,
- a drop-in replacement for Apollo Gateway and Router that uses your existing supergraph
- But being JavaScript-native means it runs anywhere JavaScript does - perfect for serverless
- All the enterprise features you'd expect are included and open-source
- No licensing restrictions or paywalls, free forever!
-->

---
layout: two-cols-header
---

# What's Great About Hive Gateway

Why teams choose it over alternatives

::left::

### Production Excellence

- 🏢 **Battle-tested at Scale** - Powers applications serving millions of requests daily
- 🚀 **Performance Optimized** - Sub-millisecond query planning with intelligent caching
- 🔄 **Zero-downtime Deployments** - Hot-swap configurations without service interruption
- 📊 **Real-world Benchmarks** - Consistently outperforms alternatives in latency tests

### Developer Experience

- 💡 **Smart Defaults** - Production-ready configuration out of the box
- 🔍 **Debugging Made Easy** - Built-in GraphQL Playground and detailed error messages
- 🔧 **TypeScript-first** - Full type safety and excellent IDE support
- 📦 **Simple Installation** - Standard npm/yarn package with semantic versioning

::right::

### Ecosystem & Community

- 🔌 **Rich Plugin System** - Authentication, caching, monitoring, and custom logic
- 🛠️ **Tool Chain Integration** - Works seamlessly with existing GraphQL tooling
- 🌍 **Active Community** - Discord support and regular contributor meetings
- 📈 **Comprehensive Metrics** - Request success rates, latency percentiles, error tracking

### Zero Lock-in Promise

- 🆓 **MIT Licensed** - Free forever, modify as needed
- 🛡️ **Security Hardened** - Regular audits and vulnerability patching
- 🏗️ **Extensible Architecture** - GraphQL Mesh integration and plugin ecosystem
- 🌐 **Deploy Anywhere** - From traditional servers to edge functions

<!--
- These are the benefits teams discover after implementing Hive Gateway in production
- The performance gains are measurable - we're talking real improvements between gateways in the JavaScript world
- Smart defaults mean less configuration headaches and faster time to deployment
- The ecosystem support means you're not starting from scratch with plugins and integrations,
- the operational benefits become clear when you're managing this in production
-->

---

# What's New in v2

Built for production workloads from day one

- 🔍 Enhanced OpenTelemetry - Perfect traces with easy setup
- 📊 Dynamic Structured Logging - Change levels without restarts
- 🚀 Event-Driven Subscriptions - Horizontally scalable with NATS
- ⚡ Inflight Request Deduplication - Automatic performance optimization

<!--
- Now that you understand what makes Hive Gateway special, let's talk about what's exciting in the recently released version 2
- These features solve real production problems, it's not just a feature showcase
- Let's briefly go over each one:
- Enhanced OpenTelemetry means minimal configuration gets you complete distributed tracing
- Dynamic log level switching without restarts is huge when you're debugging issues at 3am
- Event-driven subscriptions are new in Hive Gateway and let subscriptions scale horizontally
- Inflight Request deduplication automatically detects when multiple in-flight requests target the same subgraph with identical parameters
- Instead of making duplicate network calls, the gateway waits for the first request to complete and shares the result with all waiting requests
- All of this was built based on feedback from teams running v1 in production
- We'll see these features in action today
-->

---
layout: two-cols-header
---

# Workshop Overview

::left::

## What we'll build together

- Complete federated GraphQL system with production features
- Two GraphQL Yoga subgraphs with federation
- Security layers: JWT auth, HMAC signatures, field-level authorization
- Real-time subscriptions with NATS and EDFS
- Full observability with OpenTelemetry and Jaeger

::right::

## You'll learn

### Foundation

- Monorepo setup with Bun workspaces
- GraphQL Yoga subgraphs with Apollo Federation
- Schema composition with GraphQL Mesh
- Hive Gateway v2 configuration

### Security

- JWT authentication with `@authenticated` directives
- HMAC signature validation between gateway and subgraphs
- Role-based authorization with `@requiresScopes`
- Attack prevention: depth limits, rate limiting, introspection control

### Real-time & Observability

- Event-driven subscriptions with NATS message broker
- Dynamic log level switching without restarts
- Complete distributed tracing with OpenTelemetry and Jaeger

<!--
- Let me outline the specific 11 steps we'll work through today
- We start with basic monorepo setup using Bun and build two federated subgraphs
- Then we compose them with GraphQL Mesh and set up the Hive Gateway
- The security section covers multi-layer protection: JWT for authentication, HMAC for subgraph communication, and field-level authorization with Federation directives
- We'll also implement common GraphQL attack prevention like query depth limits and rate limiting
- The final section adds real-time capabilities with NATS-powered subscriptions that scale horizontally
- We finish with production-grade observability using dynamic logging and OpenTelemetry tracing
- Each step includes a git commit so you can follow along or jump to any specific point
- By the end you'll have a complete production-ready federated system
-->

---
layout: two-cols-header
---

# Our Demo App

Simple Blog Platform

::left::

### Users Service

- User profiles with ID, name, email

### Posts Service

- Blog posts with title and content
- Author relationship via federation
- Role-based access control
- Real-time post notifications

::right::

## Perfect for demonstrating

- GraphQL Yoga for subgraphs
- Hive Gateway for federation
- JWT authentication + authorization directives
- HMAC signature security
- Real-time subscriptions

## User Roles

- 👤 Authenticated user: can see user emails
- 👑 Admin: Can delete any post
- ✍️ Editor: Can create and delete posts

<!--
- For our demo today, we needed to choose a domain that would showcase all these features effectively:
- A simple blog platform that everyone understands
- We'll have two services: one for users with profiles and authentication, and one for posts with real-time features
- The users service will demonstrate field-level security by placing email addresses behind authentication,
- while the posts service will show off role-based authorization and real-time notifications.
- This domain perfectly demonstrates federation, security, and scalability features
-->

---
zoom: 0.8
---

# Federation Architecture

How Our Services Connect

```mermaid
graph TB
    Client[Client App] --> Gateway[Hive Gateway]
    Gateway <--> Users[Users Subgraph]
    Gateway <--> Posts[Posts Subgraph]

    Gateway -->|OpenTelemetry Trace Exporter| Jaeger[Jaeger Tracing]

    Gateway -->|Subscribes| NATS[NATS Message Broker]
    NATS -.->|Real-time Updates| Gateway
    Posts -.->|Publishes| NATS

    style Gateway fill:orange,color:black
    style Users fill:blue
    style Posts fill:blue
```

<!--
- Let me give you a visual overview of the complete architecture we're building
- The gateway sits in front of our two GraphQL Yoga subgraphs
- We'll use GraphQL Mesh to compose our supergraph from the individual schemas
- Federation connects users to posts across service boundaries
- NATS will handle our distributed subscriptions for real-time features
- And Jaeger will collect traces from everything for complete observability
- This diagram shows how all the pieces fit together in our production setup
-->

---
layout: two-cols-header
---

# Multi-Layer Security

JWT + Field-Level Authorization + HMAC

::left::

### Authentication Layer

- JWT token validation
- Support for RS256/HS256 algorithms
- User identity and scopes/scopes extraction

### Authorization Layer

- `@authenticated` directive for basic protection
- `@requiresScopes` directive for role-based access
- Field-level permission control

::right::

## Security Layers

JWT Authentication

- Validates user identity
- Carries user roles/scopes

Authorization Directives

- `@authenticated` - requires any valid user
- `@requiresScopes` - requires specific roles

HMAC Signatures

- Secure subgraph communication
- Protection against tampering

<!--
- Now that we've seen the overall architecture, let's dive into security.
- We'll have three layers of security working together here:
- JWT handles authentication, identity and carries role information from the client
- Subgraph directives enforce permissions at the field level
- And HMAC signatures secure the internal communication and ensure only the gateway can communicate with the subgraphs
-->

---
zoom: 0.55
---

# Security Flow

Multi-Layer Security with Early Blocking

```mermaid
sequenceDiagram
    participant Client
    participant Gateway as Hive Gateway
    participant Auth as JWT Validator
    participant Users as Users Service
    participant Posts as Posts Service

    Client->>Gateway: Query with JWT
    Gateway->>Auth: Validate JWT
    Auth-->>Gateway: User + Scopes

    Note over Gateway: Check @authenticated & @requiresScopes
    alt Authorization Failed
        Gateway-->>Client: Authorization Error (401/403)
    else Authorization Passed
        Gateway->>Users: Query user.email (authorized)
        Gateway->>Posts: Query posts (authorized)
        Users-->>Gateway: Email data
        Posts-->>Gateway: Posts data
        Gateway-->>Client: Combined Response
    end
```

<!--
- This diagram shows the critical security feature: early authorization blocking at the gateway level
- The gateway validates the JWT first to extract user identity and scopes
- Then it checks all @authenticated and @requiresScopes directives in the query plan
- If any field requires authentication or scopes the user doesn't have, the gateway immediately returns an authorization error
- The subgraphs never receive unauthorized requests - this protects your backend services from unnecessary load
- Only when all authorization checks pass does the gateway make requests to the subgraphs
- This approach is much more efficient and secure than letting unauthorized requests reach your services
- It also provides consistent error messages and prevents information leakage about your internal service architecture
- The HMAC signatures we'll add later provide an additional layer ensuring only the gateway can communicate with subgraphs
-->

---

# Production-Grade Protection

Security Features

### Rate Limiting 🚦

- Global gateway rate limits
- Per-field rate limiting with `@rateLimit` directive
- Prevent abuse and DoS attacks

### Query Protection 🛡️

- Maximum query depth limits
- Character count restrictions
- _And much more..._

<!--
- But there's more security beyond authentication and authorization!
- We need to also protect against abuse
- Rate limiting prevents abuse at multiple levels of your system
- The `@rateLimit` directive lets you protect specific heavy fields - for example, you could rate limit an expensive search operation while allowing normal queries to flow freely
- Query protection stops malicious deep nested queries that could overwhelm your servers
- For example, someone could write a query that goes 50 levels deep and crashes your API
- We have many more query protection features available like complexity analysis and alias limits, but we'll showcase only a few to get you started with secure defaults
- These features are essential if you're exposing APIs publicly
-->

---
zoom: 0.7
layout: two-cols-header
---

# Traditional GraphQL Subscriptions

How real-time updates work

::left::

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Service
    participant DataSource

    Client->>Gateway: subscription { postAdded }
    Gateway->>Service: Subscribe to post events
    Service->>Gateway: Subscription established
    Gateway->>Client: WebSocket connection

    Note over DataSource: New post created
    DataSource->>Service: Post created event
    Service->>Gateway: postAdded data
    Gateway->>Client: Real-time update
```

::right::

## Scaling Challenges

### WebSocket Limitations

- **Stateful connections** - Each client holds open connection consuming server memory
- **Sticky sessions** - Clients must reconnect to same server instance
- **Vertical scaling only** - Can't distribute connections across instances
- **Connection storms** - Mass reconnections during server restarts

### Server-Sent Events (SSE) Issues

- **Same memory problems** - Each connection consumes server resources
- **HTTP/1.1 connection limits** - Browsers limit concurrent connections per domain
- **No bidirectional communication** - Server can only push, not receive
- **Connection management complexity** - Handling disconnects and reconnects

### Resource Consumption

- **Memory per connection** - 2-8KB per WebSocket, multiplied by thousands of users
- **Event loop blocking** - Too many connections can overwhelm Node.js event loop
- **Network overhead** - Keeping connections alive requires constant heartbeats

<!--
- Let's talk subscriptions now
- I mentioned EDFS, but first let us take a step back and explain GraphQL subscriptions for those who might be new to them
- In traditional GraphQL subscriptions, a client opens a subscription typically over a WebSocket connection
- The server maintains the connection and pushes updates when data changes
- This works great for single instances but has serious scaling challenges
- WebSockets are stateful - each connection consumes server memory and creates sticky sessions
- With thousands of users, you're looking at megabytes of memory just for connection overhead
- Server-Sent Events have similar problems plus HTTP connection limits
- You can't easily distribute these connections across multiple server instances
- In federated structures, gateways connect to subgraphs for subscriptions, putting pressure on both gateways and subgraphs
- This creates bottlenecks because subgraphs become single points of failure for subscription data
- You can't easily have multiple distributed gateways because each needs its own connection to subgraphs
- When your server restarts, all clients have to reconnect at once creating connection storms
-->

---
layout: two-cols-header
---

# EDFS - Subscriptions That Scale

Event-Driven Federated Subscriptions

::left::

### Traditional Subscriptions

- Tied to single gateway instance
- Limited scalability
- Single point of failure

### EDFS with v2

- Distributed across multiple gateways
- Horizontal scaling with NATS
- Fault tolerance built-in
- Built-in adapters included

::right::

## What we'll build

- Real-time post notifications
- NATS message broker integration
- Multi-instance subscription handling
- Fault-tolerant messaging

### Perfect for

Real-time features at enterprise scale 🌐

<!--
- EDFS to the rescue!
- Why are Event-Driven Federated Subscriptions such a game changer for real-time features?
- Well, traditional subscriptions simply don't scale well beyond a single instance
- EDFS solves this by using message brokers like NATS, Kafka, or Redis
- Starting v2, Hive Gateway's pubsub has built-in adapters making setup with any of these message brokers easy
- Perfect for real-time features that need to scale to thousands of users!
- Here's a cool feature: with EDFS, you can emit only the keys of a type and the gateway will resolve the rest of the fields
- For example, our Post type has an "id" key - you can publish a message to NATS "postAdded" subject containing only the "id" field, but request more fields in the subscription query
- The gateway will intelligently resolve any other fields provided in the GraphQL subscription query, fetching data from the appropriate subgraphs as needed
-->

---

# EDFS Architecture

Event-Driven Federated Subscriptions

```mermaid
graph LR
    Client1[Client 1] --> Gateway1[Gateway Instance 1]
    Client2[Client 2] --> Gateway2[Gateway Instance 2]
    Client3[Client 3] --> Gateway3[Gateway Instance 3]

    Gateway1 --> NATS[NATS Message Broker]
    Gateway2 --> NATS
    Gateway3 --> NATS

    PostService[Post Creation Service] --> NATS

    NATS -.->|Real-time Updates| Gateway1
    NATS -.->|Real-time Updates| Gateway2
    NATS -.->|Real-time Updates| Gateway3

    style Gateway1 fill:orange,color:black
    style Gateway2 fill:orange,color:black
    style Gateway3 fill:orange,color:black
    style NATS fill:green
    style PostService fill:cyan,color:black
```

<!--
- EDFS in practice looks something like this
- Here you can see multiple gateway instances all connected via NATS
- where any service can publish events to the message broker
- All connected clients get real-time updates regardless of which gateway they're connected to
- This scales horizontally unlike traditional WebSocket or SSE subscriptions
- The beauty of EDFS is that it decouples the subscription source from the subscription consumers
- Services can publish events to NATS without knowing which gateways or clients are listening
- Gateways can scale independently because they're not holding stateful connections to subgraphs
- If one gateway goes down, clients can reconnect to another gateway and still receive all the same real-time updates
- The message broker handles the distribution, making the whole system fault-tolerant and highly available
-->

---

# Hive Logger

Modern logging for GraphQL applications

### Key Features

- 🏷️ **Structured Logging** - JSON output with consistent metadata
- 🔗 **Request Correlation** - Automatic request ID propagation
- 📊 **Context Inheritance** - Child loggers inherit parent metadata
- 🔄 **Dynamic Log Levels** - Change verbosity without restarts
- 🔌 **Pluggable Writers** - Pino, Winston, or custom integrations

### Perfect for Production

- Filter logs by request ID to trace entire request lifecycle
- Structured data makes log aggregation and searching easier
- Performance optimized with lazy evaluation
- Cross-platform compatibility (Node.js, Bun, edge runtimes)

<!--
- Before we talk about dynamic logging, let me introduce Hive Logger
- It's our modern logging solution designed to run everywhere JavaScript does
- No more lock-in to Node or any other platform.
- The key improvement the logger carries to Hive Gateway version 2, is that
- every log entry automatically gets tagged with the request ID.
- This means you can filter your logs by a specific request and see its entire journey
- Child loggers inherit metadata from parents, so context flows naturally through your application
- It's built for performance with lazy evaluation of log messages
- And you can plug in your favorite logging library like Pino or Winston as the underlying writer!
- Or JSON? Or you can simply write to a file - it's up to you.
-->

---

# Dynamic Logging Revolution

Change Log Levels Without Restarts 🔄

- Structured logging with request-level metadata
- Request IDs flowing through entire request lifecycle
- Dynamic log level switching during live operation
- Production debugging without downtime

<!--
- Now let's see Hive Logger in action with its most impressive feature
- You can switch to debug mode without restarting your production gateway!
- This is absolutely essential for troubleshooting production issues
- Imagine it's 3am, something's wrong in production, and you need more verbose logging
- Instead of restarting services and potentially making things worse, you just change the log level
- I'll demo changing log levels live during our session
-->

---
layout: two-cols-header
---

# OpenTelemetry Made Simple

Production-Grade Observability

::left::

### What we'll configure

- Gateway tracing with Jaeger integration
- Erm, that's it... Everything else Just Works ™️

::right::

## What you get

- Perfect traces with proper span hierarchy
- Contextual data in every span
- GraphQL context, HTTP details, upstream execution info

<!--
- One thing I love about v2 is how simple observability has become
- The OpenTelemetry setup is incredibly easy now,
- only a few lines of configuration gets you complete distributed tracing.
- Basically, you just have to configure OpenTelemetry itself,
- Hive Gateway will pick up the rest.
- Spans are automatically created for all GraphQL operations allowing you
- to see the entire request flow through your federation!
-->

---
layout: center
---

# Let's Build! 🛠️

Three ways to participate - your choice!

**Repository:** https://github.com/graphql-hive/graphql-conf-2025-gateway-workshop

## 🔨 Code Together

Prerequisites: [Bun](https://bun.sh) + [Docker](https://docker.com)
Follow along as we build from scratch!

## 👀 Follow Along

Clone and pull latest changes:

```sh
git clone git@github.com:graphql-hive/graphql-conf-2025-gateway-workshop.git
git pull # as we progress
```

## 🚀 Join Whenever

If suddenly you have the urge to join, just clone the repo and read its README.md.

Let's unleash the power of federation! 🚀

<!--
- Alright, enough talking - it's time to start building this thing!
- Three different ways to participate based on your preference
- We're starting completely from scratch with an empty directory
- I'll build everything step by step and commit as we go
- Everyone ready to begin?
-->

---

# Workshop Summary

What we built together today

### Foundation

- Two federated GraphQL Yoga subgraphs
- Hive Gateway v2 setup and configuration

### Production Features

- JWT authentication with field-level authorization
- HMAC signatures for secure subgraph communication
- Event-Driven Federated Subscriptions with NATS
- Dynamic logging with real-time level switching

### Enterprise Polish

- Security hardening (rate limits, query protection)
- Response caching and request deduplication
- Complete observability with OpenTelemetry and Jaeger

### Key Takeaways

- v2 makes production-grade federation accessible
- Security and observability are built-in, not add-ons
- EDFS enables true horizontal scaling for real-time features

<!--
- Before we wrap up, let me recap what we accomplished in just 90 minutes
- We built a complete production-ready federated system
- Every feature we added solves real production challenges
- The key is that v2 makes enterprise features accessible to everyone
- You now have the knowledge to implement this in your own projects
-->

---
layout: center
---

# Visit The Guild Booth! 🏪

Come chat with us about your GraphQL challenges

## What's at our booth

- Live demos of our tools
- GraphQL architecture consultations
- Stickers and swag
- Coffee and conversations

## We'd love to discuss

- Your current GraphQL setup
- Migration strategies
- Performance optimization
- Custom tooling needs

**Booth Location:** [Placeholder - booth number/location]
**Booth Hours:** [Placeholder - hours]

<!--
- I hope this workshop was valuable, but our conversation doesn't have to end here
- We'd love to continue the conversation at our booth
- Bring your real-world GraphQL challenges
- We have demos of all our tools running live
- Great opportunity for one-on-one discussions about your specific needs
- Plus we have great swag and coffee
-->

---

# Resources

Continue Your Journey

### Workshop Materials 📚

- **[Workshop Repository](https://github.com/graphql-hive/graphql-conf-2025-gateway-workshop)** - Complete code and step-by-step commits
- **[This Workshop](https://graphql.org/conf/2025/schedule/6fbc71a3ad13189339d753cb078ec781/)** - GraphQL Conf 2025 session

### Documentation & Guides

- [Hive Gateway Docs](https://the-guild.dev/graphql/hive/docs/gateway)
- [Authentication & Authorization](https://the-guild.dev/graphql/hive/docs/gateway/authorization-authentication)
- [EDFS Guide](https://wundergraph.com/blog/distributed_graphql_subscriptions_with_nats_and_event_driven_architecture)
- [GraphQL Mesh Compose](https://the-guild.dev/graphql/mesh)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)

### Tools & Platforms

- [Hive Console](https://the-guild.dev/graphql/hive) - Complete GraphQL platform
- [Self-hosting Hive](https://the-guild.dev/graphql/hive/docs/self-hosting/get-started)
- [The Guild](https://the-guild.dev) - Open source GraphQL tools

<!--
- For those who want to dive deeper after today's session
- Here are all the documentation links for your follow-up reading
- The GitHub repository has examples and starter templates
- Our community is really active and helpful if you run into issues
- Keep building on what we learned today
-->

---
layout: end
---

# Thank You!

Questions? 🤔

<!--
- Thank you all for participating in this workshop and staying engaged
- Let's open the floor for any questions you might have
- I encourage you to try this out in your own projects
- I'll be available for individual questions after we wrap up
- And don't forget to visit our booth!
-->
