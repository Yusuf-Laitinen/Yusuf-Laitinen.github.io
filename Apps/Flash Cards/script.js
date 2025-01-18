// Global Variables
let questions = [];
let originalQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let answers = [];
let wrongAnswers = [];
let autoNavigationTimer = null;

let _subject = "";

let loader = document.getElementById("loader");

function _compare(objectA, objectB) {

    if (objectA.ID === objectB.ID) {
        return true;
    } else {
        return false;
    }
}

function _findIndex(questions, question) {
    for (let i = 0; i < questions.length; i++) {
        if (_compare(questions[i], question)) {
            return i;
        }
    }
    return -1;
}


function discardFlaggedQuestions(questions) {
    //function filters list and discards flagged questions
    let newQuestions = JSON.parse(JSON.stringify(questions));
    newQuestions = newQuestions.filter(question => !question.Flagged || question.Flagged === "");
    return newQuestions;
}

function isURL(str) {
    return str.startsWith("http");
}
function _startLoadingBar() {
    document.getElementById("loadingBar").className = "load50"
}

function _endLoadingBar() {
    document.getElementById("loadingBar").className = "load100"
}

async function loadSubjects() {
    _startLoadingBar()
    loader.style.display = "block";
    const subjectsDiv = document.getElementById("subjects");
    subjectsDiv.innerHTML = "";
    const subjects = await getSheetNames();
    subjects.forEach((subject) => {
        const button = document.createElement("button");
        button.textContent = subject;
        button.addEventListener("click", function () {
            startQuiz(subject)
            _subject = subject
        });
        subjectsDiv.appendChild(button);
    });
    loader.style.display = "none";
    _endLoadingBar()
}

async function startQuiz(subject) {
    _startLoadingBar()
    loader.style.display = "block";
    questions = await getData(subject);
    questions.forEach((q) => {
        q.selected = null; // Track selected answers
    });
    originalQuestions = JSON.parse(JSON.stringify(questions));  // Make a deep copy
    questions = discardFlaggedQuestions(questions);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    totalQuestions = questions.length;
    wrongAnswers = [];
    answers = [];

    document.getElementById("subject-selection").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
    loader.style.display = "none";
    _endLoadingBar()
}

async function flagQuestion() {
    _startLoadingBar()

    // Disable the flag button
    document.getElementById("flag-question").disabled = true;

    let question = JSON.parse(JSON.stringify(questions));  // Make a deep copy
    question[currentQuestionIndex].Flagged = true; // Flag the question
    delete question.trueIndex;
    await sendData(question[currentQuestionIndex], _subject, questions[currentQuestionIndex].ID + 2);

    questions = discardFlaggedQuestions(question);

    currentQuestionIndex--;
    // Move to the next question
    moveToNextQuestion();
    _endLoadingBar()
}

function showQuestion() {
    if (autoNavigationTimer) clearTimeout(autoNavigationTimer); // Clear any pending auto-navigation

    const questionObj = questions[currentQuestionIndex];
    const optionsDiv = document.getElementById("options");
    const questionElement = document.getElementById("question");

    // Display either text or image question
    if (isURL(questionObj.Question)) {
        questionElement.innerHTML = `<img src="${questionObj.Question}" style="max-width: 100%">`;
    } else {
        questionElement.textContent = questionObj.Question;
    }

    optionsDiv.innerHTML = ""; // Clear previous options

    if (questionObj.selected === null) {
        // Unanswered question: show options as buttons without randomizing
        const options = [questionObj.Answer, ...JSON.parse(questionObj.Decoys)];
        options.forEach((option) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.addEventListener("click", () => checkAnswer(option, questionObj));
            optionsDiv.appendChild(button);
        });
    } else {
        // Answered question: show text options with highlights
        const options = [questionObj.Answer, ...JSON.parse(questionObj.Decoys)];
        options.forEach((option) => {
            const text = document.createElement("p");
            text.className = "none"
            text.textContent = option;
            if (option === questionObj.selected) text.className = "incorrect"; // Selected answer
            if (option === questionObj.Answer) text.className = "correct"; // Correct answer
            optionsDiv.appendChild(text);
        });
    }

    updateNavigationButtons();
}

function checkAnswer(selected, questionObj) {
    if (autoNavigationTimer) clearTimeout(autoNavigationTimer);

    const buttons = document.querySelectorAll("#options button");
    buttons.forEach((button) => {
        if (button.textContent === selected) {
            if (selected === questionObj.Answer) {
                button.classList.add("correct");
                correctAnswers++;
            } else {
                button.classList.add("incorrect");
                wrongAnswers.push({ question: questionObj, selected });
            }
        } else if (button.textContent === questionObj.Answer) {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    questionObj.selected = selected;
    answers.push({ question: questionObj, selected }); // Add to answers array

    autoNavigationTimer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            endQuiz();
        }
    }, 2000);
}

function moveToNextQuestion() {
    document.getElementById("flag-question").disabled = false; // Enable the flag button
    // Skip flagged questions by moving to the next unflagged one
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        endQuiz();
    }
}

function updateNavigationButtons() {
    const prevButton = document.getElementById("prev-question");
    const nextButton = document.getElementById("next-question");

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;

    prevButton.onclick = () => {
        if (autoNavigationTimer) clearTimeout(autoNavigationTimer); // Cancel auto-navigation
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    };

    nextButton.onclick = () => {
        if (autoNavigationTimer) clearTimeout(autoNavigationTimer); // Cancel auto-navigation
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        }
    };
}

function stopQuiz() {
    if (autoNavigationTimer) clearTimeout(autoNavigationTimer); // Clear any pending auto-navigation

    const questionsAnswered = correctAnswers + wrongAnswers.length;
    const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(2) : "0.00";

    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "block";

    // Display accuracy
    document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`;

    // Create visual review bar
    const reviewDiv = document.getElementById("review");
    reviewDiv.innerHTML = "<h3>Review:</h3>";

    const reviewBar = document.createElement("div");
    reviewBar.style.display = "flex";
    reviewBar.style.gap = "4px";
    reviewBar.style.marginBottom = "16px";

    for (let i = 0; i < totalQuestions; i++) {
        const square = document.createElement("div");
        square.style.width = "20px";
        square.style.height = "20px";

        const question = questions[i];
        const answer = answers.find(ans => ans.question === question);

        if (answer) {
            if (wrongAnswers.some(wrongAnswer => wrongAnswer.question === question)) {
                square.style.backgroundColor = "red"; // Wrong answer
            } else {
                square.style.backgroundColor = "green"; // Correct answer
            }
        } else {
            square.style.backgroundColor = "gray"; // Not answered
        }

        reviewBar.appendChild(square);
    }

    reviewDiv.appendChild(reviewBar);

    // Show detailed review of wrong answers
    wrongAnswers.forEach(({ question, selected }) => {
        const questionIndex = questions.indexOf(question); // Get the index of the question in the questions array
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";
        reviewItem.id = "Q" + (questionIndex + 1);
        reviewItem.innerHTML = `
          <p><strong>Q${questionIndex + 1}:</strong> ${question.Question}</p>
          <p><strong>Your Answer:</strong> <span style="color: red">${selected}</span></p>
          <p><strong>Correct Answer:</strong> <span style="color: green">${question.Answer}</span></p>
        `;
        reviewDiv.appendChild(reviewItem);
    });

    // Add home button
    const homeButton = document.createElement("button");
    homeButton.textContent = "Home";
    homeButton.addEventListener("click", () => {
        document.getElementById("results").style.display = "none";
        document.getElementById("subject-selection").style.display = "block";
    });
    reviewDiv.appendChild(homeButton);
}

function backToHome() {
    document.getElementById("quizMenu").style.display = "none";
    document.getElementById("homeMenu").style.display = "block";
}

function doQuiz() {
    document.getElementById("homeMenu").style.display = "none";
    document.getElementById("quizMenu").style.display = "block";
    loadSubjects();
}

document.getElementById("stop-quiz").addEventListener("click", stopQuiz);
document.getElementById("flag-question").addEventListener("click", flagQuestion);
