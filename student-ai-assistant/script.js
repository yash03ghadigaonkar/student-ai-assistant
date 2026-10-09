// ================================
// PAGE ELEMENTS
// ================================

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


// ================================
// SWITCH TO REGISTER
// ================================

showRegister.addEventListener("click", function (event) {

    event.preventDefault();

    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

});


// ================================
// SWITCH TO LOGIN
// ================================

showLogin.addEventListener("click", function (event) {

    event.preventDefault();

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

});


// ================================
// REGISTER
// ================================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("registerMessage");


    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match!";
        message.style.color = "red";

        return;
    }


    message.textContent = "Creating account...";
    message.style.color = "blue";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {
                    full_name: name
                }

            }

        });


    if (error) {

        message.textContent = error.message;
        message.style.color = "red";

        return;
    }


    message.textContent =
        "Account created successfully! Please check your email.";

    message.style.color = "green";

    registerForm.reset();

});


// ================================
// LOGIN
// ================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("loginMessage");


    message.textContent = "Logging in...";
    message.style.color = "blue";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        message.textContent = error.message;
        message.style.color = "red";

        return;
    }


    message.textContent = "";

    showDashboard(data.user);

});


// ================================
// SHOW DASHBOARD
// ================================

function showDashboard(user) {

    loginSection.classList.add("hidden");

    registerSection.classList.add("hidden");

    dashboardSection.classList.remove("hidden");


    const name =
        user.user_metadata?.full_name;


    document.getElementById("studentName").textContent =
        name || "Student";

}


// ================================
// LOGOUT
// ================================

const logoutButton =
    document.getElementById("logoutButton");


logoutButton.addEventListener("click", async function () {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(error);

        return;
    }


    dashboardSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

});


// ================================
// CHECK EXISTING LOGIN
// ================================

async function checkUser() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        showDashboard(data.session.user);

    }

}


checkUser();


// ================================
// ASK AI
// ================================

const askButton =
    document.getElementById("askButton");

const questionInput =
    document.getElementById("questionInput");


askButton.addEventListener("click", async function () {

    const question =
        questionInput.value.trim();


    if (!question) {

        alert("Please enter a question.");

        return;
    }


    // Show user's question
    addUserMessage(question);


    // Clear input
    questionInput.value = "";


    // Disable button while AI is thinking
    askButton.disabled = true;

    askButton.textContent = "Thinking...";


    try {

        // Send question to our secure backend
        const response = await fetch("/api/ask", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                question: question

            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        // Display Gemini answer
        addAIMessage(data.answer);


    } catch (error) {

        console.error("AI Error:", error);


        addAIMessage(
            "DEBUG ERROR: " + error.message
        );


    } finally {

        // Enable button again
        askButton.disabled = false;

        askButton.textContent = "Ask AI";

    }

});


// ================================
// ADD USER MESSAGE
// ================================

function addUserMessage(question) {

    const chatMessages =
        document.getElementById("chatMessages");


    const message =
        document.createElement("div");


    message.className = "user-message";


    message.innerHTML = `

        <strong>👤 You</strong>

        <p>${escapeHTML(question)}</p>

    `;


    chatMessages.appendChild(message);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// ================================
// ADD AI MESSAGE
// ================================

function addAIMessage(answer) {

    const chatMessages =
        document.getElementById("chatMessages");


    const message =
        document.createElement("div");


    message.className = "ai-message";


    message.innerHTML = `

        <strong>🤖 AI Assistant</strong>

        <p>${escapeHTML(answer)}</p>

    `;


    chatMessages.appendChild(message);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}
