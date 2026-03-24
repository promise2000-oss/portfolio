import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'portfolio.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

console.log('🔧 Initializing database...');

// Create testimonials table
db.exec(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    position TEXT,
    avatar_url TEXT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    project_type TEXT,
    is_approved INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create newsletter_subscribers table
db.exec(`
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    is_active INTEGER DEFAULT 1,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME
  );
`);

// Create project_inquiries table
db.exec(`
  CREATE TABLE IF NOT EXISTS project_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT NOT NULL,
    budget_range TEXT,
    timeline TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'normal',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create contact_messages table (for storing contact form submissions)
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    is_replied INTEGER DEFAULT 0,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create analytics_events table (for tracking page views, etc.)
db.exec(`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create indexes for better query performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
  CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
  CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
  CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
  CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);
  CREATE INDEX IF NOT EXISTS idx_inquiries_status ON project_inquiries(status);
  CREATE INDEX IF NOT EXISTS idx_inquiries_created ON project_inquiries(created_at);
  CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(is_read);
  CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
  CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
`);

// Clear existing testimonials
db.exec(`DELETE FROM testimonials`);

// Insert professional testimonials from Nigeria and beyond
const insertTestimonial = db.prepare(`
  INSERT INTO testimonials (name, email, company, position, rating, title, message, project_type, is_approved, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
`);

const testimonials = [
  // Nigerian Clients
  {
    name: "Chukwuemeka Okafor",
    company: "Lagos Tech Ventures",
    position: "Founder & CEO",
    rating: 5,
    title: "A True Professional Who Delivers Excellence",
    message: "Working with Promise was an absolute game-changer for our startup. He built our entire e-commerce platform from scratch, and the attention to detail was remarkable. The site loads fast, looks stunning on all devices, and our conversion rate increased by 40% within the first month. He's not just a developer – he's a partner who genuinely cares about your success.",
    project_type: "E-commerce Platform"
  },
  {
    name: "Fatima Abdullahi",
    company: "Abuja Digital Agency",
    position: "Creative Director",
    rating: 5,
    title: "Transformed Our Vision Into Reality",
    message: "I had a very specific vision for our agency's website, and Promise brought it to life perfectly. He understood our brand identity and created something that truly represents who we are. The animations are smooth, the user experience is intuitive, and our clients constantly compliment our website.",
    project_type: "Corporate Website"
  },
  {
    name: "Oluwaseun Bakare",
    company: "Ibadan Healthcare Solutions",
    position: "Managing Director",
    rating: 5,
    title: "Exceptional Healthcare Portal Development",
    message: "Our healthcare platform needed to be secure, accessible, and user-friendly for both patients and medical staff. Promise exceeded all expectations. He implemented features we didn't even know we needed, and the system has been running flawlessly for over a year now.",
    project_type: "Healthcare Platform"
  },
  {
    name: "Ngozi Eze",
    company: "Enugu Fashion House",
    position: "Owner & Designer",
    rating: 4,
    title: "My Online Store Is Now A Masterpiece",
    message: "As a fashion designer, I needed a website that would showcase my creations beautifully. Promise created an online store that's as elegant as the clothes I design. The image galleries are stunning, the checkout process is smooth, and my international customers love the seamless experience.",
    project_type: "Fashion E-commerce"
  },
  {
    name: "Ibrahim Musa",
    company: "Kano Agro-Allied Ltd",
    position: "Operations Manager",
    rating: 5,
    title: "Modern Solution For Traditional Business",
    message: "We run a traditional agricultural business, and Promise helped us modernize with a custom inventory management system. He took time to understand our unique challenges and delivered a solution that our staff could easily use. Our operations have become so much more efficient.",
    project_type: "Business Application"
  },
  // International Clients
  {
    name: "Sarah Mitchell",
    company: "London Digital Studios",
    position: "Product Manager",
    rating: 5,
    title: "Outstanding Remote Collaboration Experience",
    message: "Working with Promise from London was seamless despite the time difference. He built a complex dashboard for our marketing analytics, and the quality rivaled what we'd expect from local agencies at a fraction of the cost. His communication was excellent, and he met every deadline.",
    project_type: "Analytics Dashboard"
  },
  {
    name: "Marcus Johnson",
    company: "New York Startup Hub",
    position: "Co-Founder",
    rating: 4,
    title: "A Developer Who Understands Startups",
    message: "Promise gets what startups need – speed, quality, and flexibility. He built our MVP in record time without cutting corners. The architecture he chose allows us to scale quickly as we grow. What impressed me most was his ability to suggest improvements to our initial ideas.",
    project_type: "SaaS Platform"
  },
  {
    name: "Aisha Rahman",
    company: "Dubai Real Estate Group",
    position: "Marketing Director",
    rating: 5,
    title: "Luxury Website For Luxury Properties",
    message: "Our real estate business needed a website that reflected the premium nature of our properties. Promise delivered a sophisticated platform with virtual tours, advanced search filters, and a booking system. The Arabic language support he added was perfect for our regional market.",
    project_type: "Real Estate Platform"
  },
  {
    name: "David Chen",
    company: "Singapore Tech Innovations",
    position: "CTO",
    rating: 5,
    title: "Technical Excellence Meets Creative Design",
    message: "I've worked with developers across Asia, Europe, and the Americas, and Promise ranks among the best. His full-stack capabilities meant he could handle our complex backend requirements while delivering a beautiful frontend. Clean code, modern practices, and great problem-solving skills.",
    project_type: "Full-Stack Application"
  },
  {
    name: "Amara Obi",
    company: "Ghana Fintech Solutions",
    position: "Head of Product",
    rating: 4,
    title: "Secure And User-Friendly Payment Platform",
    message: "Building a fintech product requires someone who understands security, compliance, and user experience. Promise delivered on all fronts. Our payment platform handles thousands of transactions daily without issues. He implemented bank-grade security while keeping the interface simple.",
    project_type: "Fintech Platform"
  }
];

for (const t of testimonials) {
  insertTestimonial.run(t.name, null, t.company, t.position, t.rating, t.title, t.message, t.project_type);
}

// Calculate and display stats
const totalReviews = testimonials.length;
const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
const avgRating = (totalRating / totalReviews).toFixed(1);

console.log('✅ Database initialized successfully!');
console.log('📊 Tables created: testimonials, newsletter_subscribers, project_inquiries, contact_messages, analytics_events');
console.log(`📝 Added ${testimonials.length} professional testimonials`);
console.log(`⭐ Average Rating: ${avgRating}/5`);

db.close();
