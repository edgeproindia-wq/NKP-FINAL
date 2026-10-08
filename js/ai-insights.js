/* =========================================================
   NKP AI ADVISOR
   Local Rule-Based Business Assistant
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const chatMessages = document.getElementById("chatMessages");

const chatInput = document.getElementById("chatInput");

const sendButton = document.getElementById("sendButton");

const typingIndicator = document.getElementById("typingIndicator");

const newChatButton = document.getElementById("newChatButton");

const reportButton = document.getElementById("reportButton");

const backButton = document.getElementById("backButton");

const menuButton = document.getElementById("menuButton");

const sidebar = document.getElementById("sidebar");


/* =========================================================
   LOAD BUSINESS DATA
========================================================= */

let business = {};

let categoryScores = {};

let overallScore = null;


try {

    business =
        JSON.parse(
            localStorage.getItem("nkpBusiness")
        ) || {};

} catch (error) {

    business = {};

}


try {

    categoryScores =
        JSON.parse(
            localStorage.getItem("nkpCategoryScores")
        ) || {};

} catch (error) {

    categoryScores = {};

}


const savedOverall =
    localStorage.getItem("nkpOverallScore");

if (savedOverall !== null) {

    overallScore =
        Number(savedOverall);

}


/* =========================================================
   CATEGORY NAMES
========================================================= */

const categoryNames = {

    financial:
        "Financial Health",

    operations:
        "Operations",

    customer:
        "Customer & Market",

    people:
        "People & Team",

    growth:
        "Business Growth"

};


/* =========================================================
   GET SCORE
========================================================= */

function getScore(category) {

    const value =
        categoryScores[category];

    if (
        value === undefined ||
        value === null
    ) {

        return null;

    }

    return Number(value);

}


/* =========================================================
   CHECK IF USER ASKED FOR SCORE
========================================================= */

function isScoreQuestion(message) {

    const q =
        message.toLowerCase();

    return (

        q.includes("score") ||

        q.includes("percentage") ||

        q.includes("rating") ||

        q.includes("marks") ||

        q.includes("how much did i score") ||

        q.includes("assessment result") ||

        q.includes("assessment score") ||

        q.includes("overall score")

    );

}


/* =========================================================
   SCORE RESPONSE
========================================================= */

function scoreExplanation() {

    let response =
        "Here is your NKP assessment result:\n\n";


    if (overallScore !== null) {

        response +=
            `Overall Assessment Score: ${overallScore}%\n\n`;

    }


    response +=
        "Category-wise performance:\n";


    const keys =
        Object.keys(categoryNames);


    keys.forEach(function (key) {

        const score =
            getScore(key);

        if (score !== null) {

            response +=
                `• ${categoryNames[key]}: ${score}%\n`;

        }

    });


    response +=
        "\nIf you want, I can also explain what each category means and what actions you can take to improve it.";

    return response;
}


/* =========================================================
   BUSINESS DIAGNOSIS
   NO SCORES
========================================================= */

function businessDiagnosis() {

    if (!business || Object.keys(business).length === 0) {

        return `
I can analyse your business using the information collected by NKP.

Please make sure your Business Setup and Assessment are completed first.
`;

    }


    let response =
        "Based on the information available in NKP, your business should focus on improving the areas that have the biggest impact on day-to-day performance and long-term growth.\n\n";


    response +=
        "I would recommend focusing on:\n\n";


    response +=
        "• Financial discipline and cash management\n";

    response +=
        "• Operational efficiency\n";

    response +=
        "• Customer retention and market positioning\n";

    response +=
        "• Team productivity and leadership\n";

    response +=
        "• Sustainable growth planning\n\n";


    response +=
        "Tell me one specific area you want to work on, and I can give you a practical action plan.";

    return response;
}


/* =========================================================
   PRIORITY
   NO SCORE
========================================================= */

function priorityAdvisor() {

    const categories =
        Object.keys(categoryNames);

    let lowestCategory = null;

    let lowestScore = Infinity;


    categories.forEach(function (key) {

        const score =
            getScore(key);

        if (
            score !== null &&
            score < lowestScore
        ) {

            lowestScore = score;

            lowestCategory = key;

        }

    });


    if (!lowestCategory) {

        return `
Your assessment data is not available yet.

Complete the NKP assessment first, and I can identify your business priority.
`;

    }


    return `
Your current priority area is **${categoryNames[lowestCategory]}**.

I recommend focusing on this area before trying to improve everything at the same time.

I can create a practical improvement plan for this area if you want.
`;

}


/* =========================================================
   FINANCIAL ADVISOR
========================================================= */

function financialAdvisor() {

    return `
For financial improvement, focus on these areas:

• Track revenue and expenses consistently.
• Separate business money from personal spending.
• Monitor cash flow every week.
• Identify unnecessary operating costs.
• Maintain an emergency cash reserve.
• Review profitability for each major product or service.
• Set monthly financial targets.

The goal is not just higher revenue. Your business should generate healthy and consistent cash flow.
`;

}


/* =========================================================
   SALES ADVISOR
========================================================= */

function salesAdvisor() {

    return `
To improve sales, focus on a repeatable sales process:

• Understand which products or services generate the most demand.
• Identify your most valuable customer group.
• Improve your customer follow-up process.
• Encourage repeat purchases.
• Ask existing customers for referrals.
• Track monthly sales trends.
• Test new offers instead of changing everything at once.

A strong sales strategy should increase both customer acquisition and customer retention.
`;

}


/* =========================================================
   OPERATIONS ADVISOR
========================================================= */

function operationsAdvisor() {

    return `
To improve operations:

• Identify repetitive tasks.
• Create simple standard procedures.
• Reduce unnecessary manual work.
• Track delays and operational problems.
• Improve inventory and resource planning.
• Assign clear responsibilities to employees.
• Review important processes regularly.

The objective is to make the business easier to operate, more consistent, and less dependent on individual people.
`;

}


/* =========================================================
   CUSTOMER ADVISOR
========================================================= */

function customerAdvisor() {

    return `
For customer growth:

• Understand what your customers value most.
• Collect customer feedback regularly.
• Track complaints and recurring issues.
• Improve response time.
• Build a strong repeat-customer system.
• Study competitors.
• Give customers a clear reason to choose your business.

Customer retention is often one of the strongest foundations for sustainable growth.
`;

}


/* =========================================================
   PEOPLE ADVISOR
========================================================= */

function peopleAdvisor() {

    return `
For your team and people management:

• Give every employee clear responsibilities.
• Set measurable work expectations.
• Provide regular feedback.
• Identify skill gaps.
• Provide useful training.
• Recognise good performance.
• Encourage communication between team members.

A business becomes more scalable when employees can perform their responsibilities consistently without constant supervision.
`;

}


/* =========================================================
   GROWTH ADVISOR
========================================================= */

function growthAdvisor() {

    return `
For sustainable business growth:

• Define clear short-term and long-term goals.
• Identify your strongest revenue opportunities.
• Improve existing operations before scaling aggressively.
• Test new products or markets carefully.
• Build repeatable processes.
• Monitor financial capacity before expansion.
• Create a realistic growth roadmap.

Growth should be controlled and sustainable rather than based only on increasing sales quickly.
`;

}


/* =========================================================
   RISK ADVISOR
========================================================= */

function riskAdvisor() {

    return `
Important business risks to monitor include:

• Cash-flow problems
• Customer concentration
• Supplier dependency
• Employee dependency
• Compliance issues
• Operational disruptions
• Poor financial record keeping
• Unplanned expansion
• Lack of emergency reserves

Review these risks regularly and create a simple backup plan for the most important ones.
`;

}


/* =========================================================
   ACTION PLAN
========================================================= */

function actionPlan() {

    return `
Here is a practical NKP improvement plan:

STEP 1
Understand your current business situation.

STEP 2
Choose one high-impact problem instead of trying to fix everything together.

STEP 3
Create a measurable target for that problem.

STEP 4
Implement one or two practical changes.

STEP 5
Track the result every week.

STEP 6
Keep what works and change what does not.

STEP 7
Move to the next improvement area only after the first one is under control.

If you tell me your specific business problem, I can turn this into a detailed action plan.
`;

}


/* =========================================================
   IMPROVEMENT ADVISOR
========================================================= */

function improvementAdvisor() {

    return `
You can improve your business by working on five important areas:

1. Financial management
Control expenses and maintain healthy cash flow.

2. Operations
Make daily processes simpler and more efficient.

3. Customers
Improve satisfaction and encourage repeat business.

4. People
Build a productive and responsible team.

5. Growth
Create a clear plan for sustainable expansion.

Do not try to change everything at once. Pick the most important problem and solve it first.
`;

}


/* =========================================================
   BUSINESS SUMMARY
   ONLY WHEN USER REQUESTS DETAILS
========================================================= */

function businessSummary() {

    if (
        !business ||
        Object.keys(business).length === 0
    ) {

        return `
I don't have your business setup information available yet.

Please complete the Business Setup section in NKP first.
`;

    }


    let response =
        "Here is the business information currently available in NKP:\n\n";


    if (business.businessName) {

        response +=
            `Business Name: ${business.businessName}\n`;

    }


    if (business.businessType) {

        response +=
            `Business Type: ${business.businessType}\n`;

    }


    if (business.industry) {

        response +=
            `Industry: ${business.industry}\n`;

    }


    if (business.yearsInBusiness) {

        response +=
            `Years in Business: ${business.yearsInBusiness}\n`;

    }


    if (business.employees) {

        response +=
            `Employees: ${business.employees}\n`;

    }


    if (business.location) {

        response +=
            `Location: ${business.location}\n`;

    }


    return response;
}


/* =========================================================
   GENERATE RESPONSE
========================================================= */

function generateResponse(message) {

    const q =
        message.toLowerCase().trim();


    /* SCORE QUESTIONS */

    if (isScoreQuestion(q)) {

        return scoreExplanation();

    }


    /* BUSINESS SUMMARY */

    if (

        q.includes("business details") ||

        q.includes("business information") ||

        q.includes("my business details") ||

        q.includes("what do you know about my business")

    ) {

        return businessSummary();

    }


    /* PRIORITY */

    if (

        q.includes("priority") ||

        q.includes("what should i focus") ||

        q.includes("where should i focus") ||

        q.includes("what should i improve first")

    ) {

        return priorityAdvisor();

    }


    /* FINANCIAL */

    if (

        q.includes("financial") ||

        q.includes("finance") ||

        q.includes("cash flow") ||

        q.includes("expense") ||

        q.includes("profit")

    ) {

        return financialAdvisor();

    }


    /* SALES */

    if (

        q.includes("sales") ||

        q.includes("sell more") ||

        q.includes("increase sales") ||

        q.includes("customers") && q.includes("increase")

    ) {

        return salesAdvisor();

    }


    /* OPERATIONS */

    if (

        q.includes("operation") ||

        q.includes("process") ||

        q.includes("productivity") ||

        q.includes("efficiency")

    ) {

        return operationsAdvisor();

    }


    /* CUSTOMER */

    if (

        q.includes("customer") ||

        q.includes("retention") ||

        q.includes("marketing") ||

        q.includes("competition")

    ) {

        return customerAdvisor();

    }


    /* PEOPLE */

    if (

        q.includes("employee") ||

        q.includes("employees") ||

        q.includes("team") ||

        q.includes("staff") ||

        q.includes("leadership")

    ) {

        return peopleAdvisor();

    }


    /* GROWTH */

    if (

        q.includes("growth") ||

        q.includes("expand") ||

        q.includes("expansion") ||

        q.includes("scale")

    ) {

        return growthAdvisor();

    }


    /* RISK */

    if (

        q.includes("risk") ||

        q.includes("problem") ||

        q.includes("danger") ||

        q.includes("threat")

    ) {

        return riskAdvisor();

    }


    /* ACTION PLAN */

    if (

        q.includes("action plan") ||

        q.includes("plan for my business") ||

        q.includes("business plan") ||

        q.includes("steps")

    ) {

        return actionPlan();

    }


    /* GENERAL IMPROVEMENT */

    if (

        q.includes("improve") ||

        q.includes("improvement") ||

        q.includes("better") ||

        q.includes("business health") ||

        q.includes("analyse my business") ||

        q.includes("analyze my business") ||

        q.includes("diagnose")

    ) {

        return improvementAdvisor();

    }


    /* GREETING */

    if (

        q === "hi" ||

        q === "hello" ||

        q === "hey" ||

        q.includes("good morning") ||

        q.includes("good evening")

    ) {

        return `
Hello 👋

I'm NKP AI Advisor.

Tell me what you want help with in your business, and I'll give you a practical answer.
`;

    }


    /* DEFAULT */

    return `
I can help you with your business through NKP.

You can ask me things like:

• How can I improve my business?
• What should I focus on first?
• How can I increase sales?
• How can I improve cash flow?
• How can I improve operations?
• How can I manage my team better?
• What are my business risks?
• Give me an action plan.
• What is my assessment score?

Ask me anything related to your business.
`;

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(text, type) {

    const row =
        document.createElement("div");

    row.className =
        `message-row ${type}`;


    if (type === "user") {

        row.innerHTML = `

            <div class="message user-message">
                ${escapeHTML(text)}
            </div>

        `;

    } else {

        row.innerHTML = `

            <div class="message ai-message">

                <div class="ai-avatar">
                    NKP
                </div>

                <div class="ai-content">
                    ${formatAIText(text)}
                </div>

            </div>

        `;

    }


    chatMessages.appendChild(row);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================================
   FORMAT AI TEXT
========================================================= */

function formatAIText(text) {

    let safe =
        escapeHTML(text);


    safe =
        safe.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    safe =
        safe.replace(
            /\n/g,
            "<br>"
        );


    return safe;
}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

    const message =
        chatInput.value.trim();


    if (!message) {

        return;

    }


    addMessage(
        message,
        "user"
    );


    chatInput.value = "";

    chatInput.style.height = "auto";

    sendButton.disabled = true;


    typingIndicator.style.display =
        "block";


    setTimeout(function () {

        const response =
            generateResponse(message);


        typingIndicator.style.display =
            "none";


        addMessage(
            response,
            "ai"
        );


        sendButton.disabled =
            false;


    }, 500);

}


/* =========================================================
   SEND BUTTON
========================================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================================
   ENTER KEY
========================================================= */

chatInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================================
   AUTO RESIZE
========================================================= */

chatInput.addEventListener(
    "input",
    function () {

        this.style.height =
            "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                140
            ) + "px";

    }
);


/* =========================================================
   NEW CHAT
========================================================= */

newChatButton.addEventListener(
    "click",
    function () {

        chatMessages.innerHTML = "";

        chatInput.value = "";

        chatInput.style.height =
            "auto";

        chatInput.focus();

    }
);


/* =========================================================
   SIDEBAR BUTTONS
========================================================= */

document
    .querySelectorAll(".sidebar-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const question =
                    this.getAttribute(
                        "data-question"
                    );


                if (!question) {

                    return;

                }


                chatInput.value =
                    question;


                sendMessage();


                if (
                    window.innerWidth <= 800
                ) {

                    sidebar.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   REPORT
========================================================= */

if (reportButton) {

    reportButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "reports.html";

        }
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );

}