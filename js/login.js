const API_URL = "https://nkp-final.onrender.com";

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const rememberInput = document.getElementById("remember");

const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const buttonText = document.getElementById("buttonText");

const togglePassword = document.getElementById("togglePassword");
const demoButton = document.getElementById("demoButton");

function showMessage(message, type) {
loginMessage.textContent = message;
loginMessage.className = "login-message " + type;
}

function clearMessage() {
loginMessage.textContent = "";
loginMessage.className = "login-message";
}

function setLoading(isLoading) {


loginButton.disabled = isLoading;

if (isLoading) {
    buttonText.textContent = "Signing In...";
} else {
    buttonText.textContent = "Sign In";
}


}

togglePassword.addEventListener("click", function () {


if (passwordInput.type === "password") {

    passwordInput.type = "text";
    togglePassword.textContent = "🙈";

} else {

    passwordInput.type = "password";
    togglePassword.textContent = "👁";

}


});

loginForm.addEventListener("submit", async function (event) {


event.preventDefault();

clearMessage();

const email = emailInput.value.trim();
const password = passwordInput.value;


if (!email || !password) {

    showMessage(
        "Please enter your email and password.",
        "error"
    );

    return;
}


setLoading(true);


try {

    const response = await fetch(`${API_URL}/api/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })

    });


    const data = await response.json();


    if (!response.ok || data.success === false) {

        showMessage(
            data.message || "Invalid email or password.",
            "error"
        );

        setLoading(false);

        return;
    }


    if (data.user) {

        localStorage.setItem(
            "nkpUser",
            JSON.stringify(data.user)
        );

    }


    if (rememberInput.checked) {

        localStorage.setItem(
            "nkpRememberEmail",
            email
        );

    } else {

        localStorage.removeItem("nkpRememberEmail");

    }


    showMessage(
        data.message || "Login successful!",
        "success"
    );


    buttonText.textContent = "Login Successful ✓";


    setTimeout(function () {

        window.location.href = "business-setup.html";

    }, 1000);


} catch (error) {

    console.error("Login Error:", error);

    showMessage(
        "Unable to connect to the server. Please make sure the backend is running.",
        "error"
    );

    setLoading(false);

}


});

demoButton.addEventListener("click", function () {

showMessage(
    "Demo access will be available soon.",
    "success"
);

});

window.addEventListener("DOMContentLoaded", function () {


const savedEmail =
    localStorage.getItem("nkpRememberEmail");

if (savedEmail) {

    emailInput.value = savedEmail;
    rememberInput.checked = true;

}
});
