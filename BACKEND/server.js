require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const OpenAI = require("openai");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());

/* =========================================================
   MYSQL DATABASE - AIVEN
========================================================= */

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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

        const [rows] = await db.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "NKP Backend and MySQL are connected successfully!"
        });

    } catch (error) {

        console.error("Database health error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });

    }

});

/* =========================================================
   REGISTER
========================================================= */

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }

        /* Check existing user */

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

        /* Hash password */

        const hashedPassword =
            await bcrypt.hash(password, 10);

        /* Insert user */

        const [result] = await db.query(
            `INSERT INTO users
            (name, email, phone, password)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                phone || null,
                hashedPassword
            ]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful!",
            userId: result.insertId
        });

    } catch (error) {

        console.error("Register error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message
        });

    }

});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }

        /* Find user */

        const [users] = await db.query(
            `SELECT
                id,
                name,
                email,
                phone,
                password
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

        /* Compare password */

        const passwordMatch =
            await bcrypt.compare(
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

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message
        });

    }

});

/* =========================================================
   AI CHAT
========================================================= */

app.post("/api/ai-chat", async (req, res) => {

    try {

        const {
            message,
            business,
            scores
        } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Message is required."
            });

        }

        /*
         * OpenAI key இல்லையென்றால்
         * backend crash ஆகாமல் response கொடுக்கும்.
         */

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

        const response =
            await openai.responses.create({

                model: "gpt-5.5",

                instructions: businessContext,

                input: message.trim()

            });

        const answer =
            response.output_text ||
            "Sorry, I could not generate a response.";

        res.json({
            success: true,
            message: answer
        });

    } catch (error) {

        console.error("AI error:", error);

        res.status(500).json({
            success: false,
            message: "AI service is currently unavailable.",
            error: error.message
        });

    }

});

/* =========================================================
   SERVER START
========================================================= */

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 NKP BACKEND SERVER");
    console.log("========================================");
    console.log(`🌐 Server running on port ${PORT}`);
    console.log("🤖 AI Endpoint: /api/ai-chat");
    console.log("🗄️ MySQL Endpoint: /api/health");
    console.log("========================================");
    console.log("");

});