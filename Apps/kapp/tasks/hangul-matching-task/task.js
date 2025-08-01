var letters = {
    "ㄱ": "g",
    "ㄲ": "kk",
    "ㄴ": "n",
    "ㄷ": "d",
    "ㄸ": "tt",
    "ㄹ": "r",
    "ㅁ": "m",
    "ㅂ": "b",
    "ㅃ": "pp",
    "ㅅ": "s",
    "ㅆ": "ss",
    "ㅇ": "ng",
    "ㅈ": "j",
    "ㅉ": "jj",
    "ㅊ": "ch",
    "ㅋ": "k",
    "ㅌ": "t",
    "ㅍ": "p",
    "ㅎ": "h",
    "ㅏ": "a",
    "ㅐ": "ae",
    "ㅑ": "ya",
    "ㅒ": "yae",
    "ㅓ": "eo",
    "ㅔ": "e",
    "ㅕ": "yeo",
    "ㅖ": "ye",
    "ㅗ": "o",
    "ㅘ": "wa",
    "ㅙ": "wae",
    "ㅚ": "oe",
    "ㅛ": "yo",
    "ㅜ": "u",
    "ㅝ": "wo",
    "ㅞ": "we",
    "ㅟ": "wi",
    "ㅠ": "yu",
    "ㅡ": "eu",
    "ㅢ": "ui",
    "ㅣ": "i"
}

var numbers_passed = []

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_task() {
    //generate random number
    var rng
    do {
        rng = getRandomInt(0, 39)
    } while (numbers_passed.includes(rng) === true)
    numbers_passed.push(rng)

    //define letters
    var hangulLetter = Object.keys(letters)[rng]
    var romanLetter = letters[hangulLetter]

    var decoys = []

    for (let i = 0; i < 3; i++) {
        var n
        do {
            n = getRandomInt(0, 39)
        } while (n === rng || decoys.includes(letters[Object.keys(letters)[n]]))

        decoys.push(letters[Object.keys(letters)[n]])
    }

    //insert answer to random index
    decoys.splice(getRandomInt(0, 3), 0, romanLetter);

    //create button stack
    var buttonStack = ""

    decoys.forEach(letter => {
        if (letter === romanLetter) {
            buttonStack = `${buttonStack}\n<button onclick=nextTask(true)>${romanLetter}</button>`
        } else {
            buttonStack = `${buttonStack}\n<button onclick=nextTask(false)>${letter}</button>`
        }
    });

    //create elements
    let task_div = document.createElement("div")
    task_div.innerHTML = `<h1 id="hangul_letter">${hangulLetter}</h1>${buttonStack}`
    task_div.id = "task_div"
    document.body.append(task_div)
}

function nextTask(correct) {
    if (correct === true) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        document.getElementById("task_div").remove()
        create_task()
    } else {
        document.getElementById("overlay").style.display = "block"
        setTimeout(() => {
            document.getElementById("overlay").style.display = "none"
        }, 200)
    }

}

window.onload = () => {
    create_task()
}