// The following mock collection is used to store the details the questions for the quiz.
const questions = [
  {
    question:
      "Which of the following is considered the programming language of the internet?",
    choices: ["JavaScript", "C#", "Algol", "Fortran"],
    answer: "JavaScript",
  },
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
const responseEl = document.getElementById("response");
const advanceColEl = document.querySelector(".advance-col");

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

const generateQuestion = (index) => {
  startTimer();
  currentQuestionIndex = index;
  questionsAsked.push(index);
  const question = questions[currentQuestionIndex];

  // Output question text
  questionEl.textContent = question.question;

  // Output choices
  question.choices.forEach((choice) => {
    value = choice.trim();
    value = choice.toLowerCase();
    const liEl = document.createElement("li");
    liEl.setAttribute("class", "row answer");
    const colEl = document.createElement("div");
    colEl.setAttribute("class", "col-md-12 answer-col");
    colEl.setAttribute("value", value);
    const pEl = document.createElement("p");
    pEl.setAttribute("class", "answer-option");
    pEl.setAttribute("value", value);
    pEl.textContent = choice;
    colEl.appendChild(pEl);
    liEl.appendChild(colEl);
    answerListEl.appendChild(liEl);
  });
  answerListEl.addEventListener("click", checkAnswer);
};

const advanceQuestion = () => {
    // Clean up
    answerListEl.innerHTML = "";
    advanceColEl.innerHTML = "";
    responseEl.textContent = "";

    // Generate question
    generateQuestion(0);
};

const renderAdvanceButton = () => {
    const advanceEl = document.createElement("button");
    advanceEl.setAttribute("class", "btn btn-lg btn-primary");
    advanceEl.setAttribute("id", "advance");
    advanceEl.textContent = "Next question";
    advanceColEl.appendChild(advanceEl);
    advanceEl.addEventListener("click", advanceQuestion);
};

const provideResponse = (isCorrect) => {
  // pause timer
  clearInterval(interval);

  // highlight correct answer
  // highlight wrong answer if !isCorrect
  // correct case
  if (isCorrect) {
    responseEl.style.color = "darkseagreen";
    responseEl.textContent = "Correct!";
  } else {
    // wrong case
    responseEl.style.color = "darksalmon";
    responseEl.textContent = "Incorrect!";
  }
  // render button to advance and generate next question
  renderAdvanceButton();
};

const checkAnswer = (event) => {
  if (event.target.nodeName === "P") {
    answerListEl.removeEventListener("click", checkAnswer);
    event.target.getAttribute("value").toLowerCase() ===
    questions[currentQuestionIndex].answer.toLowerCase()
      ? provideResponse(true)
      : provideResponse(false);
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Global Event listeners


// Main program
generateQuestion(0);
