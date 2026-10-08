document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
    ===================================== */

    const categoryTitle =
        document.getElementById("categoryTitle");

    const cardTitle =
        document.getElementById("cardTitle");

    const subcategoryGrid =
        document.getElementById("subcategoryGrid");


    /* =====================================
       SELECTED CATEGORY
    ===================================== */

    let selectedCategory =
        localStorage.getItem("nkpSelectedCategory");

    if (!selectedCategory) {
        selectedCategory = "financial";

        localStorage.setItem(
            "nkpSelectedCategory",
            selectedCategory
        );
    }


    /* =====================================
       CATEGORY DATA
    ===================================== */

    const categoryData = {

        financial: {
            title: "Financial",
            name: "Financial Health",

            items: [
                ["💰", "Revenue & Sales", "Understand your revenue performance and sales consistency."],
                ["📊", "Profitability", "Evaluate your business profit margins and earnings."],
                ["💳", "Cash Flow", "Review how effectively your business manages cash."],
                ["📒", "Financial Management", "Assess budgeting, accounting and financial tracking."],
                ["🛡️", "Financial Risk", "Identify financial risks and areas requiring attention."]
            ]
        },

        operations: {
            title: "Operations",
            name: "Operations",

            items: [
                ["⚙️", "Business Processes", "Evaluate the efficiency of your daily processes."],
                ["📦", "Resource Management", "Assess how effectively resources are being utilized."],
                ["⏱️", "Productivity", "Understand productivity and operational performance."],
                ["✅", "Quality Management", "Review quality standards and consistency."],
                ["🔄", "Process Improvement", "Identify opportunities to improve operations."]
            ]
        },

        customer: {
            title: "Customer & Market",
            name: "Customer & Market",

            items: [
                ["❤️", "Customer Satisfaction", "Understand customer experience and satisfaction."],
                ["🎯", "Target Market", "Evaluate how well you understand your target customers."],
                ["📣", "Marketing", "Assess your marketing activities and reach."],
                ["🏆", "Competition", "Understand your competitive position in the market."],
                ["🔁", "Customer Retention", "Evaluate your ability to retain existing customers."]
            ]
        },

        people: {
            title: "People & Team",
            name: "People & Team",

            items: [
                ["👥", "Team Management", "Evaluate how effectively your team is managed."],
                ["🎓", "Skills & Training", "Assess employee skills and development."],
                ["🤝", "Employee Engagement", "Understand team motivation and engagement."],
                ["👔", "Leadership", "Evaluate leadership and decision-making."],
                ["🌱", "Talent Development", "Assess how your business develops its people."]
            ]
        },

        growth: {
            title: "Growth & Strategy",
            name: "Growth & Strategy",

            items: [
                ["🎯", "Business Goals", "Evaluate clarity and effectiveness of your goals."],
                ["🧭", "Strategic Planning", "Assess your long-term business planning."],
                ["💡", "Innovation", "Understand how your business adapts and innovates."],
                ["📈", "Growth Opportunities", "Identify opportunities for sustainable growth."],
                ["🚀", "Future Readiness", "Assess how prepared your business is for the future."]
            ]
        }

    };


    /* =====================================
       GET CATEGORY DATA
    ===================================== */

    const data =
        categoryData[selectedCategory] ||
        categoryData.financial;


    /* =====================================
       DISPLAY CATEGORY
    ===================================== */

    categoryTitle.textContent =
        data.title;

    cardTitle.textContent =
        data.name;


    /* =====================================
       COMPLETED SUBCATEGORIES
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
       CLEAR OLD CARDS
    ===================================== */

    subcategoryGrid.innerHTML = "";


    /* =====================================
       CREATE SUBCATEGORY CARDS
    ===================================== */

    data.items.forEach(function (item, index) {

        const icon = item[0];
        const subcategoryName = item[1];
        const description = item[2];

        const subcategory =
            document.createElement("div");

        subcategory.className =
            "subcategory";


        const completed =
            completedSubcategories.includes(
                subcategoryName
            );


        subcategory.innerHTML = `

            <div class="sub-icon">
                ${icon}
            </div>

            <div class="sub-content">

                <h3>
                    ${subcategoryName}
                </h3>

                <p>
                    ${description}
                </p>

                ${
                    completed
                        ? `
                            <span class="completed-link">
                                ✓ Completed
                            </span>
                          `
                        : `
                            <span class="start-link">
                                Start questions →
                            </span>
                          `
                }

            </div>

        `;


        /* =====================================
           CLICK EVENT
        ===================================== */

        subcategory.addEventListener(
            "click",
            function () {

                if (completed) {

                    alert(
                        "This subcategory is already completed."
                    );

                    return;
                }


                /* =================================
                   SAVE CATEGORY
                ================================= */

                localStorage.setItem(
                    "nkpSelectedCategory",
                    selectedCategory
                );


                /* =================================
                   SAVE SUBCATEGORY
                ================================= */

                localStorage.setItem(
                    "nkpSelectedSubcategory",
                    subcategoryName
                );


                /* =================================
                   SAVE INDEX
                ================================= */

                localStorage.setItem(
                    "nkpSelectedSubcategoryIndex",
                    String(index)
                );


                /* =================================
                   VERIFY BEFORE NAVIGATION
                ================================= */

                const savedSubcategory =
                    localStorage.getItem(
                        "nkpSelectedSubcategory"
                    );


                console.log(
                    "Selected Category:",
                    selectedCategory
                );

                console.log(
                    "Selected Subcategory:",
                    savedSubcategory
                );


                if (!savedSubcategory) {

                    alert(
                        "Subcategory could not be saved. Please try again."
                    );

                    return;
                }


                /* =================================
                   GO TO QUESTIONS
                ================================= */

                window.location.href =
                    "questions.html";

            }
        );


        subcategoryGrid.appendChild(
            subcategory
        );

    });

});