// The following mock collection is used to store the details the questions for the quiz.
const questions = [
  {
    question:
      "Which of the following is considered the programming language of the internet?",
    choices: ["JavaScript", "C#", "Algol", "Fortran"],
    answer: "JavaScript",
  },
  {
    question: "Which of the following is tags would be used for the header?",
    choices: ["<head>", "<div>", "<header>", "<main>"],
    answer: "<header>",
  },
];

const quizStats = {
  numOfQuestions: 0,
  numWrong: 0,
  numCorrect: 0,
  calculatePercentageCorrect: function calculatePercentage() {
    percent = (this.numCorrect / this.numOfQuestions) * 100;
    return percent;
  },
};

// Globals
let interval;
let timer = 60;
let currentQuestionIndex = 0;
let questionsAsked = [];
let selectedAnswer = "";

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
  quizStats.numOfQuestions++;
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
  currentQuestionIndex += 1;
  if (currentQuestionIndex < questions.length) {
    generateQuestion(currentQuestionIndex);
  } else {
    console.log("We're done!");
    console.log(`[Number of questions:] ${quizStats.numOfQuestions}`);
    console.log(`[Number correct:] ${quizStats.numCorrect}`);
    console.log(`[Number wrong:] ${quizStats.numWrong}`);
    console.log(
      `[Correct percentage:] ${quizStats.calculatePercentageCorrect()}%`
    );
  }
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
  const correctEl = document.querySelector(
    "[value='" + questions[currentQuestionIndex].answer.toLowerCase() + "']"
  );
  correctEl.style.backgroundColor = "darkseagreen";
  correctEl.style.textDecoration = "underline";

  // highlight wrong answer if !isCorrect
  if (!isCorrect) {
    const selectedEl = document.querySelector(
      "[value='" + selectedAnswer.toLowerCase() + "']"
    );
    selectedEl.style.backgroundColor = "darksalmon";
    selectedEl.style.textDecoration = "line-through";
  }

  // correct case
  if (isCorrect) {
    timer += 5;
    quizStats.numCorrect++;
    timerEl.textContent = timer;
    responseEl.style.color = "darkseagreen";
    responseEl.textContent = "Correct!";
  } else {
    // wrong case
    timer -= 5;
    quizStats.numWrong++;
    timerEl.textContent = timer;
    responseEl.style.color = "darksalmon";
    responseEl.textContent = "Incorrect!";
  }
  // render button to advance and generate next question
  renderAdvanceButton();
};

const checkAnswer = (event) => {
  if (event.target.nodeName === "P") {
    selectedAnswer = event.target.getAttribute("value").toLowerCase();
    answerListEl.removeEventListener("click", checkAnswer);
    event.target.getAttribute("value").toLowerCase() ===
    questions[currentQuestionIndex].answer.toLowerCase()
      ? provideResponse(true)
      : provideResponse(false);
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const shuffleQuestionsAndAnswers = () => {
  // Shuffle questions array
  shuffleArray(questions);
  // Shuffle choices in each question
  questions.forEach((question) => {
    shuffleArray(question.choices);
  });
};

// Main program
shuffleQuestionsAndAnswers();
generateQuestion(currentQuestionIndex);
