document.addEventListener("DOMContentLoaded", function () {

/* =========================
   LOAD BUSINESS DATA
========================= */

const businessData =
    JSON.parse(
        localStorage.getItem("nkpBusiness")
    ) || {};


/* =========================
   LOAD SCORES
========================= */

const categoryScores =
    JSON.parse(
        localStorage.getItem("nkpCategoryScores")
    ) || {};


let overallScore =
    Number(
        localStorage.getItem("nkpOverallScore")
    );


/* =========================
   BUSINESS INFORMATION
========================= */

const businessName =
    document.getElementById("businessName");

const businessType =
    document.getElementById("businessType");

const industry =
    document.getElementById("industry");

const yearsInBusiness =
    document.getElementById("yearsInBusiness");

const employees =
    document.getElementById("employees");

const location =
    document.getElementById("location");


if (businessName) {
    businessName.textContent =
        businessData.businessName || "—";
}

if (businessType) {
    businessType.textContent =
        formatText(businessData.businessType);
}

if (industry) {
    industry.textContent =
        formatText(businessData.industry);
}

if (yearsInBusiness) {
    yearsInBusiness.textContent =
        businessData.yearsInBusiness ?? "—";
}

if (employees) {
    employees.textContent =
        businessData.employees ?? "—";
}

if (location) {
    location.textContent =
        businessData.location || "—";
}


/* =========================
   CATEGORY DEFINITIONS
========================= */

const categories = [

    {
        key: "financial",
        name: "Financial Health"
    },

    {
        key: "operations",
        name: "Operations"
    },

    {
        key: "customer",
        name: "Customer & Market"
    },

    {
        key: "people",
        name: "People & Team"
    },

    {
        key: "growth",
        name: "Growth & Strategy"
    }

];


/* =========================
   NORMALIZE SCORES
========================= */

const scores =
    categories.map(function (category) {

        let value =
            Number(
                categoryScores[category.key]
            );

        if (!Number.isFinite(value)) {
            value = 0;
        }

        return {

            key: category.key,

            name: category.name,

            score:
                Math.max(
                    0,
                    Math.min(
                        100,
                        value
                    )
                )

        };

    });


/* =========================
   OVERALL SCORE
========================= */

if (!Number.isFinite(overallScore)) {

    const validScores =
        scores
            .map(function (item) {
                return item.score;
            })
            .filter(function (score) {
                return score > 0;
            });


    if (validScores.length > 0) {

        overallScore =
            validScores.reduce(
                function (total, score) {
                    return total + score;
                },
                0
            ) / validScores.length;

    } else {

        overallScore = 0;

    }

}


overallScore =
    Math.round(overallScore);


/* =========================
   OVERALL DISPLAY
========================= */

const overallScoreElement =
    document.getElementById("overallScore");

const circleScoreElement =
    document.getElementById("circleScore");

const overallStatusElement =
    document.getElementById("overallStatus");


if (overallScoreElement) {

    overallScoreElement.textContent =
        overallScore + "%";

}


if (circleScoreElement) {

    circleScoreElement.textContent =
        overallScore + "%";

}


if (overallStatusElement) {

    overallStatusElement.textContent =
        getHealthStatus(overallScore);

}


/* =========================
   CATEGORY LIST
========================= */

const categoryContainer =
    document.getElementById("categoryScores");


if (categoryContainer) {

    categoryContainer.innerHTML = "";


    scores.forEach(function (item) {

        const div =
            document.createElement("div");


        div.className =
            "category-item";


        const top =
            document.createElement("div");

        top.className =
            "category-top";


        const name =
            document.createElement("span");

        name.className =
            "category-name";

        name.textContent =
            item.name;


        const score =
            document.createElement("span");

        score.className =
            "category-score";

        score.textContent =
            Math.round(item.score) + "%";


        top.appendChild(name);

        top.appendChild(score);


        const track =
            document.createElement("div");

        track.className =
            "progress-track";


        const fill =
            document.createElement("div");

        fill.className =
            "progress-fill";

        fill.style.width =
            item.score + "%";


        track.appendChild(fill);


        div.appendChild(top);

        div.appendChild(track);


        categoryContainer.appendChild(div);

    });

}


/* =========================
   STRONG / WEAK AREA
========================= */

const sorted =
    [...scores].sort(function (a, b) {

        return b.score - a.score;

    });


const strongest =
    sorted[0];

const weakest =
    sorted[sorted.length - 1];


const strongArea =
    document.getElementById("strongArea");

const strongDescription =
    document.getElementById(
        "strongDescription"
    );

const weakArea =
    document.getElementById("weakArea");

const weakDescription =
    document.getElementById(
        "weakDescription"
    );


if (strongest) {

    if (strongArea) {

        strongArea.textContent =
            strongest.name;

    }

    if (strongDescription) {

        strongDescription.textContent =
            getStrongDescription(
                strongest.score
            );

    }

}


if (weakest) {

    if (weakArea) {

        weakArea.textContent =
            weakest.name;

    }

    if (weakDescription) {

        weakDescription.textContent =
            getWeakDescription(
                weakest.score
            );

    }

}


/* =========================
   RECOMMENDATIONS
========================= */

const recommendationContainer =
    document.getElementById(
        "recommendations"
    );


if (recommendationContainer) {

    recommendationContainer.innerHTML =
        "";


    const lowAreas =
        [...scores]
            .sort(function (a, b) {

                return a.score - b.score;

            })
            .slice(0, 3);


    lowAreas.forEach(function (item) {

        const recommendation =
            document.createElement("div");


        recommendation.className =
            "recommendation";


        const title =
            document.createElement("strong");

        title.textContent =
            item.name;


        const text =
            document.createElement("p");

        text.textContent =
            getRecommendation(item.key);


        recommendation.appendChild(title);

        recommendation.appendChild(text);


        recommendationContainer.appendChild(
            recommendation
        );

    });

}


/* =========================
   REPORT DATE
========================= */

const reportDate =
    document.getElementById("reportDate");


if (reportDate) {

    reportDate.textContent =
        "Generated on " +
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================
   PRINT BUTTON
========================= */

const printButton =
    document.getElementById("printReport");


if (printButton) {

    printButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


/* =========================
   RESULTS BUTTON
========================= */

const backResults =
    document.getElementById("backResults");


if (backResults) {

    backResults.addEventListener(
        "click",
        function () {

            window.location.href =
                "results.html";

        }
    );

}


console.log(
    "NKP Reports loaded successfully."
);


});

/* =========================
FORMAT TEXT
========================= */

function formatText(value) {


if (!value) {
    return "—";
}


return String(value)
    .replace(/-/g, " ")
    .replace(
        /\b\w/g,
        function (letter) {

            return letter.toUpperCase();

        }
    );


}

/* =========================
HEALTH STATUS
========================= */

function getHealthStatus(score) {


if (score >= 80) {

    return "Strong Business Health";

}


if (score >= 60) {

    return "Good Business Health";

}


if (score >= 40) {

    return "Moderate Business Health";

}


return "Needs Improvement";


}

/* =========================
STRONG DESCRIPTION
========================= */

function getStrongDescription(score) {


if (score >= 80) {

    return "This area is performing strongly and shows good business practices.";

}


if (score >= 60) {

    return "This area is performing well with some opportunities for further improvement.";

}


return "This area has potential and can be strengthened further.";


}

/* =========================
WEAK DESCRIPTION
========================= */

function getWeakDescription(score) {

if (score < 40) {

    return "This area requires immediate attention and structured improvement.";

}


if (score < 60) {

    return "This area needs focused improvement to strengthen business performance.";

}


return "This area can still be improved for stronger business performance.";


}

/* =========================
RECOMMENDATIONS
========================= */

function getRecommendation(key) {


const recommendations = {

    financial:
        "Review revenue, expenses, cash flow and financial planning regularly. Maintain clear financial records and monitor profitability.",

    operations:
        "Improve daily processes, resource utilization, quality control and productivity through clear procedures and regular monitoring.",

    customer:
        "Focus on customer satisfaction, marketing, retention and understanding your target market to strengthen your competitive position.",

    people:
        "Invest in employee skills, team communication, leadership and engagement to build a stronger and more productive workforce.",

    growth:
        "Set clear business goals, develop a long-term strategy, identify growth opportunities and prepare the business for future changes."

};


return (
    recommendations[key] ||
    "Focus on this area and create a practical improvement plan."
);
}
