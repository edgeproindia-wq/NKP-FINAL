const API_URL = "https://nkp-final.onrender.com";

const emailStep = document.getElementById("emailStep");
const otpStep = document.getElementById("otpStep");
const resetStep = document.getElementById("resetStep");

const emailInput = document.getElementById("email");
const otpInput = document.getElementById("otp");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const emailDisplay = document.getElementById("emailDisplay");

const forgotMessage = document.getElementById("forgotMessage");

const sendOtpButton = document.getElementById("sendOtpButton");
const verifyOtpButton = document.getElementById("verifyOtpButton");
const resetPasswordButton = document.getElementById("resetPasswordButton");

const sendOtpText = document.getElementById("sendOtpText");
const verifyOtpText = document.getElementById("verifyOtpText");
const resetPasswordText = document.getElementById("resetPasswordText");

const resendOtpButton = document.getElementById("resendOtpButton");

const toggleNewPassword = document.getElementById("toggleNewPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

let userEmail = "";
let verificationOtp = "";


/* ================= MESSAGE ================= */

function showMessage(message, type) {
    forgotMessage.textContent = message;
    forgotMessage.className = "forgot-message " + type;
}

function clearMessage() {
    forgotMessage.textContent = "";
    forgotMessage.className = "forgot-message";
}


/* ================= STEP UI ================= */

function updateSteps(activeStep) {

    const steps = document.querySelectorAll(".step");

    steps.forEach((step, index) => {

        if (index < activeStep) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }

    });
}


function showStep(stepNumber) {

    emailStep.classList.add("hidden");
    otpStep.classList.add("hidden");
    resetStep.classList.add("hidden");

    if (stepNumber === 1) {
        emailStep.classList.remove("hidden");
    }

    if (stepNumber === 2) {
        otpStep.classList.remove("hidden");
    }

    if (stepNumber === 3) {
        resetStep.classList.remove("hidden");
    }

    updateSteps(stepNumber);

    clearMessage();
}


/* ================= PASSWORD TOGGLE ================= */

toggleNewPassword.addEventListener("click", function () {

    if (newPasswordInput.type === "password") {

        newPasswordInput.type = "text";
        toggleNewPassword.textContent = "🙈";

    } else {

        newPasswordInput.type = "password";
        toggleNewPassword.textContent = "👁";

    }

});


toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";
        toggleConfirmPassword.textContent = "🙈";

    } else {

        confirmPasswordInput.type = "password";
        toggleConfirmPassword.textContent = "👁";

    }

});


/* ================= OTP ONLY NUMBERS ================= */

otpInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


/* ================= SEND OTP ================= */

emailStep.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessage();

    const email = emailInput.value.trim();

    if (!email) {

        showMessage(
            "Please enter your email address.",
            "error"
        );

        return;
    }


    if (!email.includes("@")) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    sendOtpButton.disabled = true;
    sendOtpText.textContent = "Sending...";


    try {

        const response = await fetch(
            `${API_URL}/api/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data.success === false) {

            showMessage(
                data.message || "Unable to send verification code.",
                "error"
            );

            sendOtpButton.disabled = false;
            sendOtpText.textContent = "Send Verification Code";

            return;
        }


        userEmail = email;

        emailDisplay.textContent = email;

        showMessage(
            data.message || "Verification code sent successfully.",
            "success"
        );


        setTimeout(function () {

            showStep(2);

        }, 800);


    } catch (error) {

        console.error("Forgot Password Error:", error);

        showMessage(
            "Unable to connect to the server. Please make sure the backend is running.",
            "error"
        );

    }


    sendOtpButton.disabled = false;
    sendOtpText.textContent = "Send Verification Code";

});


/* ================= VERIFY OTP ================= */

otpStep.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessage();

    const otp = otpInput.value.trim();


    if (!otp) {

        showMessage(
            "Please enter the verification code.",
            "error"
        );

        return;
    }


    if (otp.length !== 6) {

        showMessage(
            "Please enter the 6-digit verification code.",
            "error"
        );

        return;
    }


    verifyOtpButton.disabled = true;
    verifyOtpText.textContent = "Verifying...";


    try {

        const response = await fetch(
            `${API_URL}/api/verify-reset-otp`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: userEmail,
                    otp: otp
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data.success === false) {

            showMessage(
                data.message || "Invalid or expired verification code.",
                "error"
            );

            verifyOtpButton.disabled = false;
            verifyOtpText.textContent = "Verify Code";

            return;
        }


        verificationOtp = otp;


        showMessage(
            data.message || "Verification successful.",
            "success"
        );


        setTimeout(function () {

            showStep(3);

        }, 700);


    } catch (error) {

        console.error("OTP Verification Error:", error);

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

    }


    verifyOtpButton.disabled = false;
    verifyOtpText.textContent = "Verify Code";

});


/* ================= RESEND OTP ================= */

resendOtpButton.addEventListener("click", async function () {

    if (!userEmail) {
        return;
    }


    resendOtpButton.disabled = true;
    resendOtpButton.textContent = "Sending...";

    clearMessage();


    try {

        const response = await fetch(
            `${API_URL}/api/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: userEmail
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data.success === false) {

            showMessage(
                data.message || "Unable to resend code.",
                "error"
            );

        } else {

            showMessage(
                data.message || "A new verification code has been sent.",
                "success"
            );

            otpInput.value = "";

        }


    } catch (error) {

        console.error("Resend OTP Error:", error);

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

    }


    resendOtpButton.disabled = false;
    resendOtpButton.textContent = "Resend Code";

});


/* ================= RESET PASSWORD ================= */

resetStep.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessage();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    if (!newPassword || !confirmPassword) {

        showMessage(
            "Please enter and confirm your new password.",
            "error"
        );

        return;
    }


    if (newPassword.length < 6) {

        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    resetPasswordButton.disabled = true;
    resetPasswordText.textContent = "Resetting...";


    try {

        const response = await fetch(
            `${API_URL}/api/reset-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: userEmail,
                    otp: verificationOtp,
                    newPassword: newPassword
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data.success === false) {

            showMessage(
                data.message || "Unable to reset password.",
                "error"
            );

            resetPasswordButton.disabled = false;
            resetPasswordText.textContent = "Reset Password";

            return;
        }


        showMessage(
            data.message || "Password reset successfully!",
            "success"
        );


        resetPasswordText.textContent = "Password Reset ✓";


        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);


    } catch (error) {

        console.error("Reset Password Error:", error);

        showMessage(
            "Unable to connect to the server. Please make sure the backend is running.",
            "error"
        );

        resetPasswordButton.disabled = false;
        resetPasswordText.textContent = "Reset Password";

    }

});