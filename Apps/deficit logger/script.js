const docID = "18SYnEQu8U5sOEiRlI77C9ObXBGKVgcOfd8Pw6Y2zYXg"

function calculateDeficit(age, height, weight, steps, gymMins, caloriesEaten) {
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    // Activity calories (rough)
    const stepsCalories = steps * 0.04;
    const gymCalories = gymMins * 8;

    const tdee = Math.round(bmr + stepsCalories + gymCalories);

    return (tdee - caloriesEaten)
}

let data = {
    "age": 0,
    "height": 0,
    "weight": 0,
    "steps": 0,
    "gymMins": 0,
    "caloriesEaten": 0
}
let file = ""

window.onload = async function() {
    
    file = await readDocument(docID)
    file = file.split("\n")
    
    let str = '{“16”, “191”,  “110”}';

    // 1. Replace curly quotes with straight quotes
    str = str.replace(/[“”]/g, '"');
    // 2. Change curly braces to square brackets
    str = str.replace(/^\{/, '[').replace(/\}$/, ']');
    // 3. Parse as JSON
    let arr = JSON.parse(str);
    data["age"] = arr[0]
    data["height"] = arr[1]
    data["weight"] = arr[2]

}

async function submitData() {
    document.getElementById("logButton").disabled = true
    document.getElementById("logButton").innerText = "..."
    let steps = parseInt(document.getElementById("steps").value)
    let gym = parseInt(document.getElementById("gym").value)
    let cals = parseInt(document.getElementById("cals").value)

    data["steps"] = steps
    data["gymMins"] = gym
    data["caloriesEaten"] = cals

    let last_value = file[file.length-1]
    let cumalative_calories = last_value - calculateDeficit(
        data["age"],
        data["height"],
        data["weight"],
        data["steps"],
        data["gymMins"],
        data["caloriesEaten"]
    )
    file.push(String(cumalative_calories))
    await writeDocument(docID, file.join("\n"))
    document.getElementById("logButton").innerText = "Done!"

}