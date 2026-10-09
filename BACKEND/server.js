
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const OpenAI = require("openai");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json({ limit: "20kb" }));

/* =========================================================
   MYSQL DATABASE - AIVEN
========================================================= */

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* =========================================================
   RESEND EMAIL SERVICE
========================================================= */

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const EMAIL_FROM = process.env.EMAIL_FROM || "";

/* =========================================================
   OPENAI
========================================================= */

let openai = null;

if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

/* =========================================================
   PASSWORD RESET CONFIGURATION
========================================================= */

// In-memory storage: suitable for local testing.
// For production with multiple server instances, use a
// persistent store such as a database or Redis.

const resetCodes = new Map();

const RESET_CODE_TTL = 5 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function hashResetCode(email, code) {
    return crypto
        .createHash("sha256")
        .update(`${email}:${code}`)
        .digest("hex");
}

function emailResetEnabled(req, res, next) {
    if (!resend || !EMAIL_FROM) {
        return res.status(503).json({
            success: false,
            message: "Password reset email service is not configured."
        });
    }

    next();
}

/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NKP Backend Server is running!"
    });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "NKP Backend and MySQL are connected successfully!"
        });
    } catch (error) {
        console.error("Database health error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

/* =========================================================
   REGISTER
========================================================= */

app.post("/api/register", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = normalizeEmail(req.body.email);
        const phone = String(req.body.phone || "").trim();
        const password = String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO users (name, email, phone, password)
             VALUES (?, ?, ?, ?)`,
            [name, email, phone || null, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful!",
            userId: result.insertId
        });
    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const [users] = await db.query(
            `SELECT id, name, email, phone, password
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});

/* =========================================================
   FORGOT PASSWORD - SEND OTP BY EMAIL
========================================================= */

app.post(
    "/api/forgot-password",
    emailResetEnabled,
    async (req, res) => {
        try {
            const email = normalizeEmail(req.body.email);

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required."
                });
            }

            const [users] = await db.query(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );

            // Do not reveal whether an account exists.
            if (users.length === 0) {
                return res.json({
                    success: true,
                    message:
                        "If the account exists, a reset email will be sent."
                });
            }

            const code = crypto
                .randomInt(100000, 1000000)
                .toString();

            const { data, error } = await resend.emails.send({
                from: EMAIL_FROM,
                to: [email],
                subject: "NKP Password Reset Code",
                text:
                    `Your NKP password reset code is ${code}.\n\n` +
                    "This code expires in 5 minutes. " +
                    "If you did not request this, ignore this email.",
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:12px;">
                        <h2 style="color:#087f5b;">NKP Password Reset</h2>
                        <p>Use this code to reset your NKP account password:</p>
                        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px;background:#f1f8f5;text-align:center;border-radius:8px;">
                            ${code}
                        </div>
                        <p>This code expires in 5 minutes.</p>
                        <p>If you did not request a password reset, ignore this email.</p>
                        <p style="color:#666;">Namma KanakkuPillai</p>
                    </div>
                `
            });

            if (error) {
                console.error("Resend email error:", error);
                return res.status(502).json({
                    success: false,
                    message: "Email could not be sent. Please try again."
                });
            }

            // Store the code only after the email API accepts it.
            resetCodes.set(email, {
                codeHash: hashResetCode(email, code),
                expiresAt: Date.now() + RESET_CODE_TTL,
                attempts: 0,
                verified: false
            });

            console.log("NKP reset email accepted by Resend:", data?.id);

            return res.json({
                success: true,
                message:
                    "If the account exists, a reset email will be sent."
            });
        } catch (error) {
            console.error("Forgot password error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to process the reset request."
            });
        }
    }
);

/* =========================================================
   VERIFY RESET OTP
========================================================= */

app.post("/api/verify-reset-otp", (req, res) => {
    const email = normalizeEmail(req.body.email);
    const code = String(
        req.body.otp || req.body.code || ""
    ).trim();

    const record = resetCodes.get(email);

    if (!record || Date.now() > record.expiresAt) {
        resetCodes.delete(email);

        return res.status(400).json({
            success: false,
            message: "Code is invalid or expired. Request a new one."
        });
    }

    if (record.attempts >= MAX_RESET_ATTEMPTS) {
        resetCodes.delete(email);

        return res.status(429).json({
            success: false,
            message: "Too many attempts. Request a new code."
        });
    }

    record.attempts += 1;

    const suppliedHash = hashResetCode(email, code);

    if (
        !/^\d{6}$/.test(code) ||
        suppliedHash !== record.codeHash
    ) {
        if (record.attempts >= MAX_RESET_ATTEMPTS) {
            resetCodes.delete(email);
        }

        return res.status(400).json({
            success: false,
            message: "Incorrect code."
        });
    }

    record.verified = true;

    return res.json({
        success: true,
        message: "Code verified. You can reset your password."
    });
});

/* =========================================================
   RESET PASSWORD
========================================================= */

app.post("/api/reset-password", async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const code = String(
            req.body.otp || req.body.code || ""
        ).trim();
        const password = String(
            req.body.password || req.body.newPassword || ""
        );

        const record = resetCodes.get(email);

        if (!record || Date.now() > record.expiresAt) {
            resetCodes.delete(email);

            return res.status(400).json({
                success: false,
                message: "Code is invalid or expired. Request a new one."
            });
        }

        if (record.attempts >= MAX_RESET_ATTEMPTS) {
            resetCodes.delete(email);

            return res.status(429).json({
                success: false,
                message: "Too many attempts. Request a new code."
            });
        }

        if (!/^\d{6}$/.test(code)) {
            record.attempts += 1;

            return res.status(400).json({
                success: false,
                message: "Code is invalid."
            });
        }

        const suppliedHash = hashResetCode(email, code);

        if (suppliedHash !== record.codeHash) {
            record.attempts += 1;

            if (record.attempts >= MAX_RESET_ATTEMPTS) {
                resetCodes.delete(email);
            }

            return res.status(400).json({
                success: false,
                message: "Code is invalid."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const [users] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            resetCodes.delete(email);

            return res.status(400).json({
                success: false,
                message: "Unable to reset password."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email]
        );

        resetCodes.delete(email);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to reset password."
            });
        }

        return res.json({
            success: true,
            message: "Password reset successfully. Please log in."
        });
    } catch (error) {
        console.error("Password reset error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password."
        });
    }
});

/* =========================================================
   AI CHAT
========================================================= */

app.post("/api/ai-chat", async (req, res) => {
    try {
        const { message, business, scores } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        if (!openai) {
            return res.json({
                success: true,
                message:
                    "NKP AI service is currently using the local Business Advisor. Please continue with your business question."
            });
        }

        const businessContext = `
You are NKP AI Business Advisor.

Your job is to help business owners improve their business.

Business information:
${JSON.stringify(business || {}, null, 2)}

Assessment information:
${JSON.stringify(scores || {}, null, 2)}

Important rules:
- Answer the user's question directly.
- Do not automatically show scores.
- Do not automatically show an assessment summary.
- Do not mention scores unless the user asks for them or they are directly necessary.
- Give practical and simple business advice.
- Use the business information when relevant.
- Be professional and friendly.
- Keep the answer easy to understand.
`;

        const response = await openai.responses.create({
            model: "gpt-5.5",
            instructions: businessContext,
            input: message.trim()
        });

        res.json({
            success: true,
            message:
                response.output_text ||
                "Sorry, I could not generate a response."
        });
    } catch (error) {
        console.error("AI error:", error.message);

        res.status(500).json({
            success: false,
            message: "AI service is currently unavailable."
        });
    }
});

/* =========================================================
   SERVER START
========================================================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("");
    console.log("========================================");
    console.log("       NKP BACKEND SERVER");
    console.log("========================================");
    console.log(`Server running on port ${PORT}`);
    console.log("Home: /");
    console.log("MySQL: /api/health");
    console.log("Register: /api/register");
    console.log("Login: /api/login");
    console.log("AI: /api/ai-chat");
    console.log(
        "Forgot Password Email:",
        resend && EMAIL_FROM ? "CONFIGURED" : "NOT CONFIGURED"
    );
    console.log("========================================");
    console.log("");
});

process.on("SIGINT", async () => {
    console.log("\nStopping NKP backend...");

    server.close(async () => {
        await db.end();
        process.exit(0);
    });
});