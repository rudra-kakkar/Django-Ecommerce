# E-Commerce Platform

A full-stack e-commerce application built with Django REST Framework and React.

## 🚀 Use Case

This project provides a complete e-commerce solution including:
- **User Authentication**: Secure Login/Register with JWT.
- **Product Management**: Browse products, view details.
- **Shopping Cart**: Add items, manage quantities.
- **Order System**: Place orders with email breakdown (via Celery).
- **Admin Panel**: Manage products and orders via Django Admin.

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 6.0
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Task Queue**: Celery & Redis
- **Authentication**: JWT (SimpleJWT)

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management & Data Fetching**: React Hooks, Axios
- **Routing**: React Router DOM 7
- **UI Interactions**: Framer Motion, React Icons

## ⚙️ Prerequisites

Ensure you have the following installed:
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/) (for background tasks)

## 📦 Installation & Setup

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2. **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
3. **Activate the virtual environment:**
    ```bash
    .\venv\Scripts\activate
    ```

4.  **Install dependencies using requirement.txt:**
    ```bash
    pip install -r requirement.txt
    ```

3.  **Configure Database:**
    - Ensure PostgreSQL is running.
    - Create a database named `ecommerce_db`:
      ```sql
      CREATE DATABASE ecommerce_db;
      ```

4.  **Run Migrations:**
    Navigate to the inner project directory:
    ```bash
    cd ecombackend
    ```
    Apply migrations:
    ```bash
    python manage.py migrate
    ```

5.  **Create Superuser:**
    ```bash
    python manage.py createsuperuser

    
    ```
6. **Make Superuser Admin:**
    ```bash
    from users.models import User
    u = User.objects.get(username="admin")
    u.is_admin = True
    u.save()
    ```

7.  **Start the Development Server:**
    ```bash
    python manage.py runserver
    ```

8.  **Start Celery Worker (for emails):**
    Open a new terminal in `backend/ecombackend` and run:
    ```bash
    celery -A ecombackend worker -l info
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/ecom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

The application should now be accessible at `http://localhost:5173/`.

## 📂 Project Structure

```
ecom/
├── backend/                # Django Backend
│   └── ecombackend/        # Main Django Project & Apps
│       ├── cart/           # Cart functionality
│       ├── orders/         # Order management
│       ├── products/       # Product catalog
│       ├── users/          # Authentication & User profiles
│       ├── ecombackend/    # Settings & Configuration
│       └── manage.py       # Django CLI
├── frontend/ecom/          # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page views (Home, Login, Cart, etc.)
│   │   └── App.jsx         # Main App component
│   └── vite.config.js      # Vite Configuration
└── README.md               # This file
```

