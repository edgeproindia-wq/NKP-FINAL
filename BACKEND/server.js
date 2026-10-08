require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 5000;

/* =====================================================
   OPENAI
===================================================== */

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());
app.use(express.json());

/* =====================================================
   MYSQL CONNECTION
===================================================== */

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* =====================================================
   HOME
===================================================== */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "NKP Backend is running successfully!"
    });

});

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/api/health", async (req, res) => {

    try {

        const connection = await db.getConnection();

        await connection.ping();

        connection.release();

        res.json({
            success: true,
            message: "NKP Backend and MySQL are connected successfully!"
        });

    } catch (error) {

        console.error(
            "Database Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "MySQL connection failed.",

            error: error.message

        });

    }

});

/* =====================================================
   REGISTER
===================================================== */

app.post("/api/register", async (req, res) => {

    try {

        const {
            fullName,
            businessName,
            email,
            phone,
            password
        } = req.body;

        if (!fullName || !email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }

        const cleanName =
            String(fullName).trim();

        const cleanEmail =
            String(email).trim().toLowerCase();

        const cleanPhone =
            phone
                ? String(phone).trim()
                : null;

        /* CHECK EXISTING EMAIL */

        const [existingUsers] =
            await db.execute(

                "SELECT id FROM users WHERE email = ?",

                [cleanEmail]

            );

        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }

        /* HASH PASSWORD */

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        /* INSERT USER */

        const [result] =
            await db.execute(

                `INSERT INTO users
                (name, email, phone, password)
                VALUES (?, ?, ?, ?)`,

                [
                    cleanName,
                    cleanEmail,
                    cleanPhone,
                    hashedPassword
                ]

            );

        res.status(201).json({

            success: true,

            message:
                "Registration successful!",

            user: {

                id:
                    result.insertId,

                name:
                    cleanName,

                email:
                    cleanEmail,

                phone:
                    cleanPhone

            }

        });

    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Registration failed. Please try again."

        });

    }

});

/* =====================================================
   LOGIN
===================================================== */

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter your email and password."

            });

        }

        const cleanEmail =
            String(email).trim().toLowerCase();

        /* FIND USER */

        const [users] =
            await db.execute(

                `SELECT
                    id,
                    name,
                    email,
                    phone,
                    password
                 FROM users
                 WHERE email = ?`,

                [cleanEmail]

            );

        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        const user =
            users[0];

        /* CHECK PASSWORD */

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        /* LOGIN SUCCESS */

        res.json({

            success: true,

            message:
                "Login successful!",

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Login failed. Please try again."

        });

    }

});

/* =====================================================
   🤖 NKP AI CHAT
===================================================== */

app.post("/api/ai-chat", async (req, res) => {

    try {

        console.log("=================================");
        console.log("🤖 NKP AI REQUEST RECEIVED");
        console.log("=================================");

        const {
            message,
            business,
            scores
        } = req.body;

        /* =================================================
           VALIDATE MESSAGE
        ================================================= */

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a message."

            });

        }

        /* =================================================
           CHECK API KEY
        ================================================= */

        if (!process.env.OPENAI_API_KEY) {

            console.error(
                "❌ OPENAI_API_KEY is missing."
            );

            return res.status(500).json({

                success: false,

                message:
                    "OpenAI API key is not configured on the server."

            });

        }

        console.log("✅ OpenAI API key found");

        /* =================================================
           BUSINESS DATA
        ================================================= */

        const businessData =
            business || {};

        const scoreData =
            scores || {};

        /* =================================================
           BUSINESS CONTEXT
        ================================================= */

        const businessContext = `

You are NKP AI Assistant for Namma KanakkuPillai.

Your job is to help small and medium business owners
understand their business assessment and improve their
business using practical and realistic advice.

BUSINESS INFORMATION

Business Name:
${businessData.businessName || "Not provided"}

Business Type:
${businessData.businessType || "Not provided"}

Industry:
${businessData.industry || "Not provided"}

Years in Business:
${businessData.yearsInBusiness || "Not provided"}

Number of Employees:
${businessData.employees || "Not provided"}

Location:
${businessData.location || "Not provided"}

Average Monthly Revenue:
${businessData.revenue || "Not provided"}

Average Monthly Expenses:
${businessData.expenses || "Not provided"}

Business Description:
${businessData.description || "Not provided"}


BUSINESS HEALTH SCORES

Financial Health:
${scoreData.financial ?? 0}%

Operations:
${scoreData.operations ?? 0}%

Customer & Market:
${scoreData.customer ?? 0}%

People & Team:
${scoreData.people ?? 0}%

Growth & Strategy:
${scoreData.growth ?? 0}%

Overall Assessment:
${scoreData.overall ?? 0}%


IMPORTANT INSTRUCTIONS

1. Answer based on the available business information.

2. Give practical business advice.

3. Do not invent financial data.

4. If information is missing, clearly say it is not available.

5. Keep answers understandable for normal business owners.

6. Avoid unnecessary technical language.

7. When discussing scores, explain what the score means.

8. If asked what to improve first, prioritize the weakest area.

9. Give actionable steps whenever possible.

10. You are an AI business assistant, not a financial,
legal, tax, or medical professional.

11. Do not claim that you performed real-world actions.

12. Keep answers concise but useful.

13. Use headings and bullet points when helpful.

`;

        /* =================================================
           OPENAI REQUEST
        ================================================= */

        console.log("🔄 Sending request to OpenAI...");

        const response =
            await openai.responses.create({

                model: "gpt-5.5",

                instructions:
                    businessContext,

                input:
                    message.trim()

            });

        /* =================================================
           GET AI ANSWER
        ================================================= */

        const answer =
            response.output_text;

        if (!answer) {

            console.error(
                "❌ OpenAI returned no output."
            );

            return res.status(500).json({

                success: false,

                message:
                    "NKP AI did not return a response."

            });

        }

        console.log("✅ NKP AI response received");

        /* =================================================
           SEND RESPONSE
        ================================================= */

        return res.json({

            success: true,

            message:
                answer

        });

    } catch (error) {

        /* =================================================
           IMPORTANT DEBUGGING
        ================================================= */

        console.error(
            "================================="
        );

        console.error(
            "❌ NKP AI ERROR"
        );

        console.error(
            "================================="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.status || "Unknown"
        );

        console.error(
            "Code:",
            error.code || "Unknown"
        );

        console.error(
            "Type:",
            error.type || "Unknown"
        );

        console.error(
            "Full Error:",
            error
        );

        console.error(
            "================================="
        );

        /* =================================================
           SEND ACTUAL ERROR TO FRONTEND
        ================================================= */

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to connect to NKP AI right now."

        });

    }

});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 NKP BACKEND SERVER");
    console.log("========================================");
    console.log(
        `🌐 Server: http://localhost:${PORT}`
    );
    console.log(
        "🤖 AI Endpoint: /api/ai-chat"
    );
    console.log(
        "🗄️ MySQL Endpoint: /api/health"
    );
    console.log("========================================");
    console.log("");

});