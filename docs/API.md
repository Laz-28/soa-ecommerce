# NexaStore API Documentation

## 1. API Gateway base URL

All client requests use:

```text
http://localhost:4000/api
```

The frontend should not call internal services directly.

---

## 2. Authentication

Protected endpoints require a JWT in the authorization header:

```http
Authorization: Bearer <jwt-token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

# Authentication endpoints

## 3. Register customer

Creates a new customer account.

### Request

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Lazaro Otieno",
  "email": "lazaro@example.com",
  "password": "password123"
}
```

### Successful response

```http
201 Created
```

```json
{
  "message": "Registration successful",
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "name": "Lazaro Otieno",
    "email": "lazaro@example.com",
    "createdAt": "2026-11-17T03:00:00.000Z"
  }
}
```

### Possible errors

#### Missing input

```http
400 Bad Request
```

```json
{
  "message": "Name, email and password are required"
}
```

#### Invalid email

```http
400 Bad Request
```

```json
{
  "message": "Enter a valid email address"
}
```

#### Short password

```http
400 Bad Request
```

```json
{
  "message": "Password must contain at least 6 characters"
}
```

#### Duplicate email

```http
409 Conflict
```

```json
{
  "message": "An account with that email already exists"
}
```

---

## 4. Login

Authenticates a customer and returns a JWT.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "lazaro@example.com",
  "password": "password123"
}
```

### Successful response

```http
200 OK
```

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "name": "Lazaro Otieno",
    "email": "lazaro@example.com",
    "createdAt": "2026-11-17T03:00:00.000Z"
  }
}
```

### Invalid credentials

```http
401 Unauthorized
```

```json
{
  "message": "Invalid email or password"
}
```

---

## 5. Get current customer

Returns the customer represented by the JWT.

### Request

```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Successful response

```http
200 OK
```

```json
{
  "user": {
    "id": 1,
    "name": "Lazaro Otieno",
    "email": "lazaro@example.com",
    "createdAt": "2026-11-17T03:00:00.000Z"
  }
}
```

### Missing token

```http
401 Unauthorized
```

```json
{
  "message": "Authentication token is required"
}
```

### Invalid or expired token

```http
401 Unauthorized
```

```json
{
  "message": "Invalid or expired authentication token"
}
```

---

# Product endpoints

## 6. List all products

Returns the complete product catalogue.

### Request

```http
GET /api/products
```

### Successful response

```http
200 OK
```

```json
[
  {
    "id": 1,
    "name": "NexaPods Air",
    "category": "Audio",
    "description": "Wireless earbuds with clear calls and deep bass.",
    "price": 2100,
    "originalPrice": 4000,
    "rating": 4.8,
    "reviewCount": 926,
    "stock": 20,
    "badge": "BEST SELLER",
    "image": "/products/nexapods-air.jpg"
  },
  {
    "id": 2,
    "name": "NexaWatch Pro",
    "category": "Smart Watches",
    "description": "Smart watch with health tracking and HD calling.",
    "price": 4500,
    "originalPrice": 6500,
    "rating": 4.7,
    "reviewCount": 541,
    "stock": 14,
    "badge": "NEW",
    "image": "/products/nexawatch-pro.jpg"
  }
]
```

---

## 7. Filter products by category

### Request

```http
GET /api/products?category=Audio
```

### Successful response

```http
200 OK
```

```json
[
  {
    "id": 1,
    "name": "NexaPods Air",
    "category": "Audio",
    "price": 2100,
    "stock": 20
  }
]
```

If the category has no products, the service returns an empty array:

```json
[]
```

---

## 8. Get one product

### Request

```http
GET /api/products/1
```

### Successful response

```http
200 OK
```

```json
{
  "id": 1,
  "name": "NexaPods Air",
  "category": "Audio",
  "description": "Wireless earbuds with clear calls and deep bass.",
  "price": 2100,
  "originalPrice": 4000,
  "rating": 4.8,
  "reviewCount": 926,
  "stock": 20,
  "badge": "BEST SELLER",
  "image": "/products/nexapods-air.jpg"
}
```

### Product not found

```http
404 Not Found
```

```json
{
  "message": "Product not found"
}
```

---

# Order endpoints

All order endpoints require authentication.

## 9. Create an order

Creates an order for the authenticated customer.

The frontend sends only product IDs and quantities.

### Request

```http
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

Order Service performs the following operations:

1. Verifies the JWT.
2. Reads the customer ID from the token.
3. Requests each product from Product Service.
4. Validates product existence.
5. Validates stock availability.
6. Obtains the official price.
7. Calculates each subtotal.
8. Calculates the total.
9. Stores the completed order.

### Successful response

```http
201 Created
```

```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "reference": "NEXA-00001",
    "userId": 1,
    "customerEmail": "lazaro@example.com",
    "items": [
      {
        "productId": 1,
        "name": "NexaPods Air",
        "unitPrice": 2100,
        "quantity": 2,
        "subtotal": 4200
      },
      {
        "productId": 3,
        "name": "PowerCore 20",
        "unitPrice": 3200,
        "quantity": 1,
        "subtotal": 3200
      }
    ],
    "total": 7400,
    "status": "CREATED",
    "createdAt": "2026-11-17T03:30:00.000Z"
  }
}
```

### Empty order

```http
400 Bad Request
```

```json
{
  "message": "The order must contain at least one item"
}
```

### Invalid quantity

```http
400 Bad Request
```

```json
{
  "message": "Each item quantity must be between 1 and 10"
}
```

### Product not found

```http
400 Bad Request
```

```json
{
  "message": "Product 999 was not found"
}
```

### Insufficient stock

```http
409 Conflict
```

```json
{
  "message": "Only 2 unit(s) of NexaPods Air are available"
}
```

### Product Service unavailable

```http
503 Service Unavailable
```

```json
{
  "message": "Product Service is temporarily unavailable"
}
```

---

## 10. Get current customer’s orders

Returns orders that belong to the authenticated customer.

### Request

```http
GET /api/orders/my-orders
Authorization: Bearer <jwt-token>
```

### Successful response

```http
200 OK
```

```json
{
  "count": 1,
  "orders": [
    {
      "id": 1,
      "reference": "NEXA-00001",
      "userId": 1,
      "customerEmail": "lazaro@example.com",
      "items": [
        {
          "productId": 1,
          "name": "NexaPods Air",
          "unitPrice": 2100,
          "quantity": 2,
          "subtotal": 4200
        }
      ],
      "total": 4200,
      "status": "CREATED",
      "createdAt": "2026-11-17T03:30:00.000Z"
    }
  ]
}
```

If the customer has no orders:

```json
{
  "count": 0,
  "orders": []
}
```

---

## 11. Get one order

Returns one order belonging to the authenticated customer.

### Request

```http
GET /api/orders/1
Authorization: Bearer <jwt-token>
```

### Successful response

```http
200 OK
```

```json
{
  "order": {
    "id": 1,
    "reference": "NEXA-00001",
    "userId": 1,
    "customerEmail": "lazaro@example.com",
    "items": [
      {
        "productId": 1,
        "name": "NexaPods Air",
        "unitPrice": 2100,
        "quantity": 2,
        "subtotal": 4200
      }
    ],
    "total": 4200,
    "status": "CREATED",
    "createdAt": "2026-11-17T03:30:00.000Z"
  }
}
```

### Order not found or not owned by customer

```http
404 Not Found
```

```json
{
  "message": "Order not found"
}
```

The service deliberately returns the same response when an order does not exist or belongs to another customer.

---

# Health endpoints

## 12. API Gateway health

```http
GET http://localhost:4000/health
```

```json
{
  "service": "api-gateway",
  "status": "UP",
  "timestamp": "2026-11-17T03:00:00.000Z"
}
```

## 13. Authentication Service health

```http
GET http://localhost:4001/health
```

```json
{
  "service": "auth-service",
  "status": "UP",
  "timestamp": "2026-11-17T03:00:00.000Z"
}
```

## 14. Product Service health

```http
GET http://localhost:4002/
```

```json
{
  "service": "product-service",
  "status": "UP"
}
```

## 15. Order Service health

```http
GET http://localhost:4003/health
```

```json
{
  "service": "order-service",
  "status": "UP",
  "timestamp": "2026-11-17T03:00:00.000Z"
}
```

---

# HTTP status codes

| Status | Meaning |
|---:|---|
| 200 | Request completed successfully |
| 201 | Resource created successfully |
| 400 | Invalid request data |
| 401 | Authentication required or invalid |
| 404 | Resource not found |
| 409 | Conflict, such as insufficient stock |
| 500 | Internal service error |
| 502 | Invalid downstream service response |
| 503 | Required service unavailable |

---

# Gateway routing table

| Client endpoint | Internal destination |
|---|---|
| `POST /api/auth/register` | `POST http://localhost:4001/auth/register` |
| `POST /api/auth/login` | `POST http://localhost:4001/auth/login` |
| `GET /api/auth/me` | `GET http://localhost:4001/auth/me` |
| `GET /api/products` | `GET http://localhost:4002/products` |
| `GET /api/products/:id` | `GET http://localhost:4002/products/:id` |
| `POST /api/orders` | `POST http://localhost:4003/orders` |
| `GET /api/orders/my-orders` | `GET http://localhost:4003/orders/my-orders` |
| `GET /api/orders/:id` | `GET http://localhost:4003/orders/:id` |