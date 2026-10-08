document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
    ===================================== */

    const subcategoryTitle =
        document.getElementById("subcategoryTitle");

    const subcategoryDescription =
        document.getElementById("subcategoryDescription");

    const questionCounter =
        document.getElementById("questionCounter");

    const progressPercentage =
        document.getElementById("progressPercentage");

    const progressFill =
        document.getElementById("progressFill");

    const questionNumber =
        document.getElementById("questionNumber");

    const questionText =
        document.getElementById("questionText");

    const options =
        document.querySelectorAll(".option");

    const previousBtn =
        document.getElementById("previousBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const questionMessage =
        document.getElementById("questionMessage");


    /* =====================================
       SELECTED CATEGORY
    ===================================== */

    const selectedCategory =
        localStorage.getItem("nkpSelectedCategory") ||
        "financial";


    /* =====================================
       SELECTED SUBCATEGORY
    ===================================== */

    const selectedSubcategory =
        localStorage.getItem("nkpSelectedSubcategory");


    console.log("Selected Category:", selectedCategory);
    console.log("Selected Subcategory:", selectedSubcategory);


    /* =====================================
       QUESTION DATABASE
    ===================================== */

    const questions = {

        /* ===============================
           FINANCIAL
        =============================== */

        "Revenue & Sales": [
            "My business generates consistent revenue every month.",
            "I have a clear understanding of where my sales come from.",
            "My business regularly attracts new customers.",
            "I track my sales performance and compare it with previous periods.",
            "My current sales are sufficient to support my business operations."
        ],

        "Profitability": [
            "My business generates a healthy profit after expenses.",
            "I regularly calculate and review my profit margin.",
            "I know which products or services generate the most profit.",
            "I take action when my profitability decreases.",
            "My business pricing allows me to maintain a reasonable profit."
        ],

        "Cash Flow": [
            "My business has enough cash to meet regular expenses.",
            "I regularly monitor money coming into and going out of the business.",
            "Customers usually pay me on time.",
            "I maintain sufficient cash reserves for unexpected expenses.",
            "I rarely face difficulty paying business-related bills."
        ],

        "Financial Management": [
            "I maintain proper records of my business income and expenses.",
            "I separate personal expenses from business expenses.",
            "I prepare a budget for my business.",
            "I review my financial records regularly.",
            "I make important business decisions using financial information."
        ],

        "Financial Risk": [
            "My business can handle unexpected financial expenses.",
            "I understand the major financial risks affecting my business.",
            "My business does not depend heavily on a single source of income.",
            "I have a plan for managing business debt.",
            "I take steps to reduce financial risks in my business."
        ],


        /* ===============================
           OPERATIONS
        =============================== */

        "Business Processes": [
            "My business has clear and organized daily processes.",
            "Employees know what tasks they are responsible for.",
            "Important business activities follow a consistent process.",
            "I regularly review my business processes.",
            "My business operations continue smoothly even when I am unavailable."
        ],

        "Resource Management": [
            "My business uses its available resources efficiently.",
            "I maintain the equipment and resources required for daily operations.",
            "I avoid unnecessary wastage of resources.",
            "I regularly review resource requirements.",
            "My business has sufficient resources to meet customer demand."
        ],

        "Productivity": [
            "My employees complete their work efficiently.",
            "Daily business activities are completed within expected time.",
            "I monitor productivity in my business.",
            "I identify and remove activities that waste time.",
            "Technology is used where it can improve productivity."
        ],

        "Quality Management": [
            "My products or services consistently meet customer expectations.",
            "I regularly check the quality of my products or services.",
            "Customer complaints are handled quickly.",
            "I take corrective action when quality problems occur.",
            "I continuously look for ways to improve quality."
        ],

        "Process Improvement": [
            "I regularly look for ways to improve business processes.",
            "I listen to employees when they suggest improvements.",
            "I use customer feedback to improve operations.",
            "I am willing to change processes when better methods are available.",
            "My business has improved its processes over the past year."
        ],


        /* ===============================
           CUSTOMER
        =============================== */

        "Customer Satisfaction": [
            "My customers are generally satisfied with my products or services.",
            "I regularly collect customer feedback.",
            "I respond quickly to customer complaints.",
            "I understand the main reasons customers choose my business.",
            "Customers are willing to recommend my business to others."
        ],

        "Target Market": [
            "I clearly understand who my target customers are.",
            "My products or services are designed for a specific customer group.",
            "I understand the needs of my target market.",
            "I regularly study changes in customer preferences.",
            "My business effectively reaches its target customers."
        ],

        "Marketing": [
            "My business has a clear marketing strategy.",
            "I regularly promote my products or services.",
            "I use digital channels effectively to reach customers.",
            "I track the results of my marketing activities.",
            "My marketing activities generate new business opportunities."
        ],

        "Competition": [
            "I regularly monitor my competitors.",
            "I understand what makes my business different from competitors.",
            "My business responds effectively to competitive changes.",
            "I know the strengths and weaknesses of major competitors.",
            "I continuously look for ways to stay competitive."
        ],

        "Customer Retention": [
            "My business has many repeat customers.",
            "I actively maintain relationships with existing customers.",
            "I understand why customers stop buying from my business.",
            "I have strategies to encourage customers to return.",
            "Customer loyalty contributes significantly to my revenue."
        ],


        /* ===============================
           PEOPLE
        =============================== */

        "Team Management": [
            "My employees clearly understand their roles and responsibilities.",
            "I communicate business expectations clearly to my team.",
            "My team works effectively together.",
            "I regularly discuss performance with employees.",
            "My team can handle daily operations effectively."
        ],

        "Skills & Training": [
            "My employees have the skills needed for their jobs.",
            "I provide training when employees need new skills.",
            "I encourage employees to improve their knowledge.",
            "I identify skill gaps in my team.",
            "Training has improved employee performance."
        ],

        "Employee Engagement": [
            "My employees are motivated to perform their work well.",
            "Employees feel valued and respected in my business.",
            "Employees are comfortable sharing ideas and concerns.",
            "I recognize good employee performance.",
            "Employee morale is generally positive."
        ],

        "Leadership": [
            "I communicate a clear direction for my business.",
            "I make decisions confidently when challenges arise.",
            "I take responsibility for important business decisions.",
            "I lead my team by example.",
            "My employees trust my leadership."
        ],

        "Talent Development": [
            "I identify employees who have potential for growth.",
            "I give employees opportunities to take on new responsibilities.",
            "I support employees who want to develop their careers.",
            "I have plans for developing future business leaders.",
            "My business can retain talented employees."
        ],


        /* ===============================
           GROWTH
        =============================== */

        "Business Goals": [
            "My business has clear short-term goals.",
            "My business has clear long-term goals.",
            "I regularly review progress toward my business goals.",
            "My team understands the important goals of the business.",
            "I adjust my goals when business conditions change."
        ],

        "Strategic Planning": [
            "My business has a clear strategic plan.",
            "I regularly review my business strategy.",
            "I consider future market changes when planning.",
            "I use business data to support strategic decisions.",
            "My business strategy is aligned with my long-term goals."
        ],

        "Innovation": [
            "My business regularly looks for new ideas.",
            "I am willing to try new products or services.",
            "I use new technology when it can benefit my business.",
            "I encourage employees to suggest new ideas.",
            "My business adapts when customer needs change."
        ],

        "Growth Opportunities": [
            "I regularly identify new opportunities for business growth.",
            "I understand which markets could offer future growth.",
            "My business has the resources required for expansion.",
            "I consider new products or services for future growth.",
            "I actively look for ways to increase business revenue."
        ],

        "Future Readiness": [
            "My business is prepared for future market changes.",
            "I have plans for handling unexpected business challenges.",
            "My business is adapting to technological changes.",
            "I regularly think about the future direction of my business.",
            "I believe my business is capable of sustainable long-term growth."
        ]

    };


    /* =====================================
       VALIDATE SUBCATEGORY
    ===================================== */

    if (!selectedSubcategory) {

        subcategoryTitle.textContent =
            "No Subcategory Selected";

        subcategoryDescription.textContent =
            "Please go back and select a subcategory.";

        questionText.textContent =
            "No subcategory selected.";

        options.forEach(function (option) {
            option.style.display = "none";
        });

        previousBtn.disabled = true;
        nextBtn.disabled = true;

        return;
    }


    /* =====================================
       CHECK QUESTION AVAILABILITY
    ===================================== */

    if (!questions[selectedSubcategory]) {

        subcategoryTitle.textContent =
            selectedSubcategory;

        questionText.textContent =
            "Questions are not available for this subcategory.";

        options.forEach(function (option) {
            option.style.display = "none";
        });

        previousBtn.disabled = true;
        nextBtn.disabled = true;

        return;
    }


    /* =====================================
       CURRENT QUESTIONS
    ===================================== */

    const currentQuestions =
        questions[selectedSubcategory];


    let currentQuestion = 0;

    let answers = [];


    /* =====================================
       STORAGE KEY
    ===================================== */

    const storageKey =
        "nkpAnswers_" +
        selectedCategory +
        "_" +
        selectedSubcategory;


    /* =====================================
       LOAD SAVED ANSWERS
    ===================================== */

    const savedAnswers =
        localStorage.getItem(storageKey);


    if (savedAnswers) {

        try {

            answers =
                JSON.parse(savedAnswers);

        } catch (error) {

            answers = [];

        }

    }


    /* =====================================
       TITLE
    ===================================== */

    subcategoryTitle.textContent =
        selectedSubcategory;

    subcategoryDescription.textContent =
        "Answer each question based on your current business situation.";


    /* =====================================
       DISPLAY QUESTION
    ===================================== */

    function displayQuestion() {

        const question =
            currentQuestions[currentQuestion];


        questionNumber.textContent =
            "QUESTION " +
            String(currentQuestion + 1).padStart(2, "0");


        questionText.textContent =
            question;


        questionCounter.textContent =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            currentQuestions.length;


        const percentage =
            Math.round(
                (
                    (currentQuestion + 1) /
                    currentQuestions.length
                ) * 100
            );


        progressPercentage.textContent =
            percentage + "%";


        progressFill.style.width =
            percentage + "%";


        /* CLEAR OLD SELECTION */

        options.forEach(function (option) {

            option.classList.remove("selected");

        });


        /* RESTORE SAVED ANSWER */

        if (
            answers[currentQuestion] !== undefined
        ) {

            options.forEach(function (option) {

                if (
                    Number(option.dataset.value) ===
                    Number(answers[currentQuestion])
                ) {

                    option.classList.add("selected");

                }

            });

        }


        /* PREVIOUS BUTTON */

        previousBtn.disabled =
            currentQuestion === 0;


        /* NEXT BUTTON */

        if (
            currentQuestion ===
            currentQuestions.length - 1
        ) {

            nextBtn.textContent =
                "Finish →";

        } else {

            nextBtn.textContent =
                "Next →";

        }


        questionMessage.textContent = "";

    }


    /* =====================================
       OPTION CLICK
    ===================================== */

    options.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                options.forEach(function (item) {

                    item.classList.remove("selected");

                });


                this.classList.add("selected");


                answers[currentQuestion] =
                    Number(this.dataset.value);


                localStorage.setItem(
                    storageKey,
                    JSON.stringify(answers)
                );


                questionMessage.textContent = "";

            }
        );

    });


    /* =====================================
       NEXT / FINISH
    ===================================== */

    nextBtn.addEventListener(
        "click",
        function () {

            /* ===============================
               CHECK ANSWER
            =============================== */

            if (
                answers[currentQuestion] === undefined
            ) {

                questionMessage.textContent =
                    "Please select an answer before continuing.";

                return;

            }


            /* ===============================
               NEXT QUESTION
            =============================== */

            if (
                currentQuestion <
                currentQuestions.length - 1
            ) {

                currentQuestion++;

                displayQuestion();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                return;

            }


            /* ===============================
               SUBCATEGORY COMPLETED
            =============================== */

            localStorage.setItem(
                storageKey,
                JSON.stringify(answers)
            );


            /* =================================
               COMPLETED SUBCATEGORY STORAGE
            ================================= */

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


            /* ===============================
               ADD CURRENT SUBCATEGORY
            =============================== */

            if (
                !completedSubcategories.includes(
                    selectedSubcategory
                )
            ) {

                completedSubcategories.push(
                    selectedSubcategory
                );

            }


            /* ===============================
               SAVE COMPLETED LIST
            =============================== */

            localStorage.setItem(
                completedKey,
                JSON.stringify(
                    completedSubcategories
                )
            );


            console.log(
                "Completed:",
                completedSubcategories
            );


            /* =================================
               ALL SUBCATEGORIES FOR EACH CATEGORY
            ================================= */

            const categorySubcategories = {

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


            const allSubcategories =
                categorySubcategories[selectedCategory] || [];


            /* =================================
               CHECK ALL 5 SUBCATEGORIES
            ================================= */

            const allCompleted =
                allSubcategories.length === 5 &&
                allSubcategories.every(function (subcategory) {

                    return completedSubcategories.includes(
                        subcategory
                    );

                });


            /* =================================
               FINAL NAVIGATION
            ================================= */

            if (allCompleted) {

                console.log(
                    "ALL 5 SUBCATEGORIES COMPLETED"
                );


                window.location.href =
                    "category-score.html";

            } else {

                console.log(
                    "SUBCATEGORY COMPLETED - RETURNING TO SUBCATEGORIES"
                );


                window.location.href =
                    "subcategories.html";

            }

        }
    );


    /* =====================================
       PREVIOUS BUTTON
    ===================================== */

    previousBtn.addEventListener(
        "click",
        function () {

            if (currentQuestion > 0) {

                currentQuestion--;

                displayQuestion();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    /* =====================================
       START
    ===================================== */

    displayQuestion();

});