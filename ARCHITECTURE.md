# 🏗️ Architecture Documentation

## System Overview

This is a production-ready, scalable backend system for a Role-Based Food Ordering Platform with country-level data isolation.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│              (Web App, Mobile App, Desktop)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   NestJS Application Layer                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              GraphQL API Layer (Apollo)                │ │
│  │                                                         │ │
│  │  Resolvers:                                            │ │
│  │  • AuthResolver     • UserResolver                     │ │
│  │  • RestaurantResolver • OrderResolver                  │ │
│  │  • PaymentResolver                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Guards & Middleware                       │ │
│  │                                                         │ │
│  │  • AuthGuard (JWT Validation)                         │ │
│  │  • RolesGuard (RBAC)                                  │ │
│  │  • CountryGuard (ReBAC)                               │ │
│  │  • ValidationPipe (Input Validation)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Business Logic Layer                      │ │
│  │                                                         │ │
│  │  Services:                                             │ │
│  │  • AuthService     • UserService                      │ │
│  │  • RestaurantService • OrderService                   │ │
│  │  • PaymentService                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Data Access Layer                         │ │
│  │                                                         │ │
│  │  Prisma ORM (Type-safe Database Queries)              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Prisma Client
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      Database Layer                          │
│                                                              │
│  SQLite (Development) → PostgreSQL (Production Ready)      │
│                                                              │
│  Tables:                                                     │
│  • User          • PaymentMethod                           │
│  • Restaurant    • Payment                                 │
│  • MenuItem      • Order                                   │
│  • OrderItem                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

### 1. Authentication (JWT-based)

```
Client Request
    ↓
[Bearer Token in Authorization Header]
    ↓
AuthGuard (passport-jwt)
    ↓
Validate Token Signature & Expiry
    ↓
Extract User Context (userId, email, role, country)
    ↓
Attach to Request Object
    ↓
Pass to Resolver/Controller
```

### 2. RBAC (Role-Based Access Control)

```
GraphQL Resolver
    ↓
@Roles(ADMIN, MANAGER) Decorator
    ↓
RolesGuard Intercepts Request
    ↓
Check User.role Against Required Roles
    ↓
✓ Allow Access | ✗ ForbiddenException
```

**Role Hierarchy:**
```
ADMIN (Highest)
  ├─ Can access all ADMIN features
  ├─ Can access all MANAGER features
  └─ Can access all MEMBER features
  
MANAGER (Medium)
  ├─ Can access all MANAGER features
  └─ Can access all MEMBER features
  
MEMBER (Lowest)
  └─ Can access basic MEMBER features
```

### 3. ReBAC (Relationship-Based Access Control)

```
User Request with Country Context
    ↓
CountryGuard Intercepts Request
    ↓
Check: User.country == Resource.country
    ↓
✓ Allow Access | ✗ ForbiddenException
```

**Country Isolation Matrix:**
```
India User → Can access: India restaurants, India orders, India payment methods
America User → Can access: America restaurants, America orders, America payment methods
```

## Data Flow Examples

### Example 1: User Creates an Order

```
1. Client sends mutation with JWT token
   ↓
2. AuthGuard validates JWT
   → Extracts: { userId, email, role: "MEMBER", country: "INDIA" }
   ↓
3. OrderResolver.createOrder() receives request
   ↓
4. OrderService.create() executes:
   a. Validate restaurant exists and country == "INDIA"
   b. Validate all menu items exist and are available
   c. Calculate total amount
   d. Create order with country = "INDIA"
   ↓
5. Return created order
```

### Example 2: Manager Views All Orders

```
1. Manager sends query with JWT token
   → Token contains: { role: "MANAGER", country: "INDIA" }
   ↓
2. AuthGuard validates JWT
   ↓
3. @Roles(ADMIN, MANAGER) check passes
   ↓
4. OrderResolver.findAll() executes
   ↓
5. OrderService.findAllByCountry("INDIA")
   → WHERE country = "INDIA"
   ↓
6. Returns only India orders (America orders filtered out)
```

### Example 3: Member Tries to Create Payment (Should Fail)

```
1. Member sends createPayment mutation
   → Token contains: { role: "MEMBER" }
   ↓
2. AuthGuard validates JWT
   ↓
3. @Roles(ADMIN, MANAGER) check executes
   ↓
4. RolesGuard: "MEMBER" not in ["ADMIN", "MANAGER"]
   ↓
5. ✗ ForbiddenException: "Only Admin and Manager can process payments"
```

## Module Structure

### Clean Architecture Principles

```
src/
├── common/                    # Shared utilities
│   ├── decorators/           # Custom decorators
│   │   ├── @Roles()         # Role-based access decorator
│   │   └── @CurrentUser()   # Extract user from context
│   ├── guards/              # Authorization guards
│   │   ├── RolesGuard      # RBAC implementation
│   │   └── CountryGuard    # ReBAC implementation
│   └── enums/               # Shared enumerations
│
├── modules/                 # Feature modules
│   ├── auth/               # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts      # Business logic
│   │   ├── auth.resolver.ts     # GraphQL API
│   │   ├── dto/                 # Data transfer objects
│   │   └── strategies/          # Passport strategies
│   │
│   ├── user/               # User management module
│   ├── restaurant/         # Restaurant & menu module
│   ├── order/              # Order processing module
│   └── payment/            # Payment processing module
│
├── prisma/                  # Database layer
│   ├── prisma.module.ts    # Prisma NestJS module
│   └── prisma.service.ts   # Database service
│
├── graphql.types.ts        # GraphQL enum registrations
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## Database Schema Relationships

```
User (1) ──────< (M) Order (M) >────── (1) Restaurant
  │                    │                      │
  │                    │                      │
  │                    ↓                      ↓
  │                  OrderItem ─────────> MenuItem
  │                    │
  │                    ↓
  │                 Payment (1) >─── (1) PaymentMethod
  │                                         │
  └─────────────────────────────────────────┘
                    (Users can have preferred payment methods)
```

## API Design Patterns

### GraphQL Code-First Approach

```typescript
// 1. Define GraphQL Types
@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: string;
}

// 2. Define Input Types
export class CreateOrderInput {
  @Field()
  restaurantId: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}

// 3. Implement Resolver
@Resolver(() => OrderType)
@UseGuards(AuthGuard('jwt'))
export class OrderResolver {
  @Mutation(() => OrderWithDetails)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: any,
  ) {
    // Business logic here
    return this.orderService.create(user.userId, user.country, input);
  }
}
```

## Error Handling Strategy

### Standardized Error Responses

```typescript
// Authentication Errors
UnauthorizedException - "Invalid credentials"
UnauthorizedException - "User account is deactivated"

// Authorization Errors
ForbiddenException - "Only Admin and Manager can process payments"
ForbiddenException - "Access denied. Order belongs to a different country"

// Validation Errors
BadRequestException - "User with this email already exists"
BadRequestException - "Cannot delete payment method that has been used"

// Not Found Errors
NotFoundException - "Order not found"
NotFoundException - "Payment method not found or inactive"
```

## Scalability Considerations

### 1. Horizontal Scaling
- Stateless JWT tokens enable horizontal scaling
- No session storage required
- Any instance can handle any request

### 2. Database Scaling
- SQLite for development (single-file, zero configuration)
- PostgreSQL for production (ACID compliance, row-level security)
- Connection pooling via Prisma

### 3. Caching Opportunities
```typescript
// Future enhancement: Add Redis caching
- Cache restaurant lists (TTL: 5 minutes)
- Cache menu items (TTL: 5 minutes)
- Cache payment methods (TTL: 30 minutes)
```

### 4. Rate Limiting
```typescript
// Future enhancement: Add rate limiting
- Login: 5 requests per minute
- Create order: 10 requests per minute
- General queries: 100 requests per minute
```

## Testing Strategy

### Unit Tests
```bash
# Test services in isolation
src/modules/order/order.service.spec.ts
src/modules/payment/payment.service.spec.ts
```

### Integration Tests
```bash
# Test GraphQL resolvers with real database
test/resolvers/order.resolver.e2e-spec.ts
test/resolvers/payment.resolver.e2e-spec.ts
```

### E2E Tests
```bash
# Test complete user flows
test/e2e/order-flow.e2e-spec.ts
test/e2e/rbac-permissions.e2e-spec.ts
```

## Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────────────────┐
│                  Load Balancer                    │
└────────────────┬─────────────────┬───────────────┘
                 │                 │
        ┌────────▼────┐   ┌──────▼────────┐
        │  NestJS #1  │   │  NestJS #2    │
        │  (Docker)   │   │  (Docker)     │
        └────────┬────┘   └──────┬────────┘
                 │               │
                 └───────┬───────┘
                         │
                ┌────────▼────────┐
                │  PostgreSQL DB   │
                │  (RDS/Cloud SQL) │
                └─────────────────┘
```

### Environment Variables

```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/foodapp
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
PORT=3000
```

## Monitoring & Observability

### Future Enhancements

1. **Logging**
   - Winston/Pino for structured logging
   - Log levels: ERROR, WARN, INFO, DEBUG
   - Correlation IDs for request tracing

2. **Metrics**
   - Prometheus for metrics collection
   - Grafana for dashboards
   - Key metrics: Request latency, Error rates, DB query time

3. **Tracing**
   - OpenTelemetry for distributed tracing
   - Trace requests across services
   - Identify bottlenecks

4. **Alerting**
   - High error rates (>5%)
   - Slow queries (>1s)
   - Database connection pool exhaustion

## Performance Optimization

### Current Optimizations

1. **Database Indexes**
```prisma
@@index([email])
@@index([country])
@@index([status])
@@index([restaurantId])
```

2. **Query Optimization**
```typescript
// Select only needed fields
prisma.user.findMany({
  select: {
    id: true,
    email: true,
    // Not loading password
  }
})

// Batch operations
prisma.menuItem.createMany({ data: [...] })
```

3. **GraphQL N+1 Prevention**
```typescript
// Use DataLoader for future optimization
// Currently using joins and includes
```

### Future Optimizations

1. **Query Complexity Analysis**
   - Limit query depth
   - Prevent expensive nested queries

2. **Cursor-based Pagination**
   - For large datasets
   - Better performance than offset pagination

3. **Query Timeouts**
   - Prevent long-running queries
   - Set timeout at database level

---

**This architecture is designed to be:**
- ✅ Secure (RBAC + ReBAC + JWT)
- ✅ Scalable (Stateless, Horizontal scaling)
- ✅ Maintainable (Clean architecture, TypeScript)
- ✅ Production-ready (Error handling, Validation)
- ✅ Developer-friendly (Seeded data, Documentation)
