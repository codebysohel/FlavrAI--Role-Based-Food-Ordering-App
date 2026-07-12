# 🚀 Quick Start Guide

## ✅ Implementation Complete!

Your Role-Based Food Ordering System is fully implemented and ready to use!

---

## 📦 What's Been Built

### 1. **Database Schema** (Prisma + SQLite)
- ✅ User model with role and country fields
- ✅ Restaurant & MenuItem models
- ✅ Order & OrderItem models
- ✅ Payment & PaymentMethod models
- ✅ Country-based data isolation (ReBAC)

### 2. **GraphQL API** (Code-First Approach)
- ✅ Auth mutations (login, register)
- ✅ Restaurant & menu queries
- ✅ Order mutations (create, update status, cancel)
- ✅ Payment mutations (checkout, manage payment methods)
- ✅ User management queries

### 3. **RBAC (Role-Based Access Control)**
| Feature | ADMIN | MANAGER | MEMBER |
|---------|-------|---------|--------|
| View Restaurants/Menus | ✅ | ✅ | ✅ |
| Create Orders | ✅ | ✅ | ✅ |
| View All Orders | ✅ | ✅ | ❌ |
| Update Order Status | ✅ | ✅ | ❌ |
| Cancel Orders | ✅ | ✅ | ❌ |
| Checkout & Payment | ✅ | ✅ | ❌ |
| Manage Payment Methods | ✅ | ❌ | ❌ |

### 4. **ReBAC (Country-Based Access)**
- 🇮🇳 India users can ONLY see India data
- 🇺🇸 America users can ONLY see America data
- Automatic filtering in all resolvers

---

## 🎮 Step-by-Step Usage Guide

### Step 1: Start the Server

Open your **terminal/command prompt** in the project folder:

```bash
cd c:\Users\srita\Downloads\ganesh\food-ordering-app
npm run start:dev
```

You should see:
```
🍔 Food Ordering API is running!
🌐 GraphQL Playground: http://localhost:3000/graphql
```

### Step 2: Open GraphQL Playground

Open your **web browser** and visit:

```
http://localhost:3000/graphql
```

You'll see the GraphQL Playground interface with:
- **Left Panel** → Where you write queries
- **Right Panel** → Where results appear
- **Bottom Panel** → Tabs for HTTP HEADERS, VARIABLES, etc.

### Step 3: Login to Get Token

**WHERE:** Left Panel (Query Editor)  
**WHAT TO DO:** Paste this mutation and click the **▶ Play** button

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

**RESULT:** You'll see a response in the **Right Panel** like this:

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOTUyNDM4Yy1hMjQwLTQwMzEtYTRhMi1mZTE2NzZhMWQwMzMiLCJlbWFpbCI6ImFkbWluLmluZGlhQGZvb2RhcHAuY29tIiwicm9sZSI6IkFETUlOIiwiY291bnRyeSI6IklORElBIiwiaWF0IjoxNzc1NzEwMDIwLCJleHAiOjE3NzYzMTQ4MjB9.9KH8NBaed5rqKo0FyDebICdCgVvinh_Z2ABpTtgygOQ",
      "user": {
        "id": "d952438c-a240-4031-a4a2-fe1676a1d033",
        "email": "admin.india@foodapp.com",
        "role": "ADMIN",
        "country": "INDIA"
      }
    }
  }
}
```

**✅ COPY THE TOKEN** - You'll need it for the next step!

### Step 4: Add Authorization Header

**WHERE:** Bottom Panel → Click **"HTTP HEADERS"** tab

**WHAT TO DO:** Paste this JSON (replace with YOUR actual token):

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOTUyNDM4Yy1hMjQwLTQwMzEtYTRhMi1mZTE2NzZhMWQwMzMiLCJlbWFpbCI6ImFkbWluLmluZGlhQGZvb2RhcHAuY29tIiwicm9sZSI6IkFETUlOIiwiY291bnRyeSI6IklORElBIiwiaWF0IjoxNzc1NzEwMDIwLCJleHAiOjE3NzYzMTQ4MjB9.9KH8NBaed5rqKo0FyDebICdCgVvinh_Z2ABpTtgygOQ"
}
```

**VISUAL GUIDE:**

```
┌────────────────────────────────────────────────────────┐
│  LEFT PANEL (Write queries HERE)                       │
│                                                        │
│  mutation Login {                                      │
│    login(input: { ... }) {                             │
│      token                                             │
│    }                                                   │
│  }                                                     │
│                                                        │
│              [ ▶ Play ]  ← Click this button           │
└────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────┐
│  BOTTOM PANEL (Tabs)                                   │
│                                                        │
│  QUERY VARIABLES  |  [HTTP HEADERS]  |  TRACING        │
│                          ↑                             │
│                    CLICK THIS TAB!                     │
│                                                        │
│  {                                                     │
│    "Authorization": "Bearer YOUR_TOKEN_HERE"           │
│  }                                                     │
└────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANT:**
- Only ONE query/mutation per request
- The HTTP HEADERS token stays the same for all queries
- Each login gives a NEW token (old tokens expire)

### Step 5: Query Restaurants

**WHERE:** Left Panel (Clear the previous mutation first!)  
**WHAT TO DO:** Paste this query and click **▶ Play**

```graphql
query {
  restaurants {
    id
    name
    description
    city
    rating
    country
  }
}
```

**RESULT:** You'll see only India restaurants (because you logged in as India admin):

```json
{
  "data": {
    "restaurants": [
      {
        "id": "...",
        "name": "Spice Garden",
        "description": "Authentic Indian cuisine",
        "city": "New Delhi",
        "rating": 4.5,
        "country": "INDIA"
      },
      {
        "id": "...",
        "name": "Mumbai Delights",
        "description": "Street food and coastal specialties",
        "city": "Mumbai",
        "rating": 4.3,
        "country": "INDIA"
      }
    ]
  }
}
```

### Step 6: Query Menu Items

**WHERE:** Left Panel (Clear previous query!)  
**WHAT TO DO:** Paste and click **▶ Play**

```graphql
query {
  menuItems {
    id
    name
    price
    category
    isVegetarian
    restaurant {
      name
    }
  }
}
```

### Step 7: Create an Order

**WHERE:** Left Panel (Clear previous query!)  
**WHAT TO DO:** First, get a restaurant ID and menu item ID from previous queries, then paste:

```graphql
mutation {
  createOrder(input: {
    restaurantId: "PASTE_RESTAURANT_ID_HERE"
    notes: "Extra spicy please"
    items: [
      {
        menuItemId: "PASTE_MENU_ITEM_ID_HERE"
        quantity: 2
      }
    ]
  }) {
    id
    status
    totalAmount
    items {
      menuItemId
      quantity
      unitPrice
      totalPrice
    }
  }
}
```

### Step 8: View All Orders (Admin & Manager Only)

**WHERE:** Left Panel (Clear previous query!)  
**WHAT TO DO:** Paste and click **▶ Play**

```graphql
query {
  orders {
    id
    status
    totalAmount
    country
    userId
    restaurantId
    restaurantName
  }
}
```

---

## 🔐 Test Credentials

### India Users
| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin.india@foodapp.com | admin123 | ADMIN | INDIA |
| manager.india@foodapp.com | manager123 | MANAGER | INDIA |
| member1.india@foodapp.com | member123 | MEMBER | INDIA |
| member2.india@foodapp.com | member123 | MEMBER | INDIA |

### America Users
| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin.america@foodapp.com | admin123 | ADMIN | AMERICA |
| manager.america@foodapp.com | manager123 | MANAGER | AMERICA |
| member1.america@foodapp.com | member123 | MEMBER | AMERICA |
| member2.america@foodapp.com | member123 | MEMBER | AMERICA |

---

## 🧪 Test RBAC & ReBAC

### Test 1: Member Cannot Create Payment ❌
1. **Login** as `member1.india@foodapp.com` / `member123`
2. Copy the new token to **HTTP HEADERS**
3. Try to run this mutation:
   ```graphql
   mutation {
     createPayment(input: {
       orderId: "any-order-id"
       paymentMethodId: "any-payment-method-id"
     }) {
       id
       status
     }
   }
   ```
4. **Expected Error:** "Only Admin and Manager can process payments"

### Test 2: Country Restriction (ReBAC) 🌍
1. **Login** as any India user
2. Query `restaurants`
3. **Expected:** Only India restaurants returned (no America restaurants)

### Test 3: Admin Can Manage Payment Methods ✅
1. **Login** as `admin.india@foodapp.com` / `admin123`
2. Copy token to **HTTP HEADERS**
3. Run this mutation:
   ```graphql
   mutation {
     createPaymentMethod(input: {
       name: "Wallet"
       type: "WALLET"
       country: "INDIA"
     }) {
       id
       name
       type
       isActive
       country
     }
   }
   ```
4. **Expected:** Success! New payment method created

### Test 4: Member Can Create Order ✅
1. **Login** as `member1.india@foodapp.com` / `member123`
2. Copy token to **HTTP HEADERS**
3. Run `createOrder` mutation
4. **Expected:** Order created successfully

---

## 📁 Project Structure

```
food-ordering-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── dev.db                 # SQLite database
├── src/
│   ├── common/
│   │   ├── decorators/        # @Roles(), @CurrentUser()
│   │   ├── guards/           # RolesGuard, CountryGuard, GqlJwtGuard
│   │   └── enums/            # Shared enums
│   ├── modules/
│   │   ├── auth/             # Authentication
│   │   ├── user/             # User management
│   │   ├── restaurant/       # Restaurants & menus
│   │   ├── order/            # Order management
│   │   └── payment/          # Payment processing
│   ├── graphql.types.ts      # GraphQL enum registrations
│   ├── app.module.ts
│   └── main.ts
├── examples.graphql          # Example queries
└── README.md                 # Full documentation
```

---

## 📚 Complete Documentation

- **Full README**: See `README.md` for detailed documentation
- **Example Queries**: See `examples.graphql` for all available queries/mutations
- **GraphQL Schema**: Auto-generated at `src/schema.gql`
- **Architecture**: See `ARCHITECTURE.md` for system design details

---

## 🎯 Available Scripts

```bash
npm run start:dev       # Start dev server with watch mode
npm run build           # Build for production
npm run start:prod      # Start production server
npm run prisma:studio   # Open Prisma Studio (database GUI)
npm run prisma:seed     # Re-seed database
npm run prisma:migrate  # Run database migrations
```

---

## 🐛 Troubleshooting

**Server won't start?**
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

**GraphQL Playground not loading?**
- Make sure the server is running: `npm run start:dev`
- Check terminal/console for errors
- Visit: http://localhost:3000/graphql

**"Invalid or expired token" error?**
- Login again to get a fresh token
- Make sure you copied the entire token (no missing characters)
- The token is in the `login` response under `data.login.token`

**"Expected Name, found String" error?**
- You pasted the JSON in the wrong place!
- Make sure JSON goes in **HTTP HEADERS** tab (bottom panel), not the query editor

**Database issues?**
```bash
# Reset and reseed database
npx prisma migrate reset
npm run prisma:seed
```

---

## ✨ Key Features Implemented

✅ JWT Authentication  
✅ RBAC with 3 roles (Admin, Manager, Member)  
✅ ReBAC with country-based data isolation  
✅ GraphQL API with code-first approach  
✅ Prisma ORM with SQLite  
✅ Seeded database with mock data  
✅ Clean architecture with modular structure  
✅ Production-ready code with TypeScript  
✅ Comprehensive error handling  
✅ Input validation with class-validator  

---

## 🎉 You're All Set!

The server is running and ready to test. Open the GraphQL Playground and start exploring the API!

**Remember:**
1. **Left Panel** → Write queries here (ONE at a time)
2. **Bottom Panel → HTTP HEADERS** → Add your token here
3. **▶ Play Button** → Run your query
4. **Right Panel** → See results here

For detailed documentation, see `README.md`  
For example queries, see `examples.graphql`
