import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
 
dotenv.config();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Initialize SQLite database
const db = new Database(join(__dirname, "portfolio.db"));
db.pragma("journal_mode = WAL");
 
/* =======================
   Rate Limiting (Simple in-memory)
======================= */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // 10 requests per window
 
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
 
  const userRequests = rateLimitMap.get(ip) || [];
  const validRequests = userRequests.filter((time) => now - time < RATE_LIMIT_WINDOW);
 
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }
 
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  next();
}
 
// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of rateLimitMap.entries()) {
    const validRequests = requests.filter((time) => now - time < RATE_LIMIT_WINDOW);
    if (validRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validRequests);
    }
  }
}, 60 * 1000);
 
/* =======================
   Input Sanitization
======================= */
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/"/g, "\\u0022")
    .replace(/'/g, "\\u0027")
    .trim();
}
 
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
 
/* =======================
   Middleware
======================= */
 
// Support comma-separated origins in FRONTEND_URL env var
// e.g. FRONTEND_URL=http://localhost:5173,http://localhost:8080
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"];
 
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`⚠️ CORS blocked request from: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
 
/* =======================
   Nodemailer Transporter
======================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
 
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error.message);
  } else {
    console.log("✅ Mail server ready");
  }
});
 
/* =======================
   Test Route
======================= */
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running" });
});
 
/* =======================
   Health Check Route
======================= */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
 
/* =======================
   TESTIMONIALS API
======================= */
 
// Get all approved testimonials
app.get("/api/testimonials", (req, res) => {
  try {
    const { featured, limit = 20, offset = 0 } = req.query;
    
    let query = "SELECT * FROM testimonials WHERE is_approved = 1";
    const params = [];
 
    if (featured === "true") {
      query += " AND is_featured = 1";
    }
 
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
 
    const testimonials = db.prepare(query).all(...params);
    
    // Get total count
    const countQuery = "SELECT COUNT(*) as total FROM testimonials WHERE is_approved = 1";
    const { total } = db.prepare(countQuery).get();
 
    res.json({
      success: true,
      data: testimonials,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + testimonials.length < total,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching testimonials:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
});
 
// Get testimonial statistics
app.get("/api/testimonials/stats", (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM testimonials WHERE is_approved = 1
    `).get();
 
    res.json({
      success: true,
      data: {
        totalReviews: stats.total_reviews,
        averageRating: parseFloat(stats.average_rating?.toFixed(1) || 0),
        ratingDistribution: {
          5: stats.five_star || 0,
          4: stats.four_star || 0,
          3: stats.three_star || 0,
          2: stats.two_star || 0,
          1: stats.one_star || 0,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching testimonial stats:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial statistics",
    });
  }
});
 
// Submit a new testimonial
app.post("/api/testimonials", rateLimiter, async (req, res) => {
  const { name, email, company, position, rating, title, message, project_type } = req.body;
 
  // Validate required fields
  if (!name || !rating || !title || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, rating, title, and message are required",
    });
  }
 
  // Validate rating
  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }
 
  // Validate email if provided
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
 
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name).substring(0, 100);
  const sanitizedEmail = email ? sanitizeInput(email) : null;
  const sanitizedCompany = company ? sanitizeInput(company).substring(0, 100) : null;
  const sanitizedPosition = position ? sanitizeInput(position).substring(0, 100) : null;
  const sanitizedTitle = sanitizeInput(title).substring(0, 200);
  const sanitizedMessage = sanitizeInput(message).substring(0, 2000);
  const sanitizedProjectType = project_type ? sanitizeInput(project_type).substring(0, 100) : null;
 
  try {
    const result = db.prepare(`
      INSERT INTO testimonials (name, email, company, position, rating, title, message, project_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sanitizedName, sanitizedEmail, sanitizedCompany, sanitizedPosition, ratingNum, sanitizedTitle, sanitizedMessage, sanitizedProjectType);
 
    // Send notification email
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: `"Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Testimonial Submitted",
        text: `
A new testimonial has been submitted:
 
Name: ${sanitizedName}
Company: ${sanitizedCompany || "N/A"}
Rating: ${ratingNum}/5
Title: ${sanitizedTitle}
Message: ${sanitizedMessage}
 
Review and approve in your admin panel.
        `,
      });
    }
 
    res.status(201).json({
      success: true,
      message: "Thank you for your testimonial! It will be reviewed and published soon.",
      data: { id: result.lastInsertRowid },
    });
  } catch (error) {
    console.error("❌ Error submitting testimonial:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit testimonial. Please try again later.",
    });
  }
});
 
/* =======================
   NEWSLETTER API
======================= */
 
// Subscribe to newsletter
app.post("/api/newsletter/subscribe", rateLimiter, async (req, res) => {
  const { email, name } = req.body;
 
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
 
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
 
  const sanitizedEmail = sanitizeInput(email).toLowerCase();
  const sanitizedName = name ? sanitizeInput(name).substring(0, 100) : null;
 
  try {
    // Check if already subscribed
    const existing = db.prepare("SELECT * FROM newsletter_subscribers WHERE email = ?").get(sanitizedEmail);
 
    if (existing) {
      if (existing.is_active) {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed",
        });
      } else {
        // Reactivate subscription
        db.prepare("UPDATE newsletter_subscribers SET is_active = 1, name = ?, unsubscribed_at = NULL WHERE email = ?")
          .run(sanitizedName, sanitizedEmail);
      }
    } else {
      // New subscription
      db.prepare("INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)")
        .run(sanitizedEmail, sanitizedName);
    }
 
    // Send welcome email
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: `"Promise Portfolio" <${process.env.EMAIL_USER}>`,
        to: sanitizedEmail,
        subject: "Welcome to My Newsletter!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to My Newsletter!</h2>
            <p>Hi ${sanitizedName || "there"},</p>
            <p>Thank you for subscribing to my newsletter! You'll receive updates about:</p>
            <ul>
              <li>New projects and case studies</li>
              <li>Tech tips and tutorials</li>
              <li>Industry insights</li>
              <li>Exclusive offers</li>
            </ul>
            <p>Stay tuned for exciting content!</p>
            <p>Best regards,<br>Promise Shedrack</p>
          </div>
        `,
      });
    }
 
    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
    });
  } catch (error) {
    console.error("❌ Error subscribing to newsletter:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again later.",
    });
  }
});
 
// Unsubscribe from newsletter
app.post("/api/newsletter/unsubscribe", (req, res) => {
  const { email } = req.body;
 
  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }
 
  try {
    const result = db.prepare(`
      UPDATE newsletter_subscribers 
      SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP 
      WHERE email = ?
    `).run(email.toLowerCase());
 
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our subscription list",
      });
    }
 
    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("❌ Error unsubscribing:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe. Please try again later.",
    });
  }
});
 
/* =======================
   PROJECT INQUIRIES API
======================= */
 
// Submit a project inquiry
app.post("/api/inquiries", rateLimiter, async (req, res) => {
  const { name, email, phone, company, project_type, budget_range, timeline, description } = req.body;
 
  // Validate required fields
  if (!name || !email || !project_type || !description) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, project_type, and description are required",
    });
  }
 
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
 
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name).substring(0, 100);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPhone = phone ? sanitizeInput(phone).substring(0, 20) : null;
  const sanitizedCompany = company ? sanitizeInput(company).substring(0, 100) : null;
  const sanitizedProjectType = sanitizeInput(project_type).substring(0, 100);
  const sanitizedBudgetRange = budget_range ? sanitizeInput(budget_range).substring(0, 50) : null;
  const sanitizedTimeline = timeline ? sanitizeInput(timeline).substring(0, 50) : null;
  const sanitizedDescription = sanitizeInput(description).substring(0, 5000);
 
  try {
    const result = db.prepare(`
      INSERT INTO project_inquiries (name, email, phone, company, project_type, budget_range, timeline, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sanitizedName, sanitizedEmail, sanitizedPhone, sanitizedCompany, sanitizedProjectType, sanitizedBudgetRange, sanitizedTimeline, sanitizedDescription);
 
    // Send notification email to admin
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: `"Portfolio Inquiries" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Project Inquiry: ${sanitizedProjectType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Project Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedEmail}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedPhone || "N/A"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedCompany || "N/A"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Project Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedProjectType}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedBudgetRange || "Not specified"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Timeline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizedTimeline || "Not specified"}</td></tr>
            </table>
            <h3 style="margin-top: 20px;">Project Description:</h3>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${sanitizedDescription}</p>
          </div>
        `,
      });
 
      // Send auto-reply to client
      await transporter.sendMail({
        from: `"Promise Shedrack" <${process.env.EMAIL_USER}>`,
        to: sanitizedEmail,
        subject: "Thank you for your inquiry - I'll be in touch soon!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank You for Reaching Out!</h2>
            <p>Hi ${sanitizedName},</p>
            <p>Thank you for your interest in working with me! I've received your project inquiry and will review it shortly.</p>
            <p>Here's a summary of your submission:</p>
            <ul>
              <li><strong>Project Type:</strong> ${sanitizedProjectType}</li>
              <li><strong>Budget Range:</strong> ${sanitizedBudgetRange || "Not specified"}</li>
              <li><strong>Timeline:</strong> ${sanitizedTimeline || "Not specified"}</li>
            </ul>
            <p>I typically respond within 24-48 hours. If your project is urgent, feel free to reach out directly at ${process.env.EMAIL_USER}.</p>
            <p>Best regards,<br>Promise Shedrack<br>Full-Stack Developer</p>
          </div>
        `,
      });
    }
 
    res.status(201).json({
      success: true,
      message: "Thank you for your inquiry! I'll get back to you within 24-48 hours.",
      data: { id: result.lastInsertRowid },
    });
  } catch (error) {
    console.error("❌ Error submitting inquiry:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry. Please try again later.",
    });
  }
});
 
/* =======================
   CONTACT FORM (Enhanced)
======================= */
app.post("/send-email", rateLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
 
  console.log("📩 Incoming contact request from:", req.ip);
 
  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, and message are required",
    });
  }
 
  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
 
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name).substring(0, 100);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedSubject = sanitizeInput(subject || "New Contact Message").substring(0, 200);
  const sanitizedMessage = sanitizeInput(message).substring(0, 5000);
 
  try {
    // Store in database first (this always succeeds)
    const result = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).run(sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage, req.ip);
 
    console.log("✅ Message saved to database:", result.lastInsertRowid);
 
    // Try to send email notification (optional - won't fail the request)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: sanitizedEmail,
          subject: sanitizedSubject,
          text: `
Name: ${sanitizedName}
Email: ${sanitizedEmail}
 
Message:
${sanitizedMessage}
          `,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
              <p><strong>Subject:</strong> ${sanitizedSubject}</p>
              <hr style="border: 1px solid #eee;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
          `,
        });
 
        // Send auto-reply
        await transporter.sendMail({
          from: `"Promise Shedrack" <${process.env.EMAIL_USER}>`,
          to: sanitizedEmail,
          subject: "Thank you for contacting me!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Message Received!</h2>
              <p>Hi ${sanitizedName},</p>
              <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
              <p>Here's a copy of your message:</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Subject:</strong> ${sanitizedSubject}</p>
                <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
              </div>
              <p>I typically respond within 24 hours. Looking forward to connecting with you!</p>
              <p>Best regards,<br>Promise Shedrack</p>
            </div>
          `,
        });
 
        console.log("✅ Email sent successfully from:", sanitizedEmail);
      } catch (emailError) {
        console.error("⚠️ Email sending failed (message still saved):", emailError.message);
      }
    } else {
      console.log("⚠️ Email not configured - message saved to database only");
    }
 
    res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Failed to save message:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again or contact directly via email.",
    });
  }
});
 
/* =======================
   ANALYTICS API
======================= */
 
// Track page view
app.post("/api/analytics/track", (req, res) => {
  const { event_type, page_url, referrer, metadata } = req.body;
 
  const sanitizedEventType = sanitizeInput(event_type || "page_view").substring(0, 50);
  const sanitizedPageUrl = page_url ? sanitizeInput(page_url).substring(0, 500) : null;
  const sanitizedReferrer = referrer ? sanitizeInput(referrer).substring(0, 500) : null;
  const sanitizedMetadata = metadata ? JSON.stringify(metadata) : null;
 
  try {
    db.prepare(`
      INSERT INTO analytics_events (event_type, page_url, referrer, ip_address, user_agent, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sanitizedEventType, sanitizedPageUrl, sanitizedReferrer, req.ip, req.get("user-agent"), sanitizedMetadata);
 
    res.json({ success: true });
  } catch (error) {
    // Silently fail for analytics
    res.json({ success: true });
  }
});
 
// Get analytics summary (for admin)
app.get("/api/analytics/summary", (req, res) => {
  try {
    const pageViews = db.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'").get();
    const uniqueVisitors = db.prepare("SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events").get();
    const topPages = db.prepare(`
      SELECT page_url, COUNT(*) as views 
      FROM analytics_events 
      WHERE event_type = 'page_view' AND page_url IS NOT NULL
      GROUP BY page_url 
      ORDER BY views DESC 
      LIMIT 10
    `).all();
 
    res.json({
      success: true,
      data: {
        totalPageViews: pageViews.count,
        uniqueVisitors: uniqueVisitors.count,
        topPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
});
 
/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
 
/* =======================
   Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
 
/* =======================
   Graceful Shutdown
======================= */
process.on("SIGINT", () => {
  console.log("\n🔄 Shutting down gracefully...");
  db.close();
  process.exit(0);
});
 
/* =======================
   Start Server
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/testimonials - Get all testimonials`);
  console.log(`   POST /api/testimonials - Submit a testimonial`);
  console.log(`   GET  /api/testimonials/stats - Get testimonial statistics`);
  console.log(`   POST /api/newsletter/subscribe - Subscribe to newsletter`);
  console.log(`   POST /api/inquiries - Submit project inquiry`);
  console.log(`   POST /send-email - Send contact form`);
});
 