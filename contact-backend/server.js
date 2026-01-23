import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   Middleware
======================= */
app.use(cors({
  origin: "*", // change to your frontend URL in production
}));
app.use(express.json());

/* =======================
   Test Route
======================= */
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running" });
});

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

/* Verify email config on startup */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error);
  } else {
    console.log("✅ Mail server ready");
  }
});

/* =======================
   Send Email Route
======================= */
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("📩 Incoming request:", req.body);

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || "New Contact Message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    console.log("✅ Email sent successfully");

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Email send failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

/* =======================
   Start Server
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
