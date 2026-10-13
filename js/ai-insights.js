
/* =========================================================
   NKP | NAMMA KANAKKUPILLAI
   Business Advisor + PDF Report Generator
========================================================= */

"use strict";

/* ===================== ELEMENTS ===================== */

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const typingIndicator = document.getElementById("typingIndicator");
const newChatButton = document.getElementById("newChatButton");
const reportButton = document.getElementById("reportButton");
const backButton = document.getElementById("backButton");
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

/* ===================== LOAD SAVED DATA ===================== */

function readStorage(key, fallback = {}) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
        return fallback;
    }
}

let business =
    readStorage("nkpBusiness", {});

let categoryScores =
    readStorage("nkpCategoryScores", {});

let overallScore =
    localStorage.getItem("nkpOverallScore");

if (overallScore !== null && overallScore.trim() !== "") {
    overallScore = Number(overallScore);
} else {
    overallScore = null;
}

/* Support business setup data saved under other NKP keys. */
if (!Object.keys(business).length) {
    business = readStorage("businessData", {});
}

if (!business.businessName) {
    business.businessName =
        localStorage.getItem("businessName") || "";
}

/* ===================== CATEGORY NAMES ===================== */

const categoryNames = {
    operational: "Operational Efficiency",
    financial: "Financial Growth",
    customer: "Market Position & Competitiveness",
    people: "Compliance & Risk Management",
    growth: "Business Sustainability & Growth"
};

const categoryAliases = {
    "operational efficiency": "Operational Efficiency",
    "operations": "Operational Efficiency",
    "financial growth": "Financial Growth",
    "financial health": "Financial Growth",
    "market position & competitiveness":
        "Market Position & Competitiveness",
    "market position": "Market Position & Competitiveness",
    "customer & market": "Market Position & Competitiveness",
    "compliance & risk management": "Compliance & Risk Management",
    "compliance & risk": "Compliance & Risk Management",
    "business sustainability & growth":
        "Business Sustainability & Growth",
    "business growth": "Business Sustainability & Growth"
};

/* ===================== HELPERS ===================== */

function getBusinessName() {
    return business.businessName ||
        business.name ||
        "Your Business";
}

function getScore(category) {
    const value = categoryScores[category];

    if (value === undefined || value === null || value === "") {
        return null;
    }

    const score = Number(value);
    return Number.isFinite(score) ? score : null;
}

function getScoreEntries() {
    return Object.entries(categoryScores)
        .map(([key, value]) => {
            const score = Number(value);
            const label =
                categoryAliases[String(key).toLowerCase()] ||
                key;

            return {
                key,
                label,
                score
            };
        })
        .filter(item =>
            Number.isFinite(item.score) &&
            item.score >= 0 &&
            item.score <= 100
        );
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatAIText(text) {
    let safe = escapeHTML(text);

    safe = safe.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    return safe.replace(/\n/g, "<br>");
}

function getScoreStatus(score) {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Developing";
    if (score >= 40) return "Needs Improvement";
    return "Priority for Improvement";
}

/* ===================== SCORE RESPONSE ===================== */

function scoreExplanation() {
    const entries = getScoreEntries();

    if (!entries.length && overallScore === null) {
        return "Your assessment scores are not available in the saved NKP data yet. Complete your assessment first so that I can explain your results accurately.";
    }

    let response =
        "NKP BUSINESS HEALTH ASSESSMENT — SCORE SUMMARY\n\n";

    if (overallScore !== null && Number.isFinite(overallScore)) {
        response +=
            `Saved assessment score: ${overallScore}%\n\n`;
    }

    if (entries.length) {
        response += "CATEGORY-WISE PERFORMANCE\n\n";

        entries.forEach(item => {
            response +=
                `${item.label}: ${item.score}% — ${getScoreStatus(item.score)}\n`;
        });
    } else {
        response +=
            "Category-wise scores are not available in the saved data.";
    }

    response +=
        "\nI can also prepare a written business improvement report using the information available in NKP.";

    return response;
}

/* ===================== BUSINESS SUMMARY ===================== */

function businessSummary() {
    const details = [
        ["Business Name", getBusinessName()],
        ["Business Type", business.businessType || business.business_type],
        ["Industry", business.industry],
        ["Location", business.location],
        ["Employees", business.employees],
        ["Years in Business", business.yearsInBusiness]
    ].filter(([, value]) =>
        value !== undefined && value !== null && value !== ""
    );

    if (!details.length || getBusinessName() === "Your Business") {
        return "I could not find complete business setup details in the saved NKP data. Please check Business Setup and save your business information first.";
    }

    return "BUSINESS PROFILE\n\n" +
        details.map(([label, value]) =>
            `${label}: ${value}`
        ).join("\n") +
        "\n\nI can use these saved details to help prepare a business improvement report.";
}

/* ===================== BUSINESS ADVISOR ===================== */

function businessDiagnosis() {
    const entries = getScoreEntries();

    if (!entries.length) {
        return "To provide a business-specific diagnosis, I need your saved assessment scores. Please complete the NKP assessment first. Until then, I can provide general business guidance, but I will not assume that a particular problem exists in your business.";
    }

    const sorted = [...entries].sort((a, b) => a.score - b.score);
    const priority = sorted[0];
    const strongest = sorted[sorted.length - 1];

    return `BUSINESS HEALTH ANALYSIS\n\nBased on the category scores currently saved in NKP, ${priority.label} is the first area to review, with a recorded score of ${priority.score}%. This result indicates that the area may deserve closer attention under the assessment's scoring framework. It does not, by itself, prove that a specific business problem exists. Review the related questions and identify which practices need improvement before deciding on corrective action.\n\nYour highest recorded category is ${strongest.label}, at ${strongest.score}%. Review the practices contributing to this result and consider whether they can be maintained consistently across the business.\n\nRecommended next step: review the answers in the priority category, select one specific issue supported by those answers, assign responsibility for addressing it, and review progress weekly.`;
}

function priorityAdvisor() {
    const entries = getScoreEntries();

    if (!entries.length) {
        return "Your saved assessment scores are not available yet, so I cannot reliably rank your business priorities. Complete the assessment and save the results first. In the meantime, review cash management, customer retention, operating processes and business risks without assuming any one area is currently failing.";
    }

    const priority = [...entries].sort((a, b) => a.score - b.score)[0];

    return `PRIORITY AREA: ${priority.label}\n\nThe saved assessment gives this category a score of ${priority.score}%, making it the lowest-scoring category among the available results. Treat this as a signal for further investigation rather than proof of a particular failure. Review the questions in this category and identify the lowest-rated practices.\n\nRecommended action: select one evidence-based improvement, decide how success will be measured, assign an owner and review progress after seven days. Once this issue is understood, move to the next priority.`;
}

function financialAdvisor() {
    return "FINANCIAL MANAGEMENT ADVISORY\n\nConsistent financial records help a business understand whether its sales are translating into sustainable profit and available cash. Maintain a weekly record of money received, operating expenses, amounts payable and customer payments still outstanding. Compare actual expenses with the budget and investigate significant differences before making major spending decisions.\n\nWhere practical, keep business transactions separate from personal spending and review the profitability of important products or services. Prepare a short cash-flow forecast covering upcoming payments and expected receipts. Any spending reduction should be based on actual records so that essential operating costs are not cut unnecessarily.\n\nSuggested action plan: organise the latest financial records first, prepare a weekly cash-flow summary, identify one verified cost or collection issue, and review the results at the end of the month. These are general recommendations, not findings about your business unless supported by your assessment or financial data.";
}

function salesAdvisor() {
    return "SALES AND REVENUE ADVISORY\n\nA sustainable sales process starts with understanding which products or services customers choose, why they choose them and whether they return. Review available sales records by product, customer group and period. Where the data permits, compare repeat purchases, enquiries that did not convert and customer feedback to identify a specific opportunity.\n\nImprove follow-up for genuine enquiries, communicate the value of your offer clearly and ask existing customers for feedback. Test one change at a time, such as a clearer product description or a follow-up process, and compare the result with the previous period. Avoid assuming that discounts or expansion will automatically increase profit.\n\nSuggested action plan: establish a current sales baseline, choose one measurable sales improvement, monitor the result weekly and retain the change only if the evidence supports it.";
}

function operationsAdvisor() {
    return "OPERATIONAL EFFICIENCY ADVISORY\n\nReliable operations depend on clear processes, responsibilities and regular checks. Map one important daily workflow from beginning to end and note where delays, repeated work, avoidable errors or unclear handovers occur. Use actual examples to identify the cause instead of changing several processes at once.\n\nDocument the improved procedure in a simple checklist, make responsibilities clear and monitor a practical measure such as completion time, error frequency or delayed orders. Introduce automation only when the process is sufficiently understood and the expected benefit justifies its cost.\n\nSuggested action plan: select one recurring workflow this week, record its current performance, test one improvement and review the outcome with the people who perform the work.";
}

function customerAdvisor() {
    return "CUSTOMER AND MARKET ADVISORY\n\nLong-term customer relationships are strengthened when a business understands customer needs, delivers consistently and responds constructively to feedback. Review available customer comments, complaints, repeat-purchase records and reasons for lost sales. Separate recurring patterns from isolated incidents before choosing an improvement.\n\nSet a clear process for responding to enquiries and resolving complaints. Ask customers what matters most to them and use the feedback to improve service, product quality or communication. Review competitors to understand differences in value, service and convenience without copying every competitor action.\n\nSuggested action plan: collect feedback from a suitable sample of customers, identify one recurring theme, make a focused service improvement and review customer responses after implementation.";
}

function peopleAdvisor() {
    return "PEOPLE AND TEAM ADVISORY\n\nClear responsibilities and reliable communication help a team perform consistently. Review whether each important task has an identified owner, an understandable expected outcome and an appropriate way to report progress. Discuss recurring delays or errors with the people involved before concluding that training or performance is the cause.\n\nWhere a genuine skill gap is identified, provide focused training and practical guidance. Establish regular check-ins, recognise improvements and make sure workloads and responsibilities are realistic. Keep employee information confidential and limit performance reviews to appropriate business purposes.\n\nSuggested action plan: select one workflow with unclear ownership, document responsibilities, agree on a measurable expectation and review progress with the team after one week.";
}

function growthAdvisor() {
    return "SUSTAINABLE GROWTH ADVISORY\n\nGrowth decisions should reflect customer demand, operational capacity, available cash and the risks associated with expansion. Before entering a new market or adding a major expense, estimate the required investment, expected ongoing costs, likely demand and the consequences if results are below expectations.\n\nTest new opportunities on a manageable scale where possible. Establish measurable targets, review the results and expand only when there is evidence that the model can be repeated reliably. Protect the quality of existing operations while preparing processes and responsibilities for additional demand.\n\nSuggested action plan: choose one realistic growth opportunity, document the assumptions behind it, calculate the resources required and run a limited test before committing to a larger investment.";
}

function riskAdvisor() {
    return "BUSINESS RISK ADVISORY\n\nA useful risk review identifies events that could interrupt operations, reduce cash availability, affect customer relationships or create compliance problems. Depending on the nature of the business, areas to examine may include dependence on a small number of customers or suppliers, incomplete records, access to business data, equipment disruption and unclear backup procedures. These are possible risk areas to review, not confirmed problems in your business.\n\nFor each relevant risk, record what could happen, the potential impact, the steps already in place and the person responsible for monitoring it. Prioritise risks using evidence and the likely severity of their consequences. Seek qualified professional advice for legal, tax, regulatory or specialised security matters where needed.\n\nSuggested action plan: document the three most relevant risks, identify one practical preventive measure for each and review the plan regularly.";
}

function actionPlan() {
    return "NKP BUSINESS IMPROVEMENT ACTION PLAN\n\nImmediate — Establish the current situation. Review the available business records and assessment answers, then choose one problem that is supported by evidence. Write down its effect on the business and define a measurable outcome.\n\nNext 7 days — Implement a focused improvement. Assign responsibility, agree on the steps required and record a baseline so that the change can be evaluated. Avoid changing multiple unrelated processes simultaneously.\n\nNext 30 days — Review the results. Compare the new measurements with the baseline, identify what worked and document any unexpected effects. Continue, adjust or stop the change according to the evidence.\n\nOngoing — Repeat the process for the next priority. This approach helps the business improve in manageable stages instead of relying on broad goals without measurable follow-through.";
}

function improvementAdvisor() {
    return businessDiagnosis();
}

/* ===================== GENERATE CHAT RESPONSE ===================== */

function generateResponse(message) {
    const q = message.toLowerCase().trim();

    if (
        q.includes("business details") ||
        q.includes("business information") ||
        q.includes("my business details") ||
        q.includes("what do you know about my business")
    ) {
        return businessSummary();
    }

    if (
        q.includes("score") ||
        q.includes("percentage") ||
        q.includes("rating") ||
        q.includes("assessment result") ||
        q.includes("assessment score")
    ) {
        return scoreExplanation();
    }

    if (
        q.includes("priority") ||
        q.includes("what should i focus") ||
        q.includes("where should i focus") ||
        q.includes("what should i improve first")
    ) {
        return priorityAdvisor();
    }

    if (
        q.includes("cash flow") ||
        q.includes("financial") ||
        q.includes("finance") ||
        q.includes("expense") ||
        q.includes("profit")
    ) {
        return financialAdvisor();
    }

    if (
        q.includes("sales") ||
        q.includes("sell more") ||
        q.includes("increase sales") ||
        q.includes("revenue")
    ) {
        return salesAdvisor();
    }

    if (
        q.includes("operation") ||
        q.includes("process") ||
        q.includes("productivity") ||
        q.includes("efficiency")
    ) {
        return operationsAdvisor();
    }

    if (
        q.includes("customer") ||
        q.includes("retention") ||
        q.includes("marketing") ||
        q.includes("competition")
    ) {
        return customerAdvisor();
    }

    if (
        q.includes("employee") ||
        q.includes("employees") ||
        q.includes("team") ||
        q.includes("staff") ||
        q.includes("leadership")
    ) {
        return peopleAdvisor();
    }

    if (
        q.includes("growth") ||
        q.includes("expand") ||
        q.includes("expansion") ||
        q.includes("scale")
    ) {
        return growthAdvisor();
    }

    if (
        q.includes("risk") ||
        q.includes("problem") ||
        q.includes("danger") ||
        q.includes("threat")
    ) {
        return riskAdvisor();
    }

    if (
        q.includes("action plan") ||
        q.includes("plan for my business") ||
        q.includes("business plan") ||
        q.includes("steps")
    ) {
        return actionPlan();
    }

    if (
        q.includes("improve") ||
        q.includes("improvement") ||
        q.includes("better") ||
        q.includes("business health") ||
        q.includes("analyse my business") ||
        q.includes("analyze my business") ||
        q.includes("diagnose") ||
        q.includes("suggestion") ||
        q.includes("recommendation")
    ) {
        return improvementAdvisor();
    }

    if (
        q === "hi" ||
        q === "hello" ||
        q === "hey" ||
        q.includes("good morning") ||
        q.includes("good evening")
    ) {
        return "Hello! I'm NKP Business Advisor. I can help you review business priorities, financial management, operations, customers, risks and growth planning. Ask me about an area you want to improve, or use the report button to prepare a written business report.";
    }

    return "I can help you prepare a practical business improvement plan. You can ask about financial management, sales, operational efficiency, customer retention, team management, business risks, growth planning or your saved assessment scores. For recommendations tailored to your business, complete the NKP assessment and ensure the results are saved.";
}

/* ===================== CHAT DISPLAY ===================== */

function addMessage(text, type) {
    if (!chatMessages) return;

    const row = document.createElement("div");
    row.className = `message-row ${type}`;

    if (type === "user") {
        const bubble = document.createElement("div");
        bubble.className = "message user-message";
        bubble.textContent = text;
        row.appendChild(bubble);
    } else {
        const bubble = document.createElement("div");
        bubble.className = "message ai-message";

        const avatar = document.createElement("div");
        avatar.className = "ai-avatar";
        avatar.textContent = "NKP";

        const content = document.createElement("div");
        content.className = "ai-content";
        content.innerHTML = formatAIText(text);

        bubble.append(avatar, content);
        row.appendChild(bubble);
    }

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ===================== SEND MESSAGE ===================== */

function sendMessage() {
    if (!chatInput || !sendButton) return;

    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");

    chatInput.value = "";
    chatInput.style.height = "auto";
    sendButton.disabled = true;

    if (typingIndicator) {
        typingIndicator.style.display = "block";
    }

    window.setTimeout(() => {
        try {
            addMessage(generateResponse(message), "ai");
        } catch (error) {
            console.error("NKP Advisor error:", error);
            addMessage(
                "Sorry, I could not prepare a response. Please try again.",
                "ai"
            );
        } finally {
            if (typingIndicator) {
                typingIndicator.style.display = "none";
            }
            sendButton.disabled = false;
            chatInput.focus();
        }
    }, 300);
}

if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

if (chatInput) {
    chatInput.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height =
            Math.min(this.scrollHeight, 140) + "px";
    });
}

/* ===================== NEW CHAT ===================== */

if (newChatButton) {
    newChatButton.addEventListener("click", () => {
        if (chatMessages) chatMessages.innerHTML = "";
        if (chatInput) {
            chatInput.value = "";
            chatInput.style.height = "auto";
            chatInput.focus();
        }
    });
}

/* ===================== SUGGESTED QUESTIONS ===================== */

document.querySelectorAll(".sidebar-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!chatInput) return;

        const question = button.getAttribute("data-question");
        if (!question) return;

        chatInput.value = question;
        sendMessage();

        if (window.innerWidth <= 800 && sidebar) {
            sidebar.classList.remove("active");
        }
    });
});

/* ===================== MOBILE MENU ===================== */

if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}

/* ===================== REPORT CONTENT ===================== */

function buildReportHTML() {
    const name = getBusinessName();
    const scores = getScoreEntries();
    const date = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const profileFields = [
        ["Business Type", business.businessType || business.business_type],
        ["Industry", business.industry],
        ["Location", business.location],
        ["Employees", business.employees]
    ].filter(([, value]) =>
        value !== undefined && value !== null && value !== ""
    );

    let summary;

    if (scores.length) {
        const sorted = [...scores].sort((a, b) => a.score - b.score);
        const weakest = sorted[0];
        const strongest = sorted[sorted.length - 1];

        summary =
            `The saved NKP assessment data identifies ${weakest.label} as the lowest-scoring available category at ${weakest.score}%. This area should be reviewed first by examining the underlying answers and identifying specific practices that need attention. The highest-scoring available category is ${strongest.label} at ${strongest.score}%. These scores are assessment indicators and should be interpreted alongside the actual business context.`;
    } else {
        summary =
            "NKP could not find saved category assessment scores when this report was prepared. Therefore, this report provides general business guidance rather than a score-based diagnosis. Complete the assessment and save the results to support a more tailored analysis.";
    }

    const scoreSection = scores.length
        ? scores.map(item => `
            <tr>
                <td>${escapeHTML(item.label)}</td>
                <td>${item.score}%</td>
                <td>${escapeHTML(getScoreStatus(item.score))}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="3">Saved category scores are not available.</td></tr>`;

    const profileSection = profileFields.length
        ? profileFields.map(([label, value]) => `
            <tr>
                <td>${escapeHTML(label)}</td>
                <td>${escapeHTML(value)}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="2">Additional business details are not available.</td></tr>`;

    const priorityParagraph = scores.length
        ? `Begin by reviewing the assessment answers in ${escapeHTML(
            [...scores].sort((a, b) => a.score - b.score)[0].label
        )}. Identify the lowest-rated practices, confirm whether they reflect actual business conditions, and select one measurable improvement.`
        : "Review your current business records and assessment answers before deciding which area needs attention. Select one verified issue and define a measurable improvement.";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NKP Business Health Report</title>
<style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body {
        font-family: Arial, Helvetica, sans-serif;
        color: #172033;
        line-height: 1.65;
        margin: 0;
        font-size: 11pt;
    }
    .cover {
        border-bottom: 4px solid #16a34a;
        padding: 10px 0 22px;
        margin-bottom: 24px;
    }
    .brand {
        color: #15803d;
        font-size: 14pt;
        font-weight: 800;
        letter-spacing: 1px;
    }
    h1 { font-size: 25pt; margin: 20px 0 8px; }
    h2 {
        font-size: 15pt;
        margin-top: 26px;
        color: #166534;
        border-bottom: 1px solid #dce7df;
        padding-bottom: 6px;
    }
    h3 { font-size: 12pt; margin-bottom: 4px; }
    p { margin: 8px 0 14px; }
    .muted { color: #64748b; font-size: 9pt; }
    .notice {
        padding: 12px;
        background: #f0fdf4;
        border-left: 4px solid #16a34a;
        margin: 16px 0;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0 20px;
        font-size: 10pt;
    }
    th, td {
        text-align: left;
        border: 1px solid #dbe4e8;
        padding: 9px;
        vertical-align: top;
    }
    th { background: #f0fdf4; }
    .footer {
        border-top: 1px solid #dbe4e8;
        margin-top: 32px;
        padding-top: 10px;
        color: #64748b;
        font-size: 9pt;
    }
    .actions { margin-top: 20px; }
    .print-btn {
        border: 0;
        border-radius: 8px;
        padding: 12px 18px;
        background: #15803d;
        color: white;
        cursor: pointer;
        font-size: 11pt;
    }
    @media print {
        .actions { display: none; }
        h2, h3 { break-after: avoid; }
        tr { break-inside: avoid; }
    }
</style>
</head>
<body>
    <header class="cover">
        <div class="brand">NKP | NAMMA KANAKKUPILLAI</div>
        <h1>Business Health Assessment Report</h1>
        <p><strong>Business:</strong> ${escapeHTML(name)}</p>
        <p><strong>Report Date:</strong> ${escapeHTML(date)}</p>
        <p class="muted">Business analysis and improvement guidance</p>
    </header>

    <h2>1. Executive Summary</h2>
    <p>${summary}</p>

    <h2>2. Business Profile</h2>
    <table>
        <thead><tr><th>Information</th><th>Details</th></tr></thead>
        <tbody>${profileSection}</tbody>
    </table>

    <h2>3. Assessment Results</h2>
    <p>The following results are based only on the category scores saved in NKP at the time this report was generated.</p>
    <table>
        <thead>
            <tr><th>Category</th><th>Score</th><th>Assessment Indicator</th></tr>
        </thead>
        <tbody>${scoreSection}</tbody>
    </table>

    <h2>4. Business Risk Review</h2>
    <p>Depending on the business, areas worth reviewing may include cash-flow visibility, customer or supplier dependency, operational delays, record keeping, data protection and continuity planning. The information available to this report does not confirm that these risks are present. Review relevant records and operating practices before assigning a risk level or deciding on corrective action.</p>

    <h2>5. Recommendations and Improvement Opportunities</h2>
    <p>Establish a consistent review routine for the business's most important operating and financial information. Maintain accurate records of income, expenses, outstanding payments and recurring costs. Review customer feedback and operational delays to identify repeated patterns. Document important processes and assign clear responsibilities. Select improvements according to the evidence available, the resources required and the likely effect on business performance.</p>
    <p>${priorityParagraph}</p>

    <h2>6. 30-Day Action Plan</h2>
    <h3>Immediate: Understand the current position</h3>
    <p>Review saved assessment answers and relevant business records. Choose one clearly identified issue, record its current condition and define a measurable target.</p>

    <h3>Days 1–7: Start one improvement</h3>
    <p>Assign responsibility, agree on the steps to be taken and record progress. Keep the action practical and proportionate to the size and resources of the business.</p>

    <h3>Days 8–30: Measure and review</h3>
    <p>Compare results with the starting position, document what changed and decide whether to continue or adjust the approach. Use the findings to choose the next improvement priority.</p>

    <h2>7. Conclusion</h2>
    <p>Business improvement is most effective when recommendations are linked to evidence, measurable objectives and regular review. Use this report as a starting point for planning and validate each recommendation against your actual business circumstances.</p>

    <div class="notice">
        <strong>Important note:</strong> This report is generated from the information available in the NKP browser storage. It is not a substitute for professional accounting, legal, tax or financial advice. Missing data may limit the analysis.
    </div>

    <div class="actions">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        <p class="muted">Choose “Save as PDF” in the print destination to save a PDF copy.</p>
    </div>

    <footer class="footer">
        NKP | Namma KanakkuPillai — Business Intelligence, Assessment and Growth
    </footer>
</body>
</html>`;
}

/* ===================== DOWNLOAD PDF REPORT ===================== */

function generatePDFReport() {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
        alert(
            "The report window was blocked. Allow pop-ups for this local NKP website and try again."
        );
        return;
    }

    reportWindow.document.open();
    reportWindow.document.write(buildReportHTML());
    reportWindow.document.close();
    reportWindow.focus();

    reportWindow.onload = () => {
        reportWindow.print();
    };
}

if (reportButton) {
    reportButton.addEventListener("click", event => {
        event.preventDefault();
        generatePDFReport();
    });
}

/* ===================== BACK TO DASHBOARD ===================== */

if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}
