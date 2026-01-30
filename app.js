// Quiz questions (Tech based)
var questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "None of these"
        ],
        answer: 0
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        answer: 2
    },
    {
        question: "Which is not a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Undefined"],
        answer: 2
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["!-- -->", "//", "#", "**"],
        answer: 1
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Creative Style Sheet",
            "Colorful Style Sheet",
            "Cascading Style Sheet",
            "Computer Style Sheet"
        ],
        answer: 2
    },
    {
        question: "Which company developed JavaScript?",
        options: ["Microsoft", "Netscape", "Google", "Apple"],
        answer: 1
    },
    {
        question: "Which HTML tag is used for JavaScript?",
        options: ["js", "javascript", "script", "code"],
        answer: 2
    },
    {
        question: "Which operator checks value and type?",
        options: ["==", "=", "===", "!="],
        answer: 2
    },
    {
        question: "Which method converts JSON to object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.object()"
        ],
        answer: 0
    },
    {
        question: "Which keyword is used to declare variable in ES5?",
        options: ["let", "const", "var", "define"],
        answer: 2
    }
];

var currentQuestion = 0;
var score = 0;


var startScreen = document.getElementById("startScreen");
var questionEl = document.getElementById("question");
var optionButtons = document.getElementsByClassName("option");
var nextBtn = document.getElementById("nextBtn");
var quizBox = document.getElementById("quiz");
var resultBox = document.getElementById("result");
var finalScore = document.getElementById("finalScore");

loadQuestion();

function loadQuestion() {
    nextBtn.style.display = "none";
    questionEl.innerHTML = questions[currentQuestion].question;

    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerHTML = questions[currentQuestion].options[i];
        optionButtons[i].disabled = false;
        optionButtons[i].style.background = "#f1f1f1";
    }
}

function checkAnswer(selectedIndex) {
    var correctIndex = questions[currentQuestion].answer;
    

    if (selectedIndex === correctIndex) {
        score += 2;
        optionButtons[selectedIndex].style.background = "#bbf7d0";
    } else {
        optionButtons[selectedIndex].style.background = "#efa9a9";
        optionButtons[correctIndex].style.background = "#a4ebbd";
    }

    for (var i = 0; i < optionButtons.length; i++) {
        optionButtons[i].disabled = false
    }

    nextBtn.style.display = "inline-block";
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    finalScore.innerHTML = score + " / 20";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    resultBox.classList.add("hidden");
    quizBox.classList.remove("hidden");
    loadQuestion();
}

