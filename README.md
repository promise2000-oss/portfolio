# Promise Shedrack Portfolio

A professional full-stack portfolio website featuring a React/Vite frontend with a Node.js/Express backend API.

## Project Overview

This is a personal portfolio website for **Promise Shedrack**, a Front-End Web Designer & Social Media Manager based in Nigeria. The project consists of two main components:

- **Frontend** (`promise-portfolio/`) - A modern React application built with Vite, TypeScript, and Tailwind CSS
- **Backend** (`contact-backend/`) - A Node.js/Express API for handling contact forms, testimonials, newsletter subscriptions, and project inquiries

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Email**: Nodemailer
- **Features**: Rate limiting, input sanitization, CORS

## Project Structure

```
.
├── README.md                      # This file
│
├── promise-portfolio/             # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── About.tsx        # About section
│   │   │   ├── Contact.tsx       # Contact form
│   │   │   ├── Footer.tsx        # Footer component
│   │   │   ├── Hero.tsx          # Hero section
│   │   │   ├── Navigation.tsx    # Navigation header
│   │   │   ├── Skills.tsx        # Skills section
│   │   │   ├── Testimonials.tsx # Testimonials section
│   │   │   └── ...
│   │   ├── hooks/                # Custom React hooks
│   │   ├── integrations/         # External integrations (Supabase)
│   │   ├── lib/                  # Utility functions
│   │   ├── pages/                # Page components
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── contact-backend/              # Backend API
    ├── server.js                 # Express server
    ├── init-db.js                # Database initialization
    ├── package.json
    ├── portfolio.db              # SQLite database
    ├── .env.example              # Environment template
    └── README.md                 # Backend-specific README
```

## Features

### Frontend Features
- 🎨 **Hero Section** - Animated introduction with call-to-action buttons
- 👤 **About Section** - Personal introduction and services overview
- 💼 **Skills Section** - Technical skills with visual representation
- ⭐ **Testimonials** - Client reviews with ratings (fetched from backend)
- 📬 **Contact Form** - Functional contact form connected to backend
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🌙 **Modern UI** - Clean, professional design with smooth animations

### Backend Features
- ✉️ **Contact Form API** - Email sending via Nodemailer with auto-reply
- ⭐ **Testimonials API** - Customer reviews with ratings (1-5 stars)
- 📧 **Newsletter API** - Subscribe/unsubscribe functionality
- 💼 **Project Inquiries API** - Detailed project request submissions
- 📊 **Analytics API** - Basic page view tracking
- 🔒 **Security** - Rate limiting, input sanitization, CORS protection
- 💾 **SQLite Database** - Lightweight, file-based storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun (for frontend)
- npm (for backend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd contact-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   npm run init-db
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` with your credentials:
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

6. Start the backend server:
   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd promise-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

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

### Newsletter
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe from newsletter |

### Project Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit a project inquiry |

### Contact Form
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-email` | Send contact form email |

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

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd promise-portfolio
   npm run build
   ```

2. Deploy the `dist` folder to Vercel or Netlify

### Backend (Render/Railway)

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run init-db`
4. Set start command: `npm start`
5. Add environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL`

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Contact

- **Email**: promiseshedrack02@gmail.com
- **Phone**: 09126441023
- **Location**: Nigeria
- **Twitter**: https://x.com/Promiseshed02
- **LinkedIn**: https://www.linkedin.com/in/promise-chuks-5b22342b2
- **GitHub**: https://github.com/promiseshedrack02

## License

ISC

---

Built by Promise Shedrack
