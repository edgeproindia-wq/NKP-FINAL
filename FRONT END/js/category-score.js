document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       SELECTED CATEGORY
    ===================================== */

    const selectedCategory =
        localStorage.getItem("nkpSelectedCategory") ||
        "financial";


    /* =====================================
       ALL SUBCATEGORIES
    ===================================== */

    const subcategories = {

        financial: [
            "Revenue & Sales",
            "Profitability",
            "Cash Flow",
            "Financial Management",
            "Financial Risk"
        ],

        operations: [
            "Business Processes",
            "Resource Management",
            "Productivity",
            "Quality Management",
            "Process Improvement"
        ],

        customer: [
            "Customer Satisfaction",
            "Target Market",
            "Marketing",
            "Competition",
            "Customer Retention"
        ],

        people: [
            "Team Management",
            "Skills & Training",
            "Employee Engagement",
            "Leadership",
            "Talent Development"
        ],

        growth: [
            "Business Goals",
            "Strategic Planning",
            "Innovation",
            "Growth Opportunities",
            "Future Readiness"
        ]

    };


    /* =====================================
       CHECK COMPLETED SUBCATEGORIES
    ===================================== */

    const completedKey =
        "nkpCompletedSubcategories_" +
        selectedCategory;


    let completedSubcategories = [];


    const savedCompleted =
        localStorage.getItem(completedKey);


    if (savedCompleted) {

        try {

            completedSubcategories =
                JSON.parse(savedCompleted);

        } catch (error) {

            completedSubcategories = [];

        }

    }


    /* =====================================
       SECURITY CHECK
       ALL 5 MUST BE COMPLETED
    ===================================== */

    const currentSubcategories =
        subcategories[selectedCategory] || [];


    const allCompleted =
        currentSubcategories.length === 5 &&
        currentSubcategories.every(function (subcategory) {

            return completedSubcategories.includes(
                subcategory
            );

        });


    /* =====================================
       STOP SCORE PAGE IF NOT COMPLETED
    ===================================== */

    if (!allCompleted) {

        alert(
            "Please complete all 5 subcategories before viewing the category score."
        );

        window.location.href =
            "subcategories.html";

        return;

    }


    /* =====================================
       ELEMENTS
    ===================================== */

    const categoryName =
        document.getElementById("categoryName");

    const categoryScore =
        document.getElementById("categoryScore");

    const performanceTitle =
        document.getElementById("performanceTitle");

    const performanceMessage =
        document.getElementById("performanceMessage");

    const subcategorySummary =
        document.getElementById("subcategorySummary");

    const scoreCircle =
        document.querySelector(".score-circle");

    const continueBtn =
        document.getElementById("continueBtn");


    /* =====================================
       CATEGORY NAMES
    ===================================== */

    const categoryNames = {

        financial: "Financial Health",

        operations: "Operations",

        customer: "Customer & Market",

        people: "People & Team",

        growth: "Growth & Strategy"

    };


    /* =====================================
       SET CATEGORY NAME
    ===================================== */

    categoryName.textContent =
        categoryNames[selectedCategory] ||
        "Business Health";


    /* =====================================
       SCORE CALCULATION
    ===================================== */

    let totalCategoryScore = 0;

    let completedCount = 0;


    subcategorySummary.innerHTML = "";


    currentSubcategories.forEach(
        function (subcategory) {

            const answerKey =
                "nkpAnswers_" +
                selectedCategory +
                "_" +
                subcategory;


            const savedAnswers =
                localStorage.getItem(answerKey);


            let answers = [];


            if (savedAnswers) {

                try {

                    answers =
                        JSON.parse(savedAnswers);

                } catch (error) {

                    answers = [];

                }

            }


            /* ===============================
               VALIDATE EXACTLY 5 ANSWERS
            =============================== */

            if (
                !Array.isArray(answers) ||
                answers.length !== 5 ||
                answers.some(function (answer) {

                    return (
                        Number(answer) < 1 ||
                        Number(answer) > 5
                    );

                })
            ) {

                alert(
                    "Assessment data is incomplete. Please complete all questions."
                );

                window.location.href =
                    "subcategories.html";

                return;

            }


            /* ===============================
               SUBCATEGORY TOTAL
            =============================== */

            let total = 0;


            answers.forEach(function (answer) {

                total += Number(answer);

            });


            /* ===============================
               SUBCATEGORY SCORE
            =============================== */

            const score =
                Math.round(
                    (total / 25) * 100
                );


            totalCategoryScore += score;

            completedCount++;


            /* ===============================
               CREATE ROW
            =============================== */

            const row =
                document.createElement("div");


            row.className =
                "subcategory-row";


            row.innerHTML = `

                <span>
                    ${subcategory}
                </span>

                <span class="subcategory-score">
                    ${score}%
                </span>

            `;


            subcategorySummary.appendChild(row);

        }
    );


    /* =====================================
       FINAL CATEGORY SCORE
    ===================================== */

    let finalCategoryScore = 0;


    if (completedCount === 5) {

        finalCategoryScore =
            Math.round(
                totalCategoryScore / 5
            );

    }


    categoryScore.textContent =
        finalCategoryScore + "%";


    /* =====================================
       SCORE CIRCLE
    ===================================== */

    const angle =
        (finalCategoryScore / 100) * 360;


    scoreCircle.style.setProperty(
        "--score-angle",
        angle + "deg"
    );


    /* =====================================
       PERFORMANCE MESSAGE
    ===================================== */

    if (finalCategoryScore >= 80) {

        performanceTitle.textContent =
            "Excellent Performance";

        performanceMessage.textContent =
            "Your business is performing strongly in this area. Continue maintaining these practices.";

    }

    else if (finalCategoryScore >= 60) {

        performanceTitle.textContent =
            "Good Performance";

        performanceMessage.textContent =
            "Your business has a good foundation in this area. There are still opportunities for improvement.";

    }

    else if (finalCategoryScore >= 40) {

        performanceTitle.textContent =
            "Needs Improvement";

        performanceMessage.textContent =
            "This area needs attention. Improving these practices can strengthen your business.";

    }

    else {

        performanceTitle.textContent =
            "Immediate Attention Needed";

        performanceMessage.textContent =
            "This area requires significant improvement. Consider creating an action plan.";

    }


    /* =====================================
       SAVE CATEGORY SCORE
    ===================================== */

    localStorage.setItem(
        "nkpCategoryScore_" +
        selectedCategory,
        finalCategoryScore
    );


    /* =====================================
       SAVE ALL CATEGORY SCORES
    ===================================== */

    let allCategoryScores = {};


    const savedScores =
        localStorage.getItem(
            "nkpCategoryScores"
        );


    if (savedScores) {

        try {

            allCategoryScores =
                JSON.parse(savedScores);

        } catch (error) {

            allCategoryScores = {};

        }

    }


    allCategoryScores[selectedCategory] =
        finalCategoryScore;


    localStorage.setItem(
        "nkpCategoryScores",
        JSON.stringify(
            allCategoryScores
        )
    );


    /* =====================================
       CATEGORY ORDER
    ===================================== */

    const categoryOrder = [

        "financial",
        "operations",
        "customer",
        "people",
        "growth"

    ];


    const currentIndex =
        categoryOrder.indexOf(
            selectedCategory
        );


    /* =====================================
       CONTINUE BUTTON
    ===================================== */

    if (
        currentIndex >= 0 &&
        currentIndex <
        categoryOrder.length - 1
    ) {

        const nextCategory =
            categoryOrder[
                currentIndex + 1
            ];


        continueBtn.textContent =
            "Continue to " +
            categoryNames[nextCategory] +
            " →";


        continueBtn.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "nkpSelectedCategory",
                    nextCategory
                );


                localStorage.removeItem(
                    "nkpSelectedSubcategory"
                );


                localStorage.removeItem(
                    "nkpSelectedSubcategoryIndex"
                );


                window.location.href =
                    "subcategories.html";

            }
        );

    }

    else {

        continueBtn.textContent =
            "View Final Assessment →";


        continueBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "results.html";

            }
        );

    }

});