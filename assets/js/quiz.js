// The following mock collection is used to store the details the questions for the quiz.
const questions = [
    {
        question: "Which of the following is considered the programming language of the internet?",
        choices: [
            "JavaScript",
            "C#",
            "Algol",
            "Fortran",
        ],
        answer: "JavaScript",
    }
];

// Globals
let interval;
let timer = 10;
let currentQuestionIndex;
let questionsAsked = [];

// Elements
const timerEl = document.getElementById("timer");
const answerListEl = document.getElementById("answer-list");
const questionEl = document.getElementById("question");

// Functions
const startTimer = () => {
    interval = setInterval(() => {
        // Countdown logic
        if (timer > 0) {
            timerEl.textContent = timer;
            timer--;
        } else {
            timerEl.textContent = timer;
            clearInterval(interval);
        }
        // Logic to change color of timer at 10 sec mark
        if (timer < 10 && timer >= 5) {
            timerEl.style.color = "darkturquoise";
        } else if (timer < 5) {
            timerEl.style.color = "crimson";
        } else {
            timerEl.style.color = "inherit";
        }

    }, 1000);
};

const generateQuestion = index => {
    const question = questions[index];

    // Output question text
    questionEl.textContent = question.question;

    // Output choices
    question.choices.forEach(choice => {
        value = choice.trim();
        value = choice.toLowerCase();
        const liEl = document.createElement("li");
        liEl.setAttribute("class", "row answer");
        const colEl = document.createElement("div");
        colEl.setAttribute("class", "col-md-12");
        colEl.setAttribute("value", value);
        const pEl = document.createElement("p");
        pEl.setAttribute("class", "answer-option");
        pEl.setAttribute("value", value);
        pEl.textContent = choice;
        colEl.appendChild(pEl);
        liEl.appendChild(colEl);
        answerListEl.appendChild(liEl);
    });
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Event listeners
answerListEl.addEventListener("click", event => {
    console.log(event.target.getAttribute("value"));
});

// Main program
startTimer();
generateQuestion(0);