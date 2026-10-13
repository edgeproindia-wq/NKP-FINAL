
/* =========================================================
   NKP AI INSIGHTS
   Chat + AI Report + PDF Print + Navigation
========================================================= */

"use strict";

const API_BASE_URL = "https://nkp-final.onrender.com";

/* -------------------- ELEMENTS -------------------- */

const chatForm = document.getElementById("chatForm");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const sendButtonText = document.getElementById("sendButtonText");
const typingIndicator = document.getElementById("typingIndicator");

const newChatButton = document.getElementById("newChatButton");
const reportButton = document.getElementById("reportButton");
const backButton = document.getElementById("backButton");
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

/* -------------------- BUSINESS DATA -------------------- */

function readStoredJSON(key, fallback = {}) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn(`Could not read ${key}:`, error);
        return fallback;
    }
}

function getBusinessContext() {
    const business =
        readStoredJSON("nkpBusiness", null) ||
        readStoredJSON("businessData", null) ||
        {};

    const categoryScores = readStoredJSON("nkpCategoryScores", {});
    const overallScore = localStorage.getItem("nkpOverallScore");

    const answers = readStoredJSON("assessmentAnswers", []);

    return {
        business: business,
        overallScore: overallScore,
        categoryScores: categoryScores,
        assessmentAnswers: answers
    };
}

function getBusinessName() {
    const context = getBusinessContext();

    return (
        context.business.businessName ||
        localStorage.getItem("businessName") ||
        "Your Business"
    );
}

/* -------------------- SAFE HTML -------------------- */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

/*
 Convert basic Markdown to safe HTML.
 HTML is escaped before formatting.
*/

function formatAIText(text) {
    let safe = escapeHTML(text);

    safe = safe.replace(
        /^### (.+)$/gm,
        "<h3>$1</h3>"
    );

    safe = safe.replace(
        /^## (.+)$/gm,
        "<h2>$1</h2>"
    );

    safe = safe.replace(
        /^# (.+)$/gm,
        "<h2>$1</h2>"
    );

    safe = safe.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    safe = safe.replace(
        /^\s*[-*] (.+)$/gm,
        "<li>$1</li>"
    );

    safe = safe.replace(
        /(<li>.*<\/li>\n?)+/g,
        function (list) {
            return "<ul>" + list + "</ul>";
        }
    );

    safe = safe.replace(/\n/g, "<br>");

    return safe;
}

/* -------------------- CHAT MESSAGES -------------------- */

function addMessage(text, sender = "ai") {
    if (!chatMessages) return;

    const message = document.createElement("div");

    message.className =
        sender === "user"
            ? "message user-message"
            : "message ai-message";

    const label = document.createElement("div");
    label.className = "message-label";
    label.textContent = sender === "user" ? "You" : "NKP AI";

    const content = document.createElement("div");
    content.className = "message-content";
    content.innerHTML = formatAIText(text);

    message.appendChild(label);
    message.appendChild(content);

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* -------------------- AI REQUEST -------------------- */

async function requestAI(question, reportMode = false) {
    const context = getBusinessContext();

    const prompt = reportMode
        ? `
Create a detailed professional Business Health Assessment Report
for Namma KanakkuPillai (NKP).

Business context:
${JSON.stringify(context, null, 2)}

Include:
1. Executive summary.
2. Business profile.
3. Assessment findings and interpretation.
4. Strengths supported by available evidence.
5. Improvement areas supported by available evidence.
6. Why each major issue matters.
7. Practical recommendations with numbered steps.
8. Priority levels and suggested timelines.
9. A 7-day and 30-day action plan.
10. Suggested performance indicators.
11. Conclusion and limitations.

Do not invent revenue, expenses, customer data, scores, answers,
achievements, or business problems.
If assessment answers or financial information are missing,
clearly disclose that limitation.
Use professional headings and readable bullet points.
`
        : `
You are NKP AI, a professional business advisor.

Business context:
${JSON.stringify(context, null, 2)}

Business owner's question:
${question}

Give a useful, personalized response.
Explain the issue, why it matters, and practical steps to address it.
Use available assessment data as evidence when relevant.
Mention priority, a suggested timeline, and how to measure progress.
Do not invent missing business information or guarantee outcomes.
Keep the response clear and focused on the user's question.
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
        const response = await fetch(`${API_BASE_URL}/api/ai-chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt
            }),
            signal: controller.signal
        });

        const raw = await response.text();

        let data;

        try {
            data = JSON.parse(raw);
        } catch {
            throw new Error(
                `Backend returned an invalid response (HTTP ${response.status}).`
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `AI request failed (HTTP ${response.status}).`
            );
        }

        const answer =
            data.reply ||
            data.response ||
            data.answer ||
            data.message ||
            data.data?.reply ||
            data.data?.response;

        if (typeof answer !== "string" || !answer.trim()) {
            throw new Error(
                "AI response was empty or used an unsupported response format."
            );
        }

        return answer.trim();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("AI request timed out. Please try again.");
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

/* -------------------- SEND CHAT MESSAGE -------------------- */

let isSending = false;

async function sendMessage(questionOverride) {
    if (isSending) return;

    const question = (
        typeof questionOverride === "string"
            ? questionOverride
            : chatInput?.value || ""
    ).trim();

    if (!question) return;

    isSending = true;

    addMessage(question, "user");

    if (chatInput) {
        chatInput.value = "";
        chatInput.style.height = "auto";
    }

    if (sendButton) sendButton.disabled = true;
    if (sendButtonText) sendButtonText.textContent = "Thinking...";

    if (typingIndicator) {
        typingIndicator.style.display = "block";
        typingIndicator.textContent = "NKP AI is analyzing your question...";
    }

    try {
        const answer = await requestAI(question);
        addMessage(answer, "ai");
    } catch (error) {
        console.error("NKP AI chat error:", error);

        addMessage(
            "I couldn't get an AI response.\n\n" +
            "Reason: " + error.message +
            "\n\nPlease check the backend service and try again.",
            "ai"
        );
    } finally {
        isSending = false;

        if (sendButton) sendButton.disabled = false;
        if (sendButtonText) sendButtonText.textContent = "Send";

        if (typingIndicator) {
            typingIndicator.style.display = "none";
            typingIndicator.textContent = "";
        }

        if (chatInput) chatInput.focus();
    }
}

/* -------------------- CHAT FORM -------------------- */

if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendMessage();
    });
} else if (sendButton) {
    // Fallback if the page does not use a chat form.
    sendButton.addEventListener("click", function (event) {
        event.preventDefault();
        sendMessage();
    });
}

if (chatInput) {
    chatInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (chatForm) {
                if (typeof chatForm.requestSubmit === "function") {
                    chatForm.requestSubmit();
                } else {
                    sendMessage();
                }
            } else {
                sendMessage();
            }
        }
    });

    chatInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 140) + "px";
    });
}

/* -------------------- QUICK PROMPTS -------------------- */

document.querySelectorAll("[data-question]").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const question = button.getAttribute("data-question");

        if (question) {
            sendMessage(question);
        }
    });
});

/* -------------------- NEW CONVERSATION -------------------- */

if (newChatButton) {
    newChatButton.addEventListener("click", function () {
        if (!chatMessages) return;

        chatMessages.replaceChildren();

        addMessage(
            "New conversation started. What would you like to understand about your business?",
            "ai"
        );

        if (chatInput) chatInput.focus();
    });
}

/* -------------------- AI REPORT + PRINT TO PDF -------------------- */

let isGeneratingReport = false;

async function generatePDFReport() {
    if (isGeneratingReport) return;

    isGeneratingReport = true;

    const originalText = reportButton
        ? reportButton.textContent
        : "";

    if (reportButton) {
        reportButton.disabled = true;
        reportButton.textContent = "Generating report...";
    }

    /*
      Open the window during the click event to reduce popup-blocking.
    */

    let reportWindow = null;

    try {
        reportWindow = window.open("about:blank", "_blank");

        if (reportWindow) {
            reportWindow.document.open();
            reportWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Generating NKP Report</title>
                </head>
                <body style="font-family:Arial;padding:40px">
                    <h2>NKP AI is preparing your business report...</h2>
                    <p>Please wait while your report is generated.</p>
                </body>
                </html>
            `);
            reportWindow.document.close();
        }

        const reportText = await requestAI(
            "Prepare my complete business health assessment report.",
            true
        );

        if (!reportWindow || reportWindow.closed) {
            throw new Error(
                "Report window was blocked. Allow pop-ups and click Generate AI Report again."
            );
        }

        const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NKP AI Business Health Report</title>
<style>
@page { size: A4; margin: 18mm; }

* { box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    color: #1f2937;
    max-width: 850px;
    margin: 35px auto;
    padding: 0 20px;
    line-height: 1.75;
}

header {
    border-bottom: 4px solid #15803d;
    padding-bottom: 18px;
    margin-bottom: 28px;
}

.brand {
    color: #15803d;
    font-weight: bold;
    letter-spacing: 2px;
}

h1, h2, h3 { color: #14532d; }

.report {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

button {
    background: #15803d;
    color: white;
    border: 0;
    padding: 12px 20px;
    border-radius: 7px;
    cursor: pointer;
    font-weight: bold;
}

@media print {
    body { margin: 0; padding: 0; }
    button { display: none; }
}
</style>
</head>
<body>
<header>
    <div class="brand">NKP | NAMMA KANAKKUPILLAI</div>
    <h1>AI Business Health Assessment Report</h1>
    <p>Business: <span id="businessName"></span></p>
    <p>Generated: <span id="reportDate"></span></p>
</header>

<main>
    <div class="report" id="reportContent"></div>
</main>

<p><button type="button" id="printButton">Print / Save as PDF</button></p>

<script>
document.getElementById("businessName").textContent =
    ${JSON.stringify(getBusinessName())};

document.getElementById("reportDate").textContent =
    ${JSON.stringify(new Date().toLocaleDateString("en-IN"))};

document.getElementById("reportContent").textContent =
    ${JSON.stringify(reportText)};

document.getElementById("printButton").addEventListener("click", function () {
    window.print();
});
<\/script>
</body>
</html>`;

        reportWindow.document.open();
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    } catch (error) {
        console.error("NKP report error:", error);

        if (reportWindow && !reportWindow.closed) {
            reportWindow.close();
        }

        alert(
            "AI report could not be generated.\n\n" +
            error.message +
            "\n\nPlease check your backend and try again."
        );
    } finally {
        isGeneratingReport = false;

        if (reportButton) {
            reportButton.disabled = false;
            reportButton.textContent = originalText || "Generate AI Report";
        }
    }
}

if (reportButton) {
    reportButton.addEventListener("click", function (event) {
        event.preventDefault();
        generatePDFReport();
    });
}

/* -------------------- SIDEBAR MENU -------------------- */

if (menuButton && sidebar) {
    menuButton.addEventListener("click", function () {
        const isClosed = sidebar.classList.toggle("sidebar-closed");

        menuButton.setAttribute("aria-expanded", String(!isClosed));
    });
}

/* -------------------- BACK TO DASHBOARD -------------------- */

if (backButton) {
    backButton.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}

console.log("NKP AI Insights initialized successfully.");
