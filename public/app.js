// Firebase Configuration (ES5 STYLE)
var firebaseConfig = {
    apiKey: "AIzaSyAegbZTab2Mzq5G5o8mdLA1RrGPe1ws2Pw",
    authDomain: "quiz-app-a5371.firebaseapp.com",
    projectId: "quiz-app-a5371",
    databaseURL: "https://quiz-app-a5371-default-rtdb.firebaseio.com",
    storageBucket: "quiz-app-a5371.firebasestorage.app",
    messagingSenderId: "738948155670",
    appId: "1:738948155670:web:ce910de2c6fe535b03a837"
};

// Initialize Firebase (Using Compat Version)
var app = firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.database();

// Quiz questions
var questions = [
    {
        question: "Q1: What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "None of these"
        ],
        answer: 0
    },
    {
        question: "Q2: Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        answer: 2
    },
    {
        question: "Q3: Which is not a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Undefined"],
        answer: 2
    },
    {
        question: "Q4: Which symbol is used for comments in JavaScript?",
        options: ["!-- -->", "//", "#", "**"],
        answer: 1
    },
    {
        question: "Q5: What does CSS stand for?",
        options: [
            "Creative Style Sheet",
            "Colorful Style Sheet",
            "Cascading Style Sheet",
            "Computer Style Sheet"
        ],
        answer: 2
    },
    {
        question: "Q6: Which company developed JavaScript?",
        options: ["Microsoft", "Netscape", "Google", "Apple"],
        answer: 1
    },
    {
        question: "Q7: Which HTML tag is used for JavaScript?",
        options: ["js", "javascript", "script", "code"],
        answer: 2
    },
    {
        question: "Q8: Which operator checks value and type?",
        options: ["==", "=", "===", "!="],
        answer: 2
    },
    {
        question: "Q9: Which method converts JSON to object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.object()"
        ],
        answer: 0
    },
    {
        question: "Q10: Which keyword is used to declare variable in ES5?",
        options: ["let", "const", "var", "define"],
        answer: 2
    }
];

var currentQuestion = 0;
var score = 0;
var currentUser = null;

// DOM Elements
var questionEl = document.getElementById("question");
var optionButtons = [
    document.getElementById("opt0"),
    document.getElementById("opt1"),
    document.getElementById("opt2"),
    document.getElementById("opt3")
];
var nextBtn = document.getElementById("nextBtn");
var quizBox = document.getElementById("quiz");
var resultBox = document.getElementById("result");
var finalScore = document.getElementById("finalScore");
var restartBtn = document.getElementById("restartBtn");
var quizContainer = document.querySelector(".quiz-container");

// Auth Elements
var authModal = document.getElementById("authModal");
var loginIconBtn = document.getElementById("loginIconBtn");
var userInfo = document.getElementById("userInfo");
var userDisplayName = document.getElementById("userDisplayName");
var logoutBtn = document.getElementById("logoutBtn");
var closeModal = document.querySelector(".close-modal");
var loginForm = document.getElementById("loginForm");
var signupForm = document.getElementById("signupForm");
var toSignup = document.getElementById("toSignup");
var toLogin = document.getElementById("toLogin");

// Auth Inputs
var loginEmail = document.getElementById("loginEmail");
var loginPass = document.getElementById("loginPass");
var signupName = document.getElementById("signupName");
var signupEmail = document.getElementById("signupEmail");
var signupPass = document.getElementById("signupPass");

// --- Quiz Logic ---

function loadQuestion() {
    nextBtn.style.display = "none";
    questionEl.innerHTML = questions[currentQuestion].question;

    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerHTML = questions[currentQuestion].options[i];
        optionButtons[i].disabled = false;
        optionButtons[i].classList.remove("correct", "wrong");
    }
}

function checkAnswer(selectedIndex) {
    var correctIndex = questions[currentQuestion].answer;

    if (selectedIndex === correctIndex) {
        score += 2;
        optionButtons[selectedIndex].classList.add("correct");
    } else {
        optionButtons[selectedIndex].classList.add("wrong");
        optionButtons[correctIndex].classList.add("correct");
    }

    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].disabled = true;
    }

    nextBtn.style.display = "inline-block";
}

function showResult() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    finalScore.innerHTML = score + " / 20";

    if (currentUser) {
        console.log("Saving score for:", currentUser.uid);

        // Simple path: scores/userID
        var userScoresRef = db.ref("scores/" + currentUser.uid);

        userScoresRef.push({
            userName: currentUser.displayName || currentUser.email,
            userScore: score,
            maxScore: 20,
            dateTime: new Date().toLocaleString(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function () {
            console.log("Database update successful");
            alert("✓ Score saved to Database!");
        }).catch(function (error) {
            console.error("Database Write Error:", error);
            alert("❌ Database Error: " + error.message + "\n\nMake sure Realtime Database Rules are set to true.");
        });
    } else {
        alert("Sign in to save your score permanently!");
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    resultBox.classList.add("hidden");
    quizBox.classList.remove("hidden");
    loadQuestion();
}

// Event Listeners
for (var j = 0; j < optionButtons.length; j++) {
    (function (index) {
        optionButtons[index].addEventListener("click", function () {
            checkAnswer(index);
        });
    })(j);
}

nextBtn.addEventListener("click", function () {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

restartBtn.addEventListener("click", restartQuiz);

// --- Auth Logic ---

auth.onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        loginIconBtn.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userDisplayName.innerText = user.displayName || user.email.split('@')[0];
        authModal.classList.add("hidden");

        // UI Access Control
        quizContainer.classList.remove("hidden");
        loadQuestion();
    } else {
        currentUser = null;
        loginIconBtn.classList.remove("hidden");
        userInfo.classList.add("hidden");

        // UI Access Control
        quizContainer.classList.add("hidden");
        authModal.classList.remove("hidden");
    }
});

loginIconBtn.onclick = function () {
    authModal.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
};

closeModal.onclick = function () {
    authModal.classList.add("hidden");
};

window.onclick = function (event) {
    if (event.target == authModal) {
        authModal.classList.add("hidden");
    }
};

toSignup.onclick = function (e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
};

toLogin.onclick = function (e) {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
};

signupForm.onsubmit = function (e) {
    e.preventDefault();
    var email = signupEmail.value;
    var password = signupPass.value;
    var name = signupName.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            return userCredential.user.updateProfile({ displayName: name });
        })
        .then(function () {
            alert("Account created successfully!");
        })
        .catch(function (error) {
            alert(error.message);
        });
};

loginForm.onsubmit = function (e) {
    e.preventDefault();
    var email = loginEmail.value;
    var password = loginPass.value;

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            alert("Logged in successfully!");
        })
        .catch(function (error) {
            alert(error.message);
        });
};

logoutBtn.onclick = function () {
    auth.signOut().then(function () {
        alert("Logged out!");
    }).catch(function (error) {
        alert(error.message);
    });
};

// Removed: Start Quiz (Logic moved to onAuthStateChanged)
