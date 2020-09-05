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
  calculatePercentageCorrect: function calculatePercentageCorrect() {
    percent = (this.numCorrect / this.numOfQuestions) * 100;
    return percent;
  },
};

// Globals
let interval;
let timer = 12;
let currentQuestionIndex = 0;
let selectedAnswer = "";

// Elements
const timerEl = document.getElementById("timer");
const answerListEl = document.getElementById("answer-list");
const questionEl = document.getElementById("question");
const responseEl = document.getElementById("response");
const advanceColEl = document.querySelector(".advance-col");
const summaryTitleEl = document.getElementById("summaryModalTitle");
const statTime = document.getElementById("stat-time");
const statPercentEl = document.getElementById("stat-percent");
const statQa = document.getElementById("stat-qa");
const statCa = document.getElementById("stat-ca");
const statWa = document.getElementById("stat-wa");
const statStatus = document.getElementById("stat-status");
const formLeaderboard = document.getElementById("submitLeaderboard");

// Functions
const updateSummaryModalTitle = (status) => {
  summaryTitleEl.textContent = status;
};

const startTimer = () => {
  interval = setInterval(() => {
    // Countdown logic
    if (timer > 0) {
      timerEl.textContent = timer;
      timer--;
    } else {
      timerEl.textContent = timer;
      endQuiz();
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

const showSummary = () => {
  document.getElementById("playerName").value = "";
  $("#summaryModal").modal({ backdrop: "static" });
  $("#summaryModal").modal("show");
};

const endQuiz = () => {
  timer === 0
    ? updateSummaryModalTitle("Time's up!")
    : updateSummaryModalTitle("You're finished!");
  if (quizStats.calculatePercentageCorrect() <= 50 || timer === 0) {
    timer = 0;
    statTime.textContent = "0";
    statStatus.textContent = "Better luck next time :(";
  } else {
    statTime.textContent = timer;
    statStatus.textContent = "Great job!";
  }
  statPercentEl.textContent = `${quizStats.calculatePercentageCorrect()}%`;
  statQa.textContent = quizStats.numOfQuestions;
  statCa.textContent = quizStats.numCorrect;
  statWa.textContent = quizStats.numWrong;
  showSummary();
};

const advanceQuestion = () => {
  // Clean up
  answerListEl.innerHTML = "";
  advanceColEl.innerHTML = "";
  responseEl.textContent = "";
  questionEl.textContent = "";

  // Generate question
  currentQuestionIndex += 1;
  if (currentQuestionIndex < questions.length) {
    generateQuestion(currentQuestionIndex);
  } else {
    endQuiz();
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

// Give options for viewing leaderboard or restarting after submitting high score
const postSubmitHandler = () => {
  formLeaderboard.style.display = "none";
  document.getElementById("modal-footer").style.display = "inherit";
};

// Add score to leaderboard
const addToLeaderboard = (name, time) => {
  const score = {
    name: name,
    time: time,
  };
  // check if scores already exist in leaderboard
  if (localStorage.getItem("scores")) {
    // case if scores exist
    // get items from existing localstorage and put into an array
    const scores = JSON.parse(localStorage.getItem("scores"));
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
  } else {
    // case if no scores exist
    // put score into array and store in localstorage
    const scores = [score];
    localStorage.setItem("scores", JSON.stringify(scores));
  }
};

// Routine for submitting to leaderboard
formLeaderboard.addEventListener("submit", (event) => {
  event.preventDefault();
  addToLeaderboard(document.getElementById("playerName").value, timer);
  postSubmitHandler();
});

// Main program
shuffleQuestionsAndAnswers();
generateQuestion(currentQuestionIndex);
