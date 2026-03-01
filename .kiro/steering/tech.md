# Technology Stack

## Backend

- **Runtime**: Node.js with Express.js 5.1.0
- **Database**: MySQL 2 (mysql2 package)
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **Email**: Nodemailer for transactional emails
- **PDF Generation**: PDFKit
- **Environment**: dotenv for configuration
- **Security**: CORS enabled, reCAPTCHA integration

### Backend Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.15.3",
  "node-fetch": "^2.7.0",
  "nodemailer": "^7.0.10",
  "pdfkit": "^0.17.2"
}
```

## Frontend

- **Vanilla JavaScript** (no framework)
- **HTML5** with semantic markup
- **CSS3** with custom styling
- **SweetAlert2** for user notifications
- **Static file serving** via Express

## Development Tools

- **nodemon**: Auto-restart server during development (devDependency)

## Common Commands

### Backend

```bash
# Navigate to backend directory
cd back

# Install dependencies
npm install

# Start server (production)
node server.js

# Start server (development with auto-reload)
npx nodemon server.js
```

### Frontend

The frontend is served as static files. For development:
- Use Live Server extension or similar (typically runs on port 5500)
- Access at: `http://localhost:5500/front/index.html`

### Database

Ensure MySQL is running and configure connection in `back/.env`:

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=60
RECAPTCHA_SECRET_KEY=your_recaptcha_key
PORT=3000
```

## API Server

- Default port: 3000
- Base URL: `http://localhost:3000`
- API prefix: `/api`

## Testing

No test suite currently configured. Tests would need to be added.
