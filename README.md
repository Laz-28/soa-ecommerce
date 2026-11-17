# NexaStore SOA E-Commerce System

NexaStore is a service-oriented e-commerce prototype developed as a Computer Science course project for the Service-Oriented Architecture unit.

The application separates authentication, product catalogue management, and order processing into independent services. The services communicate through HTTP and JSON and are exposed to the React frontend through an API Gateway.

## Project objectives

The project demonstrates how Service-Oriented Architecture can be applied to an e-commerce system through:

- Independent business services
- Standardized REST API contracts
- Loose coupling
- Service autonomy
- Service reusability
- Service composition
- Interoperability through HTTP and JSON
- Centralized client access through an API Gateway

## Core functionality

The system supports:

- Customer registration
- Customer login
- JWT authentication
- Product catalogue browsing
- Product category filtering
- Shopping cart management
- Cart quantity updates
- Authenticated checkout
- Server-side price verification
- Order creation
- Customer order history
- Session restoration
- Logout

## Architecture overview

```text
                     React Frontend
                    http://localhost:5173
                              |
                              | HTTP / JSON
                              v
                        API Gateway
                    http://localhost:4000
                              |
         ---------------------------------------------
         |                    |                      |
         v                    v                      v
 Authentication Service  Product Service       Order Service
 localhost:4001          localhost:4002         localhost:4003
         |                    ^                      |
         |                    |                      |
         v                    | HTTP / JSON          v
     users.json               +----------------- orders.json