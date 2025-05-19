var confident = parseInt(window.prompt("How confident are you in your knowledge of the quotes? (0-100)", 50), 10);
var qoutes = []
var qouteIndex = 0;

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

function getQuotes() {
    // Fetch the quotes from quotes.json and return a Promise with the array
    return fetch('quotes.json')
        .then(response => response.json())
        .then(data => data.quotes)
        .catch(error => {
            console.error('Error loading quotes:', error);
            return [];
        });
}

function end() {
    document.writeln("You have completed the task!");
}

function levenshtein(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 100;
    return ((maxLen - distance) / maxLen) * 100;
}

function taskManager(parent) {
    const inputField = parent.querySelector('input[type="text"]');
    function percentMatch(quote, userInput) {
        // Use Levenshtein similarity for robust matching
        return similarity(quote, userInput);
    }

    if (percentMatch(inputField.name, inputField.value) > confident) {
        // correct
        launchConfetti();
        parent.querySelector('button').disabled = true;
        inputField.style.backgroundColor = '#78ff7a';
        inputField.style.color = '#277a29';
        inputField.value = inputField.name;
        inputField.disabled = true;
        if (qouteIndex < qoutes.length - 1) {
            qouteIndex++;
        } else {
            end();
        }
        createTask(qoutes[qouteIndex]);
    } else if (parent.querySelector('button').name === 'help') {
        // incorrect/help
        parent.querySelector('button').disabled = true;
        inputField.style.backgroundColor = '#ff6554';
        inputField.style.color = 'white';
        inputField.value = inputField.name;
        inputField.disabled = true;
        if (qouteIndex < qoutes.length - 1) {
            qouteIndex++;
        } else {
            end();
        }
        createTask(qoutes[qouteIndex]);
    }

}

function createTask(qouteObject) {
    var div = document.createElement('div');
    div.className = 'task';
    div.innerHTML = `<h2>${qouteObject.poem}</h2>
    <p>${qouteObject.analysis}</p>
    <input type="text" placeholder="Fill in the quote" name="${qouteObject.quote}" />
    <button type="button" class="help-btn">?</button>`

    document.getElementById("fill_in_the_qoute").appendChild(div);
    div.querySelector('input[type="text"]').addEventListener('input', function () {
        taskManager(div);
    });
    div.querySelector('.help-btn').addEventListener('click', function () {
        this.name = 'help';
        taskManager(div);
    });
    div.querySelector('input[type="text"]').focus();
}

window.onload = function () {
    getQuotes().then(function (loadedQuotes) {
        qoutes = shuffleArray(loadedQuotes);
        qouteIndex = 0;
        createTask(qoutes[qouteIndex]);
    });
}