# Project Structure

## Overview

The project follows a traditional client-server architecture with separate frontend and backend directories.

```
.
├── back/           # Backend (Node.js/Express API)
├── front/          # Frontend (HTML/CSS/JS)
└── .kiro/          # Kiro configuration
```

## Backend Structure (`back/`)

```
back/
├── controllers/    # Request handlers and business logic
│   ├── authController.js      # Login, JWT generation
│   ├── userController.js      # User profile operations
│   ├── salesController.js     # Sales analytics
│   └── salesController2.js    # Additional sales operations
├── db/
│   └── conexion.js            # MySQL connection configuration
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── model/
│   ├── SalesModel.js          # Sales data models
│   └── SalesModel2.js         # Additional sales models
├── routes/
│   ├── routes.js              # Product CRUD, user registration, wishlist
│   ├── authRoutes.js          # Authentication endpoints
│   ├── userRoutes.js          # User-specific endpoints
│   ├── salesRoutes.js         # Sales analytics endpoints
│   └── salesRoutes2.js        # Sales transaction endpoints
├── public/
│   └── img/                   # Product images and assets
├── .env                       # Environment variables (not in git)
├── server.js                  # Express app entry point
└── package.json
```

### Backend Conventions

- **Controllers**: Handle request/response logic, call models/services
- **Routes**: Define API endpoints and map to controllers
- **Middleware**: JWT authentication, request validation
- **Models**: Database query logic and data transformations
- **Static files**: Served from `public/` at `/public` path

### API Route Structure

- `/api` - General routes (products, cart, wishlist, user registration)
- `/api/auth` - Authentication (login)
- `/api/users` - User operations (protected with JWT)
- `/api/graficas` - Sales analytics
- `/api/sales` - Sales transactions (stock verification, checkout)

## Frontend Structure (`front/`)

```
front/
├── css/                    # Stylesheets
│   ├── styles.css         # Global styles
│   ├── productos.css      # Product grid/cards
│   ├── carousel.css       # Product carousel
│   ├── favoritos.css      # Wishlist styling
│   └── [page-specific].css
├── js/                     # JavaScript modules
│   ├── auth.js            # Authentication state management
│   ├── cargarProductos.js # Product loading and display
│   ├── carousel.js        # Carousel functionality
│   ├── favoritos.js       # Wishlist operations
│   ├── modal.js           # Product detail modal
│   ├── login.js           # Login form handling
│   ├── registrar.js       # Registration form
│   ├── pagar.js           # Checkout process
│   └── [feature].js       # Feature-specific scripts
├── pages/
│   └── inicio.html        # Alternative home page
├── index.html             # Main landing page
├── login.html             # Login page
├── registrar.html         # Registration page
├── hombre.html            # Men's category
├── mujer.html             # Women's category
├── niños.html             # Kids' category
├── favoritos.html         # Wishlist page
├── pagar.html             # Checkout page
├── nosotros.html          # About page
├── contacto.html          # Contact page
├── faq.html               # FAQ page
├── agregar.html           # Admin: Add product
├── modificar.html         # Admin: Edit product
└── eliminar.html          # Admin: Delete product
```

### Frontend Conventions

- **HTML files**: One per page/view, located in root of `front/`
- **CSS**: Modular stylesheets, one per major feature or page
- **JavaScript**: Modular scripts, one per feature
- **No build process**: Direct file serving, no bundler
- **API calls**: Use `fetch()` to backend at `http://localhost:3000`
- **Authentication**: JWT stored in `localStorage`, checked in `auth.js`
- **User feedback**: SweetAlert2 for alerts and confirmations

### Frontend Module Responsibilities

- `auth.js`: Check login state, render user menu, handle logout
- `cargarProductos.js`: Fetch and render product grid
- `modal.js`: Product detail popup functionality
- `favoritos.js`: Add/remove from wishlist, sync with backend
- `pagar.js`: Cart management, checkout flow, stock verification

## Database Schema

Key tables (inferred from code):

- `productos`: id, nombre, descripcion, precio, stock, imagen, categoria
- `usuarios`: ID, Nombre, Correo, Password, Rol, failed_attempts, locked_until, codigo
- `wishlist`: id, id_usuario, id_producto, fecha_agregado
- Sales-related tables (referenced in controllers)

## Configuration Files

- `back/.env`: Environment variables (database, JWT, email, reCAPTCHA)
- `back/package.json`: Backend dependencies
- `.gitignore`: Excludes node_modules, .env, etc.

## Naming Conventions

- **Files**: camelCase for JS, lowercase for HTML/CSS
- **Database**: snake_case for columns, PascalCase for some fields
- **Variables**: camelCase in JavaScript
- **Routes**: kebab-case in URLs
- **CSS classes**: kebab-case
- **Mixed language**: Some Spanish (Nombre, Correo) and English mixed in codebase
