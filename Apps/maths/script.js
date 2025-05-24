var questions = []
var questionIndex = 0;

function shuffleArray(array) {
    const result = array.slice(); // Make a copy to avoid modifying the original
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
        [result[i], result[j]] = [result[j], result[i]]; // Swap elements
    }
    return result;
}

function launchConfetti() {
    // Left side
    confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 }
    });
    // Right side
    confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 }
    });
}

function getQuestions() {
    // Fetch the questions from questions.json and return a Promise with the array
    return fetch('questions.json')
        .then(response => response.json())
        .then(data => data.questions) // <-- FIXED HERE
        .catch(error => {
            console.error('Error loading questions:', error);
            return [];
        });
}

function end() {
    document.writeln("You have completed the task!");
}


function taskManager(button) {
    // Get the answer from the <img> name attribute
    var correctAnswer = button.parentElement.parentElement.children[0].name;
    if (button.innerHTML == correctAnswer) {
        button.classList.add('correct');
        launchConfetti();
        setTimeout(() => {
            questionIndex++;
            if (questionIndex < questions.length) {
                createTask(questions[questionIndex]);
            } else {
                end();
            }
        }, 2000);
    } else {
        button.classList.add('incorrect');
        // Do NOT advance to the next question
    }
}

function createTask(qouteObject) {
    var div = document.createElement('div');
    div.className = 'task';
    // Use decoys instead of items
    var items = Array.isArray(qouteObject.decoys) ? qouteObject.decoys.slice() : [];
    items.push(qouteObject.answer);
    items = shuffleArray(items);
    div.innerHTML = `
        <div id="question">
        <img src="${qouteObject.image}" name="${qouteObject.answer}">
        <div>
            <button onclick="taskManager(this);">${items[0]}</button>
            <button onclick="taskManager(this);">${items[1]}</button>
            <button onclick="taskManager(this);">${items[2]}</button>
            <button onclick="taskManager(this);">${items[3]}</button>
        </div>
    </div>`;
    document.body.innerHTML = '';
    document.body.appendChild(div);
}

window.onload = function () {
    getQuestions().then(function (loadedQuestions) {
        questions = shuffleArray(loadedQuestions);
        questionIndex = 0;
        createTask(questions[questionIndex]);
    });
}