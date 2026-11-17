# Running the NexaStore System

## 1. Prerequisites

The following software is required:

- Node.js 18 or later
- npm
- Git
- Git Bash
- A modern browser
- Visual Studio Code or another editor

Confirm Node.js and npm:

```bash
node --version
npm --version
```

---

## 2. Install project dependencies

Run these commands from the project root.

### Install API Gateway dependencies

```bash
cd api-gateway
npm install
cd ..
```

### Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### Install Authentication Service dependencies

```bash
cd services/auth-service
npm install
cd ../..
```

### Install Product Service dependencies

```bash
cd services/product-service
npm install
cd ../..
```

### Install Order Service dependencies

```bash
cd services/order-service
npm install
cd ../..
```

---

## 3. Configure environment variables

### Authentication Service

Create:

```text
services/auth-service/.env
```

Add:

```env
PORT=4001
JWT_SECRET=nexa_soa_demo_secret_change_in_production
JWT_EXPIRES_IN=2h
```

### Order Service

Create:

```text
services/order-service/.env
```

Add:

```env
PORT=4003
JWT_SECRET=nexa_soa_demo_secret_change_in_production
PRODUCT_SERVICE_URL=http://localhost:4002
```

The `JWT_SECRET` must be identical in Authentication Service and Order Service.

### API Gateway

Create:

```text
api-gateway/.env
```

Add:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4003
```

Do not commit `.env` files.

---

## 4. Start the system

The system requires five terminals.

Start the backend services before starting the frontend.

---

### Terminal 1: Product Service

From the project root:

```bash
cd services/product-service
npm run dev
```

Expected output:

```text
Product Service running on http://localhost:4002
```

Test:

```bash
curl http://localhost:4002/
```

Expected response:

```json
{
  "service": "product-service",
  "status": "UP"
}
```

---

### Terminal 2: Authentication Service

Open another Git Bash terminal:

```bash
cd services/auth-service
npm run dev
```

Expected output:

```text
Auth Service running on http://localhost:4001
```

Test:

```bash
curl http://localhost:4001/health
```

Expected response:

```json
{
  "service": "auth-service",
  "status": "UP",
  "timestamp": "..."
}
```

---

### Terminal 3: Order Service

Open another Git Bash terminal:

```bash
cd services/order-service
npm run dev
```

Expected output:

```text
Order Service running on http://localhost:4003
Product Service: http://localhost:4002
```

Test:

```bash
curl http://localhost:4003/health
```

Expected response:

```json
{
  "service": "order-service",
  "status": "UP",
  "timestamp": "..."
}
```

---

### Terminal 4: API Gateway

Open another Git Bash terminal:

```bash
cd api-gateway
npm run dev
```

Expected output:

```text
API Gateway running on http://localhost:4000
Auth Service: http://localhost:4001
Product Service: http://localhost:4002
Order Service: http://localhost:4003
```

Test:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{
  "service": "api-gateway",
  "status": "UP",
  "timestamp": "..."
}
```

Test products through the gateway:

```bash
curl http://localhost:4000/api/products
```

---

### Terminal 5: React frontend

Open another Git Bash terminal:

```bash
cd frontend
npm run dev
```

Expected output:

```text
Local: http://localhost:5173/
```

Open the browser at:

```text
http://localhost:5173
```

---

## 5. Recommended startup order

Use this startup order:

```text
1. Product Service
2. Authentication Service
3. Order Service
4. API Gateway
5. React frontend
```

This ensures service dependencies are already available when the frontend starts making requests.

---

## 6. Port reference

| Component | Port | Address |
|---|---:|---|
| React Frontend | 5173 | `http://localhost:5173` |
| API Gateway | 4000 | `http://localhost:4000` |
| Authentication Service | 4001 | `http://localhost:4001` |
| Product Service | 4002 | `http://localhost:4002` |
| Order Service | 4003 | `http://localhost:4003` |

---

## 7. Test the complete workflow

### Step 1: Open the frontend

```text
http://localhost:5173
```

### Step 2: Register a customer

Use:

```text
Name: Test Customer
Email: customer@example.com
Password: password123
```

### Step 3: Add products to the cart

Add at least two products.

### Step 4: Open the cart

Use the Cart button in the header.

### Step 5: Adjust quantities

Use the plus and minus controls.

### Step 6: Complete checkout

Click:

```text
Complete checkout
```

### Step 7: View the order

Open the customer account menu and select:

```text
My orders
```

The latest order should display:

- Order reference
- Products
- Quantities
- Subtotals
- Total
- Status
- Creation date

---

## 8. Stopping the system

In each terminal, press:

```text
Ctrl+C
```

Stop all five processes when finished.

---

## 9. Troubleshooting

### Products do not load

Confirm Product Service is running:

```bash
curl http://localhost:4002/products
```

Confirm the gateway can reach it:

```bash
curl http://localhost:4000/api/products
```

### Login does not work

Confirm Authentication Service is running:

```bash
curl http://localhost:4001/health
```

Confirm the gateway route:

```bash
curl http://localhost:4000/health
```

### Checkout returns HTTP 401

The customer must sign in before checkout.

Also confirm the JWT exists in browser local storage:

```text
Browser Developer Tools
Application
Local Storage
http://localhost:5173
nexa_token
```

### Checkout reports Product Service unavailable

Restart Product Service:

```bash
cd services/product-service
npm run dev
```

### Order Service rejects the token

Confirm these files contain the same `JWT_SECRET`:

```text
services/auth-service/.env
services/order-service/.env
```

Restart both services after editing `.env`.

### CORS error

Confirm `api-gateway/.env` contains:

```env
FRONTEND_URL=http://localhost:5173
```

Restart the API Gateway after changing the environment configuration.

### Product images do not appear

Confirm local images are stored inside:

```text
frontend/public/products/
```

Open an image directly:

```text
http://localhost:5173/products/nexapods-air.jpg
```

If the direct URL fails, check that the filename and extension match the path returned by Product Service.

### Port already in use

On Windows, find the process using a port:

```bash
netstat -ano | findstr :4000
```

Replace `4000` with the affected port.

Stop the process using its PID:

```bash
taskkill //PID PROCESS_ID //F
```

Then restart the service.

---

## 10. Development addresses

The frontend should send API requests only to:

```text
http://localhost:4000/api
```

It should not directly call:

```text
http://localhost:4001
http://localhost:4002
http://localhost:4003
```

The API Gateway is the single client-facing backend entry point.