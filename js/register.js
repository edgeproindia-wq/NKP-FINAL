const API_URL = "https://nkp-final.onrender.com";


const registerForm =
    document.getElementById("registerForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsInput =
    document.getElementById("terms");


const messageBox =
    document.getElementById("registerMessage");

const registerButton =
    document.getElementById("registerButton");

const buttonText =
    document.getElementById("buttonText");


const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


function showMessage(message, type) {

    messageBox.textContent = message;

    messageBox.className =
        "register-message " + type;
}


function clearMessage() {

    messageBox.textContent = "";

    messageBox.className =
        "register-message";
}


function setLoading(isLoading) {

    registerButton.disabled =
        isLoading;

    if (isLoading) {

        buttonText.textContent =
            "Creating Account...";

    } else {

        buttonText.textContent =
            "Create Account";

    }
}


function togglePasswordVisibility(
    input,
    button
) {

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }
}


togglePassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            passwordInput,
            togglePassword
        );

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            confirmPasswordInput,
            toggleConfirmPassword
        );

    }
);


phoneInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value.replace(
                /\D/g,
                ""
            );

        if (this.value.length > 10) {

            this.value =
                this.value.slice(
                    0,
                    10
                );

        }

    }
);


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();


        const fullName =
            fullNameInput.value.trim();


        const email =
            emailInput.value.trim();


        const phone =
            phoneInput.value.trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        if (
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;

        }


        if (phone.length !== 10) {

            showMessage(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            return;

        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;

        }


        if (!termsInput.checked) {

            showMessage(
                "Please accept the Terms of Service and Privacy Policy.",
                "error"
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    `${API_URL}/api/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                name:
                                    fullName,

                                email:
                                    email,

                                phone:
                                    phone,

                                password:
                                    password

                            })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                data.success === false
            ) {

                showMessage(
                    data.message ||
                    "Registration failed. Please try again.",
                    "error"
                );

                setLoading(false);

                return;

            }


            showMessage(
                data.message ||
                "Account created successfully!",
                "success"
            );


            registerButton.disabled =
                true;


            buttonText.textContent =
                "Account Created";


            localStorage.setItem(
                "nkpUserPhone",
                phone
            );


            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1500
            );


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );


            setLoading(false);

        }

    }
);