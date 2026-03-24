# Portfolio Backend API

A professional Node.js/Express backend for handling portfolio website functionality including contact forms, testimonials, newsletter subscriptions, and project inquiries.

## Features

- ✉️ **Contact Form** - Email sending via Nodemailer with auto-reply
- ⭐ **Testimonials** - Customer reviews with ratings (1-5 stars)
- 📧 **Newsletter** - Subscribe/unsubscribe functionality
- 💼 **Project Inquiries** - Detailed project request submissions
- 📊 **Analytics** - Basic page view tracking
- 🔒 **Rate Limiting** - Protection against abuse
- 🛡️ **Input Sanitization** - XSS protection
- 💾 **SQLite Database** - Lightweight, file-based storage

## Quick Start

### 1. Install Dependencies

```bash
cd contact-backend
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This creates the SQLite database with sample testimonials.

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the App Password as `EMAIL_PASS`

### 4. Run the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## API Endpoints

### General

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Test if server is running |
| GET | `/health` | Health check endpoint |

### Testimonials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/testimonials` | Get all approved testimonials |
| GET | `/api/testimonials/stats` | Get rating statistics |
| POST | `/api/testimonials` | Submit a new testimonial |

**Query Parameters for GET /api/testimonials:**
- `featured` - Filter featured testimonials (true/false)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset (default: 0)

**POST /api/testimonials Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "position": "CEO",
  "rating": 5,
  "title": "Excellent work!",
  "message": "Promise delivered outstanding results...",
  "project_type": "Web Application"
}
```

### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe from newsletter |

**Subscribe Body:**
```json
{
  "email": "subscriber@example.com",
  "name": "Subscriber Name"
}
```

### Project Inquiries

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit a project inquiry |

**Request Body:**
```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+234 123 456 7890",
  "company": "Client Company",
  "project_type": "E-commerce Platform",
  "budget_range": "$5,000 - $10,000",
  "timeline": "2-3 months",
  "description": "Detailed project description..."
}
```

### Contact Form

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-email` | Send contact form email |

**Request Body:**
```json
{
  "name": "Sender Name",
  "email": "sender@example.com",
  "subject": "Hello!",
  "message": "Your message here..."
}
```

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analytics/track` | Track a page view/event |
| GET | `/api/analytics/summary` | Get analytics summary |

## Database Schema

### testimonials
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Reviewer name |
| email | TEXT | Reviewer email (optional) |
| company | TEXT | Company name |
| position | TEXT | Job position |
| rating | INTEGER | Rating (1-5) |
| title | TEXT | Review title |
| message | TEXT | Review content |
| project_type | TEXT | Type of project |
| is_approved | INTEGER | Moderation status |
| is_featured | INTEGER | Featured status |
| created_at | DATETIME | Creation timestamp |

### newsletter_subscribers
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| email | TEXT | Subscriber email |
| name | TEXT | Subscriber name |
| is_active | INTEGER | Subscription status |
| subscribed_at | DATETIME | Subscription date |
| unsubscribed_at | DATETIME | Unsubscription date |

### project_inquiries
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Client name |
| email | TEXT | Client email |
| phone | TEXT | Phone number |
| company | TEXT | Company name |
| project_type | TEXT | Type of project |
| budget_range | TEXT | Budget range |
| timeline | TEXT | Project timeline |
| description | TEXT | Project description |
| status | TEXT | Inquiry status |
| created_at | DATETIME | Creation timestamp |

### contact_messages
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Sender name |
| email | TEXT | Sender email |
| subject | TEXT | Message subject |
| message | TEXT | Message content |
| is_read | INTEGER | Read status |
| is_replied | INTEGER | Reply status |
| created_at | DATETIME | Creation timestamp |

## Security Features

- **Rate Limiting**: 10 requests per 15 minutes per IP
- **Input Sanitization**: XSS protection for all inputs
- **Email Validation**: Validates email format
- **Length Limits**: Prevents oversized submissions
- **Request Size Limit**: 10KB max body size
- **CORS**: Configurable allowed origins

## Deployment

### Render.com

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run init-db`
4. Set start command: `npm start`
5. Add environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL`

### Railway.app

1. Create a new project
2. Deploy from GitHub
3. Add environment variables in Variables tab
4. Run `npm run init-db` as a startup command

### Environment Variables for Production

```env
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

## Troubleshooting

### "Mail server error" on startup
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Ensure you're using an App Password for Gmail
- Check 2FA is enabled on your Google account

### "Failed to send email" error
- Check Gmail App Password is correct
- Verify less secure apps is not blocking (use App Passwords)
- Check server logs for detailed errors

### CORS errors
- Set `FRONTEND_URL` to your frontend domain
- For development, `*` origin is allowed

### Database errors
- Run `npm run init-db` to initialize the database
- Check file permissions for `portfolio.db`

## Development

### Project Structure

```
contact-backend/
├── server.js        # Main Express server
├── init-db.js       # Database initialization script
├── package.json     # Dependencies and scripts
├── .env             # Environment variables (not in git)
├── .env.example     # Environment template
├── .gitignore       # Git ignore rules
├── portfolio.db     # SQLite database (created on init)
└── README.md        # This file
```

### Adding New Endpoints

1. Define the route in `server.js`
2. Add input validation and sanitization
3. Implement database operations
4. Add error handling
5. Update this README

## License

ISC
