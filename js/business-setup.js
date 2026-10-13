
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("businessSetupForm");
    const message = document.getElementById("businessMessage");
    const continueButton = document.getElementById("continueButton");
    const buttonText = document.getElementById("buttonText");

    // Check required page elements
    if (!form || !message || !continueButton || !buttonText) {
        console.error("NKP Business Setup: Required HTML elements are missing.");
        return;
    }

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

            localStorage.removeItem("nkpCategoryScore_" + category);

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

        // Prevent duplicate submissions
        if (continueButton.disabled) {
            return;
        }

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

        // Validate the fields that actually exist in your HTML
        if (
            !businessName ||
            !businessType ||
            !industry ||
            yearsInBusiness === "" ||
            employees === "" ||
            !street ||
            !city ||
            !state
        ) {
            showMessage(
                "Please fill in all required fields.",
                "error"
            );
            return;
        }

        if (
            !Number.isFinite(Number(yearsInBusiness)) ||
            Number(yearsInBusiness) < 0 ||
            Number(yearsInBusiness) > 100 ||
            !Number.isInteger(Number(employees)) ||
            Number(employees) < 1
        ) {
            showMessage(
                "Please enter valid business information.",
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
            location: [street, city, state].join(", ")
        };

        const originalButtonText = buttonText.textContent;

        continueButton.disabled = true;
        buttonText.textContent = "Saving...";

        try {

            // Save business information
            localStorage.setItem(
                "nkpBusiness",
                JSON.stringify(businessData)
            );

            // Start a fresh assessment only after valid details are saved
            resetAssessmentProgress();

            showMessage(
                "Business information saved successfully! Opening assessment...",
                "success"
            );

            window.location.href = "categories.html";

        } catch (error) {

            console.error("NKP Business Setup Error:", error);

            continueButton.disabled = false;
            buttonText.textContent = originalButtonText;

            showMessage(
                "Unable to save information. Please check browser storage and try again.",
                "error"
            );
        }

    });

});
