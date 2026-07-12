<<<<<<< HEAD
# 🍔 Role-Based Food Ordering System

A production-ready, scalable backend system built with **NestJS**, **GraphQL**, and **Prisma** featuring Role-Based Access Control (RBAC) and Relationship-Based Access Control (ReBAC).

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [RBAC & ReBAC Implementation](#rbac--rebac-implementation)
- [Testing Guide](#testing-guide)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

---

## ✨ Features

### Core Features
- ✅ **View Restaurants & Menus** - All roles can browse restaurants and menu items
- ✅ **Create Orders** - All roles can place orders
- ✅ **Checkout & Payment** - Admin and Manager roles only
- ✅ **Cancel Orders** - Admin and Manager roles only
- ✅ **Manage Payment Methods** - Admin role only

### Access Control
- 🔐 **RBAC (Role-Based Access Control)** - Three roles: Admin, Manager, Member
- 🌍 **ReBAC (Relationship-Based Access Control)** - Country-based data isolation (India/America)
- 🔒 **JWT Authentication** - Secure token-based authentication

### Technical Features
- 🎯 **Type-Safe** - Full TypeScript support with GraphQL code-first approach
- 🗄️ **Prisma ORM** - Type-safe database queries with SQLite for local dev
- 📊 **GraphQL API** - Modern, flexible API with auto-generated documentation
- 🌱 **Seeded Data** - Ready-to-test with mock restaurants, menus, and users

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Applications                   │
│              (Web, Mobile, Desktop Apps)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/GraphQL
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Apollo GraphQL Server                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │              GraphQL Resolvers Layer              │  │
│  │  • AuthResolver  • UserResolver  • OrderResolver │  │
│  │  • RestaurantResolver  • PaymentResolver         │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Guards & Decorators                  │  │
│  │  • AuthGuard (JWT)  • RolesGuard (RBAC)         │  │
│  │  • CountryGuard (ReBAC)  • @Roles() @CurrentUser()│ │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │                Services Layer                     │  │
│  │  • AuthService  • UserService  • OrderService    │  │
│  │  • RestaurantService  • PaymentService           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Prisma Client
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Prisma ORM Layer                      │
│  • Type-safe queries  • Migrations  • Seed Data        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  SQLite Database                         │
│  • Users  • Restaurants  • MenuItems  • Orders         │
│  • Payments  • PaymentMethods  • Countries             │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | NestJS 10.x |
| **API** | GraphQL (Apollo Server) |
| **ORM** | Prisma 5.x |
| **Database** | SQLite (easily switchable to PostgreSQL) |
| **Authentication** | JWT + Passport.js |
| **Validation** | Class Validator + Class Transformer |
| **Language** | TypeScript 5.x |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git (optional, for version control)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations (creates database schema)
   npm run prisma:migrate

   # Seed the database with mock data
   npm run prisma:seed
   ```

   Or run all at once:
   ```bash
   npm run db:setup
   ```

3. **Start Development Server**
   ```bash
   npm run start:dev
   ```

4. **Access GraphQL Playground**
   ```
   http://localhost:3000/graphql
   ```

### Test Credentials

The database is seeded with the following users:

#### India Users
| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin.india@foodapp.com | admin123 | ADMIN | INDIA |
| manager.india@foodapp.com | manager123 | MANAGER | INDIA |
| member1.india@foodapp.com | member123 | MEMBER | INDIA |
| member2.india@foodapp.com | member123 | MEMBER | INDIA |

#### America Users
| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin.america@foodapp.com | admin123 | ADMIN | AMERICA |
| manager.america@foodapp.com | manager123 | MANAGER | AMERICA |
| member1.america@foodapp.com | member123 | MEMBER | AMERICA |
| member2.america@foodapp.com | member123 | MEMBER | AMERICA |

---

## 📊 Database Schema

### Core Models

```
User
├─ id: UUID
├─ email: String (unique)
├─ password: String (hashed)
├─ firstName: String
├─ lastName: String
├─ role: Enum (ADMIN, MANAGER, MEMBER)
├─ country: Enum (INDIA, AMERICA)
└─ isActive: Boolean

Restaurant
├─ id: UUID
├─ name: String
├─ description: String
├─ address: String
├─ city: String
├─ rating: Float
├─ country: Enum (INDIA, AMERICA)
└─ isActive: Boolean

MenuItem
├─ id: UUID
├─ name: String
├─ description: String
├─ price: Float
├─ category: String
├─ isVegetarian: Boolean
├─ isAvailable: Boolean
└─ restaurantId: FK → Restaurant

Order
├─ id: UUID
├─ userId: FK → User
├─ restaurantId: FK → Restaurant
├─ status: Enum (PENDING, CONFIRMED, PREPARING, DELIVERED, CANCELLED)
├─ totalAmount: Float
├─ notes: String
├─ country: Enum (INDIA, AMERICA)
└─ items: OrderItem[]

Payment
├─ id: UUID
├─ orderId: FK → Order (unique)
├─ paymentMethodId: FK → PaymentMethod
├─ amount: Float
├─ status: Enum (PENDING, COMPLETED, FAILED, REFUNDED)
└─ transactionId: String

PaymentMethod
├─ id: UUID
├─ name: String
├─ type: Enum (CREDIT_CARD, DEBIT_CARD, CASH, UPI, WALLET)
├─ isActive: Boolean
├─ country: Enum (INDIA, AMERICA)
└─ config: String (JSON)
```

**Full schema**: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## 📚 API Documentation

### Available Queries & Mutations

#### Authentication
- `login(email, password)` → AuthResponse
- `register(email, password, firstName, lastName, role, country)` → AuthResponse

#### Restaurants & Menus (All Roles)
- `restaurants` → [Restaurant]
- `restaurant(id)` → Restaurant
- `menuItems` → [MenuItem]
- `restaurantMenu(restaurantId)` → [MenuItem]

#### Orders
- `myOrders` → [Order] *(All roles)*
- `order(id)` → Order *(All roles)*
- `orders` → [Order] *(Admin, Manager only)*
- `createOrder(input)` → Order *(All roles)*
- `updateOrderStatus(input)` → Order *(Admin, Manager only)*
- `cancelOrder(id)` → Order *(Admin, Manager only)*

#### Payments
- `paymentMethods` → [PaymentMethod] *(All roles)*
- `allPaymentMethods` → [PaymentMethod] *(Admin, Manager only)*
- `createPayment(input)` → Payment *(Admin, Manager only)*
- `createPaymentMethod(input)` → PaymentMethod *(Admin only)*
- `updatePaymentMethod(id, input)` → PaymentMethod *(Admin only)*
- `deletePaymentMethod(id)` → PaymentMethod *(Admin only)*

#### Users
- `user(id)` → User *(Admin, Manager)*
- `users` → [User] *(Admin only - all countries, others - own country)*
- `usersByCountry(country)` → [User] *(Admin, Manager)*

**Complete examples**: [`examples.graphql`](examples.graphql)

---

## 🔐 RBAC & ReBAC Implementation

### Role-Based Access Control (RBAC)

Three roles are implemented with hierarchical permissions:

| Feature | ADMIN | MANAGER | MEMBER |
|---------|-------|---------|--------|
| View Restaurants | ✅ | ✅ | ✅ |
| View Menu Items | ✅ | ✅ | ✅ |
| Create Orders | ✅ | ✅ | ✅ |
| View Own Orders | ✅ | ✅ | ✅ |
| View All Orders | ✅ | ✅ | ❌ |
| Update Order Status | ✅ | ✅ | ❌ |
| Cancel Orders | ✅ | ✅ | ❌ |
| Checkout & Payment | ✅ | ✅ | ❌ |
| Manage Payment Methods | ✅ | ❌ | ❌ |
| View All Users | ✅ | ✅ (own country) | ❌ |

**Implementation:**
```typescript
// Using @Roles() decorator
@Mutation(() => PaymentType)
@Roles(Role.ADMIN, Role.MANAGER)
async createPayment(@Args('input') input: CreatePaymentInput) {
  // Only Admin and Manager can access
}
```

### Relationship-Based Access Control (ReBAC)

Country-based data isolation ensures users can **ONLY** access data from their assigned country:

- 🇮🇳 India users can only see India restaurants, menus, orders, payment methods
- 🇺🇸 America users can only see America restaurants, menus, orders, payment methods
- Exception: Admins can view users across all countries (for management purposes)

**Implementation:**
```typescript
// Automatic country filtering in services
async findAll(country?: string) {
  const where = {
    isActive: true,
    ...(country && { country }), // Filter by user's country
  };
  return this.prisma.restaurant.findMany({ where });
}

// Explicit validation for cross-country access
if (order.country !== userCountry && userRole !== 'ADMIN') {
  throw new ForbiddenException('Access denied. Order belongs to a different country');
}
```

---

## 🧪 Testing Guide

### 1. Login and Get Token

```graphql
mutation Login {
  login(input: {
    email: "admin.india@foodapp.com"
    password: "admin123"
  }) {
    token
    user {
      id
      email
      role
      country
    }
  }
}
```

Copy the `token` from the response.

### 2. Set Authorization Header

In GraphQL Playground, add this to the **HTTP HEADERS** tab:

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

### 3. Test RBAC

**Test: Member cannot create payment**
1. Login as `member1.india@foodapp.com` / `member123`
2. Try to run `createPayment` mutation
3. **Expected**: `ForbiddenException: Only Admin and Manager can process payments`

**Test: Admin can manage payment methods**
1. Login as `admin.india@foodapp.com` / `admin123`
2. Run `createPaymentMethod` mutation
3. **Expected**: Success

### 4. Test ReBAC (Country Restriction)

**Test: India user sees only India data**
1. Login as any India user
2. Query `restaurants`
3. **Expected**: Only India restaurants returned

**Test: Cross-country access denied**
1. Login as India user
2. Try to access America-specific resources by ID
3. **Expected**: `ForbiddenException: Access denied. This resource belongs to a different country`

---

## 📁 Project Structure

```
food-ordering-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data script
│   └── dev.db                 # SQLite database (auto-generated)
│
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── enums/
│   │   │   └── index.ts       # Shared enums
│   │   ├── guards/
│   │   │   ├── roles.guard.ts     # RBAC guard
│   │   │   └── country.guard.ts   # ReBAC guard
│   │   └── interfaces/
│   │       └── jwt.interface.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.resolver.ts
│   │   │   ├── dto/
│   │   │   │   └── auth.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.resolver.ts
│   │   │   └── types/
│   │   │       └── user.type.ts
│   │   │
│   │   ├── restaurant/
│   │   │   ├── restaurant.module.ts
│   │   │   ├── restaurant.service.ts
│   │   │   ├── restaurant.resolver.ts
│   │   │   └── types/
│   │   │       └── restaurant.type.ts
│   │   │
│   │   ├── order/
│   │   │   ├── order.module.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.resolver.ts
│   │   │   └── types/
│   │   │       └── order.type.ts
│   │   │
│   │   └── payment/
│   │       ├── payment.module.ts
│   │       ├── payment.service.ts
│   │       ├── payment.resolver.ts
│   │       └── types/
│   │           └── payment.type.ts
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── app.module.ts
│   ├── main.ts
│   └── schema.gql                   # Auto-generated GraphQL schema
│
├── examples.graphql                 # Example queries & mutations
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

---

## 🎯 Available Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio (GUI)
npm run db:setup           # Run all database setup commands

# Production
npm run build              # Build the application
npm run start:prod         # Start production server
```

---

## 🔄 Switching to PostgreSQL

To switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/foodapp?schema=public"
```

3. Run migrations:
```bash
npm run prisma:migrate
```

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 🤝 Support

For issues or questions:
1. Check the [`examples.graphql`](examples.graphql) file for usage examples
2. Review the auto-generated GraphQL schema at `src/schema.gql`
3. Visit the GraphQL Playground at `http://localhost:3000/graphql`

---

**Built with ❤️ using NestJS, GraphQL, and Prisma**
=======
# FlavrAI Role-Based-Food-Ordering-App
FlavrAI- Role Based Food Ordering App represents a highly scalable commercial solution built for the modern food technology industry. Designed to address the operational challenges faced by expanding enterprise restaurant networks, this platform streamlines digital food distribution and vendor logistics on a global scale. 
>>>>>>> 06138bbd834083475974ea54793d27933de284e0
