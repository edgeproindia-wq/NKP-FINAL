const businessForm =
document.getElementById("businessSetupForm");

const businessMessage =
document.getElementById("businessMessage");

const continueButton =
document.getElementById("continueButton");

const buttonText =
document.getElementById("buttonText");

const description =
document.getElementById("description");

/* ================================
MESSAGE
================================ */

function showMessage(message, type) {

businessMessage.textContent = message;

businessMessage.className =
    "business-message " + type;
}

/* ================================
DESCRIPTION CHARACTER LIMIT
================================ */

description.addEventListener("input", function () {


if (this.value.length > 500) {

    this.value =
        this.value.substring(0, 500);

}

});

/* ================================
CLEAR OLD ASSESSMENT PROGRESS
================================ */

function resetAssessmentProgress() {

/* Selected category/subcategory */

localStorage.removeItem(
    "nkpSelectedCategory"
);

localStorage.removeItem(
    "nkpSelectedSubcategory"
);

localStorage.removeItem(
    "nkpSelectedSubcategoryIndex"
);


/* Old category scores */

localStorage.removeItem(
    "nkpCategoryScores"
);

localStorage.removeItem(
    "nkpOverallScore"
);


/* Old assessment answers */

localStorage.removeItem(
    "assessmentAnswers"
);


/* Category progress */

const categories = [
    "financial",
    "operations",
    "customer",
    "people",
    "growth"
];


categories.forEach(function (category) {

    localStorage.removeItem(
        "nkpCategoryScore_" + category
    );

    localStorage.removeItem(
        "nkpCompletedSubcategories_" + category
    );

});


/* All 25 subcategory answer sets */

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


Object.keys(subcategories).forEach(
    function (category) {

        subcategories[category].forEach(
            function (subcategory) {

                localStorage.removeItem(
                    "nkpAnswers_" +
                    category +
                    "_" +
                    subcategory
                );

            }
        );

    }
);


console.log(
    "NKP: Old assessment progress cleared."
);

}

/* ================================
FORM SUBMIT
================================ */

businessForm.addEventListener(
"submit",
function (event) {

    event.preventDefault();


    businessMessage.textContent = "";

    businessMessage.className =
        "business-message";


    /* ================================
       GET VALUES
    ================================ */

    const businessName =
        document.getElementById(
            "businessName"
        ).value.trim();

    const businessType =
        document.getElementById(
            "businessType"
        ).value;

    const industry =
        document.getElementById(
            "industry"
        ).value;

    const yearsInBusiness =
        document.getElementById(
            "yearsInBusiness"
        ).value;

    const employees =
        document.getElementById(
            "employees"
        ).value;

    const location =
        document.getElementById(
            "location"
        ).value.trim();

    const monthlyRevenue =
        document.getElementById(
            "monthlyRevenue"
        ).value;

    const monthlyExpenses =
        document.getElementById(
            "monthlyExpenses"
        ).value;

    const businessDescription =
        document.getElementById(
            "description"
        ).value.trim();


    /* ================================
       VALIDATION
    ================================ */

    if (!businessName) {

        showMessage(
            "Please enter your business name.",
            "error"
        );

        return;
    }


    if (!businessType) {

        showMessage(
            "Please select your business type.",
            "error"
        );

        return;
    }


    if (!industry) {

        showMessage(
            "Please select your industry.",
            "error"
        );

        return;
    }


    if (
        yearsInBusiness === "" ||
        Number(yearsInBusiness) < 0
    ) {

        showMessage(
            "Please enter valid years in business.",
            "error"
        );

        return;
    }


    if (
        employees === "" ||
        Number(employees) < 1
    ) {

        showMessage(
            "Please enter the number of employees.",
            "error"
        );

        return;
    }


    if (!location) {

        showMessage(
            "Please enter your business location.",
            "error"
        );

        return;
    }


    if (
        monthlyRevenue === "" ||
        Number(monthlyRevenue) < 0
    ) {

        showMessage(
            "Please enter your monthly revenue.",
            "error"
        );

        return;
    }


    if (
        monthlyExpenses === "" ||
        Number(monthlyExpenses) < 0
    ) {

        showMessage(
            "Please enter your monthly expenses.",
            "error"
        );

        return;
    }


    /* ================================
       SAVE BUSINESS DATA
    ================================ */

    const businessData = {

        businessName: businessName,

        businessType: businessType,

        industry: industry,

        yearsInBusiness:
            Number(yearsInBusiness),

        employees:
            Number(employees),

        location: location,

        monthlyRevenue:
            Number(monthlyRevenue),

        monthlyExpenses:
            Number(monthlyExpenses),

        description:
            businessDescription

    };


    localStorage.setItem(
        "nkpBusiness",
        JSON.stringify(businessData)
    );


    /* ================================
       RESET OLD ASSESSMENT
    ================================ */

    resetAssessmentProgress();


    /* ================================
       BUTTON LOADING
    ================================ */

    continueButton.disabled = true;

    buttonText.textContent =
        "Saving...";


    setTimeout(function () {

        showMessage(
            "Business information saved successfully!",
            "success"
        );


        buttonText.textContent =
            "Continue to Assessment ✓";


        setTimeout(function () {

            window.location.href =
                "categories.html";

        }, 800);

    }, 500);
}
);
