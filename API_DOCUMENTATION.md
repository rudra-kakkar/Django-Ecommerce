# API Documentation

This API powers the E-commerce platform, providing endpoints for user authentication, product management, shopping cart operations, and order processing.

## Authentication & Users
Base URL: `/api/users/`

### 1. Register User
Create a new user account.
- **URL**: `/register/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```

### 2. Login
Authenticate a user and obtain JWT tokens.
- **URL**: `/login/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "is_admin": false
    }
  }
  ```

### 3. Refresh Token
Get a new access token using a refresh token.
- **URL**: `/refresh/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refresh": "jwt_refresh_token"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "access": "new_jwt_access_token"
  }
  ```

---

## Products
Base URL: `/api/products/`

### 1. List Products
Get a list of all products.
- **URL**: `/`
- **Method**: `GET`
- **Response** (200 OK):
  ```json
  [
    {
      "id": 1,
      "title": "Product Title",
      "description": "Product Description",
      "price": "99.99",
      "category": {
        "id": 1,
        "name": "Category Name"
      },
      "image": "http://server/media/products/image.jpg",
      "created_by": "admin",
      "is_active": true
    }
  ]
  ```

### 2. Get Product Details
Get details of a specific product.
- **URL**: `/{id}/`
- **Method**: `GET`
- **Response** (200 OK): Single product object (same structure as above list items).

### 3. Create Product (Authenticated)
Add a new product.
- **URL**: `/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body** (Multipart/Form-data recommended for image upload):
  - `title`: string
  - `description`: string
  - `price`: decimal
  - `category_id`: integer
  - `image`: file (optional)
  - `is_active`: boolean (default: true)

### 4. Categories
Manage product categories.
- **List Categories**: `GET /categories/`
- **Create Category**: `POST /categories/` (Body: `{"name": "New Category", "slug": "new-category"}`)

---

## Cart
Base URL: `/api/cart/`
All cart endpoints function relative to the authenticated user.
**Headers**: `Authorization: Bearer <access_token>`

### 1. View Cart
Get the current user's cart and items.
- **URL**: `/`
- **Method**: `GET`
- **Response** (200 OK):
  ```json
  {
    "id": 1,
    "user": 1,
    "items": [
      {
        "id": 10,
        "product": { ...product_details... },
        "quantity": 2
      }
    ]
  }
  ```

### 2. Add to Cart
Add a product to the cart.
- **URL**: `/add/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "product_id": 1,
    "quantity": 1
  }
  ```

### 3. Update Cart Item
Update the quantity of an item in the cart.
- **URL**: `/update/{item_id}/` (Note: `item_id` is the ID from the cart items list, NOT the product ID).
- **Method**: `PUT` or `PATCH`
- **Body**:
  ```json
  {
    "quantity": 3
  }
  ```

### 4. Remove from Cart
Remove an item from the cart.
- **URL**: `/remove/{item_id}/`
- **Method**: `DELETE`

---

## Orders
Base URL: `/api/orders/`
**Headers**: `Authorization: Bearer <access_token>`

### 1. Checkout
Create an order from the current cart contents.
- **URL**: `/checkout/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "shipping_address": "123 Main St, City, Country",
    "payment_method": "COD" 
  }
  ```
  - `payment_method` options: "COD" (Cash on Delivery), "MOCK" (Mock Payment).

- **Response** (201 Created):
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "id": 1,
      "status": "PENDING",
      "total_price": "199.98",
      "items": [ ... ],
      "shipping_address": "...",
      "payment_method": "COD"
    }
  }
  ```

### 2. My Orders
Get a history of the authenticated user's orders.
- **URL**: `/my/`
- **Method**: `GET`
- **Response**: List of order objects.

### 3. Admin: All Orders
Get all orders (Admin users only).
- **URL**: `/`
- **Method**: `GET`

### 4. Admin: Update Order Status
Update the status of an order (Admin users only).
- **URL**: `/update/{order_id}/`
- **Method**: `PATCH`
- **Body**:
  ```json
  {
    "status": "DELIVERED"
  }
  ```
  - Valid statuses: `PENDING`, `APPROVED`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
