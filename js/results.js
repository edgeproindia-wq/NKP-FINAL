document.addEventListener("DOMContentLoaded", function () {

    /* ================= ELEMENTS ================= */

    const overallScore =
        document.getElementById("overallScore");

    const overallTitle =
        document.getElementById("overallTitle");

    const overallMessage =
        document.getElementById("overallMessage");

    const financialScore =
        document.getElementById("financialScore");

    const operationsScore =
        document.getElementById("operationsScore");

    const customerScore =
        document.getElementById("customerScore");

    const peopleScore =
        document.getElementById("peopleScore");

    const growthScore =
        document.getElementById("growthScore");

    const overallCircle =
        document.querySelector(".overall-circle");

    const aiButton =
        document.getElementById("aiButton");

    const reportButton =
        document.getElementById("reportButton");


    /* ================= CATEGORY SCORES ================= */

    const savedScores =
        localStorage.getItem("nkpCategoryScores");

    let scores = {
        financial: 0,
        operations: 0,
        customer: 0,
        people: 0,
        growth: 0
    };


    if (savedScores) {

        try {

            const parsedScores =
                JSON.parse(savedScores);

            scores = {
                financial:
                    Number(parsedScores.financial) || 0,

                operations:
                    Number(parsedScores.operations) || 0,

                customer:
                    Number(parsedScores.customer) || 0,

                people:
                    Number(parsedScores.people) || 0,

                growth:
                    Number(parsedScores.growth) || 0
            };

        } catch (error) {

            console.log(
                "Unable to read category scores."
            );

        }

    }


    /* ================= DISPLAY CATEGORY SCORES ================= */

    financialScore.textContent =
        scores.financial + "%";

    operationsScore.textContent =
        scores.operations + "%";

    customerScore.textContent =
        scores.customer + "%";

    peopleScore.textContent =
        scores.people + "%";

    growthScore.textContent =
        scores.growth + "%";


    /* ================= OVERALL SCORE ================= */

    const total =
        scores.financial +
        scores.operations +
        scores.customer +
        scores.people +
        scores.growth;


    const overall =
        Math.round(total / 5);


    overallScore.textContent =
        overall + "%";


    /* ================= OVERALL CIRCLE ================= */

    const angle =
        (overall / 100) * 360;


    overallCircle.style.setProperty(
        "--overall-angle",
        angle + "deg"
    );


    /* ================= OVERALL PERFORMANCE ================= */

    if (overall >= 80) {

        overallTitle.textContent =
            "Excellent Business Health";

        overallMessage.textContent =
            "Your business shows strong performance across most key areas. Continue maintaining your strengths and focus on continuous improvement.";

    }

    else if (overall >= 60) {

        overallTitle.textContent =
            "Good Business Health";

        overallMessage.textContent =
            "Your business has a solid foundation. Improving weaker areas can help you achieve stronger and more sustainable growth.";

    }

    else if (overall >= 40) {

        overallTitle.textContent =
            "Business Needs Improvement";

        overallMessage.textContent =
            "Several areas of your business need attention. Focus on the weaker categories and create practical improvement plans.";

    }

    else {

        overallTitle.textContent =
            "Immediate Attention Needed";

        overallMessage.textContent =
            "Your assessment indicates that several important business areas require significant improvement. Start with the lowest-performing areas.";

    }


    /* ================= SAVE OVERALL SCORE ================= */

    localStorage.setItem(
        "nkpOverallScore",
        overall
    );


    /* ================= AI SUGGESTIONS ================= */

    aiButton.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "nkpOverallScore",
                overall
            );

            window.location.href =
                "ai-insights.html";

        }
    );


    /* ================= REPORT ================= */

    reportButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "reports.html";

        }
    );


    /* ================= CONSOLE CHECK ================= */

    console.log(
        "Financial:",
        scores.financial
    );

    console.log(
        "Operations:",
        scores.operations
    );

    console.log(
        "Customer:",
        scores.customer
    );

    console.log(
        "People:",
        scores.people
    );

    console.log(
        "Growth:",
        scores.growth
    );

    console.log(
        "Overall:",
        overall
    );

});