document.addEventListener("DOMContentLoaded", function () {

    const categoryCards =
        document.querySelectorAll(".category-card");


    categoryCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const category =
                this.getAttribute("data-category");


            console.log("Category clicked:", category);


            if (!category) {

                alert("Category not found!");

                return;
            }


            /* =====================================
               SAVE SELECTED CATEGORY
            ===================================== */

            localStorage.setItem(
                "nkpSelectedCategory",
                category
            );


            /* =====================================
               START FRESH ASSESSMENT FOR CATEGORY
            ===================================== */

            // Clear old completed subcategories
            localStorage.removeItem(
                "nkpCompletedSubcategories_" + category
            );


            // Clear old subcategory selection
            localStorage.removeItem(
                "nkpSelectedSubcategory"
            );

            localStorage.removeItem(
                "nkpSelectedSubcategoryIndex"
            );


            /* =====================================
               CLEAR OLD ANSWERS FOR THIS CATEGORY
            ===================================== */

            const answerKeys = [
                "Revenue & Sales",
                "Profitability",
                "Cash Flow",
                "Financial Management",
                "Financial Risk",

                "Business Processes",
                "Resource Management",
                "Productivity",
                "Quality Management",
                "Process Improvement",

                "Customer Satisfaction",
                "Target Market",
                "Marketing",
                "Competition",
                "Customer Retention",

                "Team Management",
                "Skills & Training",
                "Employee Engagement",
                "Leadership",
                "Talent Development",

                "Business Goals",
                "Strategic Planning",
                "Innovation",
                "Growth Opportunities",
                "Future Readiness"
            ];


            answerKeys.forEach(function (subcategory) {

                localStorage.removeItem(
                    "nkpAnswers_" +
                    category +
                    "_" +
                    subcategory
                );

            });


            console.log(
                "Starting fresh assessment for:",
                category
            );


            /* =====================================
               GO TO SUBCATEGORIES
            ===================================== */

            window.location.href =
                "subcategories.html";

        });

    });

});