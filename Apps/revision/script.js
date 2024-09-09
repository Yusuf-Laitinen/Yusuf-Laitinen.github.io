function randint(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

var data = {};
var answered = [];
var question = {};

window.onload = async () => {
    data = await getData("Sheet1");
    getQuestion();
};

var leftSelection = null;
var rightSelection = null;

var completion = [0, 0];

// Shuffle array utility to shuffle only the values array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function bind(side, value, node) {
    var selectedElements = document.getElementsByClassName("Selected");

    for (let i = 0; i < selectedElements.length; i++) {
        if (side === true) {
            if (selectedElements[i].id !== "") {
                selectedElements[i].classList = "";
            }
        } else {
            if (selectedElements[i].id === "") {
                selectedElements[i].classList = "";
            }
        }
    }

    node.classList.add("Selected");

    if (side === true) {
        leftSelection = [value, node];
    } else {
        rightSelection = [value, node];
    }

    if (leftSelection != null && rightSelection != null) {
        if (leftSelection[0] == rightSelection[0]) {
            leftSelection[1].classList = "Confirmed";
            rightSelection[1].classList = "Confirmed";

            leftSelection[1].onclick = () => {};
            rightSelection[1].onclick = () => {};

            completion[0]++;

            if (completion[0] === completion[1]) {
                setTimeout(function () {
                    getQuestion();
                }, 1000);
            }

        } else {
            leftSelection[1].classList = "Incorrect";
            rightSelection[1].classList = "Incorrect";

            let left = leftSelection[1];
            let right = rightSelection[1];
            setTimeout(function () {
                left.classList = "";
                right.classList = "";
                leftSelection = null;
                rightSelection = null;
            }, 1000);
        }
        // Reset selections after confirming match or incorrect match
        leftSelection = null;
        rightSelection = null;
    }
}

function generateInputs(object) {
    object = JSON.parse(object);

    try {
        document.getElementById("options").remove();
    } catch {}

    var table = document.createElement("table");
    table.id = "options";

    var keys = [];
    var values = [];

    for (let i = 0; i < Object.keys(object).length; i++) {
        let key = Object.keys(object)[i];
        let value = object[Object.keys(object)[i]];

        keys.push(key);
        values.push(value);
    }

    // Shuffle values only to randomize the right column, keeping left column fixed
    let shuffledValues = [...values];
    shuffleArray(shuffledValues);

    for (let i = 0; i < keys.length; i++) {
        let tr = document.createElement("tr");

        let left = document.createElement("td");
        let right = document.createElement("td");

        // Keep the left side (questions) fixed
        left.innerText = keys[i];
        left.id = values[i]; // Set ID to match original correct value

        left.onclick = function () {
            bind(true, this.id, this);
        };

        // Randomize the right side (answers)
        right.innerText = shuffledValues[i]; // Display shuffled values

        right.onclick = function () {
            bind(false, this.innerText, this);
        };

        tr.appendChild(left);
        tr.appendChild(right);
        table.appendChild(tr);
    }

    document.body.appendChild(table);
    completion[1] = keys.length; // Update completion counter to match key length
}

function getQuestion() {
    if (answered.length >= data.length) {
        alert("All questions answered!");
        return; // Prevent further attempts to load more questions
    }

    let index = 0;

    do {
        index = randint(0, data.length);
    } while (answered.includes(index));

    answered.push(index);

    question = data[index];

    document.getElementById("question").src = question["Image"];
    generateInputs(question["Bindings"]);

    // Reset completion count for the current question
    completion[0] = 0;
}
