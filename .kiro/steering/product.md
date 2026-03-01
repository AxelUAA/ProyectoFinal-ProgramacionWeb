# Product Overview

SNEAKERCLON5G is an e-commerce web application for selling sneakers and footwear. The platform allows users to browse products by category (men, women, kids), manage a shopping cart, add items to favorites (wishlist), and complete purchases.

## Key Features

- User authentication with JWT tokens and account lockout after failed attempts
- Product catalog with categories (Hombre/Men, Mujer/Women, Niños/Kids)
- Shopping cart and checkout system
- Wishlist/favorites functionality
- Admin panel for product management (CRUD operations)
- Sales analytics and reporting
- Email notifications (welcome emails, password recovery, contact responses)
- reCAPTCHA integration for login security
- Accessibility features (font size, contrast, dyslexic-friendly fonts)
- PDF receipt generation

## User Roles

- **Cliente** (Customer): Browse products, manage cart, make purchases, manage favorites
- **Admin**: Full product management, view sales analytics, respond to customer inquiries

## Business Logic

- Products have stock tracking
- Failed login attempts trigger account lockout (3 attempts = 5 minute lock)
- New users receive welcome email with discount coupon
- Password recovery via email verification code
- JWT tokens expire after 60 seconds by default
