
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("businessSetupForm");
    const message = document.getElementById("businessMessage");
    const continueButton = document.getElementById("continueButton");
    const buttonText = document.getElementById("buttonText");

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "business-message " + type;
    }

    function resetAssessmentProgress() {

        const keysToRemove = [
            "nkpSelectedCategory",
            "nkpSelectedSubcategory",
            "nkpSelectedSubcategoryIndex",
            "nkpCategoryScores",
            "nkpOverallScore",
            "assessmentAnswers"
        ];

        keysToRemove.forEach(function (key) {
            localStorage.removeItem(key);
        });

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

            for (let i = 1; i <= 5; i++) {
                localStorage.removeItem(
                    "nkpAnswers_" + category + "_" + i
                );
            }
        });
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const businessName =
            document.getElementById("businessName").value.trim();

        const businessType =
            document.getElementById("businessType").value;

        const industry =
            document.getElementById("industry").value;

        const yearsInBusiness =
            document.getElementById("yearsInBusiness").value;

        const employees =
            document.getElementById("employees").value;

        const street =
            document.getElementById("street").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const state =
            document.getElementById("state").value.trim();

        const monthlyRevenue =
            document.getElementById("monthlyRevenue").value;

        const monthlyExpenses =
            document.getElementById("monthlyExpenses").value;

        if (
            !businessName ||
            !businessType ||
            !industry ||
            yearsInBusiness === "" ||
            employees === "" ||
            !street ||
            !city ||
            !state ||
            monthlyRevenue === "" ||
            monthlyExpenses === ""
        ) {
            showMessage(
                "Please fill in all required fields.",
                "error"
            );
            return;
        }

        if (
            Number(yearsInBusiness) < 0 ||
            Number(yearsInBusiness) > 100 ||
            Number(employees) < 1 ||
            Number(monthlyRevenue) < 0 ||
            Number(monthlyExpenses) < 0
        ) {
            showMessage(
                "Please enter valid business and financial information.",
                "error"
            );
            return;
        }

        const businessData = {
            businessName: businessName,
            businessType: businessType,
            industry: industry,
            yearsInBusiness: Number(yearsInBusiness),
            employees: Number(employees),
            street: street,
            city: city,
            state: state,
            location: [street, city, state].join(", "),
            monthlyRevenue: Number(monthlyRevenue),
            monthlyExpenses: Number(monthlyExpenses)
        };

        try {

            localStorage.setItem(
                "nkpBusiness",
                JSON.stringify(businessData)
            );

            resetAssessmentProgress();

            continueButton.disabled = true;
            buttonText.textContent = "Saving...";

            showMessage(
                "Business information saved successfully!",
                "success"
            );

            setTimeout(function () {
                window.location.href = "categories.html";
            }, 700);

        } catch (error) {

            console.error("Business Setup Error:", error);

            continueButton.disabled = false;
            buttonText.textContent = "Continue to Assessment";

            showMessage(
                "Unable to save business information. Please try again.",
                "error"
            );

        }

    });

});