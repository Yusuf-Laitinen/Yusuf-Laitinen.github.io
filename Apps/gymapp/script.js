const docId = "1rZkYcIw9UEISTkzmuEg1rXVMFiJtuKieMmUFfLEb5y0"

var fallbackWorkoutData = {}

const debugMode = true

function debug(string) {
    if (debugMode) {
        console.log(string)
    }
}

function saveToLocalStorage(key, obj) {
    try {
        localStorage.setItem(key, JSON.stringify(obj))
        debug(obj)
        debug(writeDocument(docId, JSON.stringify(obj)))
    } catch (e) {
        console.error("Error saving to localStorage", e)
    }
}

function loadFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (e) {
        console.error("Error reading from localStorage", e)
        return null
    }
}

function displayWorkout(workoutData, workoutName) {
    const currentWorkout = workoutData[workoutName]

    let container = document.createElement("div")
    container.id = "WorkoutScreen"
    container.innerHTML = `<h1>${workoutName}</h1>`

    // --- Reset button ---
    let resetBtn = document.createElement("button")
    resetBtn.innerText = "Reset Workout"
    resetBtn.onclick = () => {
        if (!confirm("Are you sure you want to reset this workout?")) return

        Object.keys(currentWorkout).forEach(exerciseName => {
            let exerciseData = currentWorkout[exerciseName]
            let doneArray = exerciseData[exerciseData.length - 1]
            for (let i = 0; i < doneArray.length; i++) {
                doneArray[i] = false
            }
        })

        saveToLocalStorage("gymAppv1", workoutData)
        container.remove()
        displayWorkout(workoutData, workoutName)
    }

    // --- Back button ---
    let backBtn = document.createElement("button")
    backBtn.innerText = "Back"
    backBtn.onclick = () => {
        container.remove()
        displayWorkoutSelectionScreen(workoutData)
    }

    // Add buttons to container
    container.appendChild(resetBtn)
    container.appendChild(backBtn)
    // --------------------

    Object.keys(currentWorkout).forEach(exerciseName => {
        let exerciseData = currentWorkout[exerciseName]

        let exerciseContainer = document.createElement("div")
        exerciseContainer.className = "exerciseContainer"
        exerciseContainer.innerHTML = `<h3>${exerciseName}</h3>`

        let dataTable = document.createElement("table")

        for (let setIndex = 0; setIndex < exerciseData.length - 1; setIndex++) {
            let setInfo = exerciseData[setIndex]
            let setDone = exerciseData[exerciseData.length - 1][setIndex]

            let setContainer = document.createElement("tr")

            let checkbox = document.createElement("p")
            checkbox.className = "checkbox"
            checkbox.style.cursor = "pointer"

            if (setDone) {
                checkbox.innerText = "x"
                checkbox.classList.add("true")
            } else {
                checkbox.innerText = "o"
                checkbox.classList.add("false")
            }

            checkbox.onclick = () => {
                let doneArray = exerciseData[exerciseData.length - 1]
                doneArray[setIndex] = !doneArray[setIndex]

                if (doneArray[setIndex]) {
                    checkbox.innerText = "x"
                    checkbox.classList.remove("false")
                    checkbox.classList.add("true")
                } else {
                    checkbox.innerText = "o"
                    checkbox.classList.remove("true")
                    checkbox.classList.add("false")
                }

                saveToLocalStorage("gymAppv1", workoutData)
            }

            let td1 = document.createElement("td")
            let td2 = document.createElement("td")
            let td3 = document.createElement("td")

            td1.innerHTML = `${setInfo[0]} kg`
            td1.contentEditable = true
            td1.inputMode = "numeric"
            td1.className = "kg"
            td1.addEventListener("focus", (e) => {
                const node = e.target
                node.innerHTML = node.innerHTML.split(" ")[0]
            })
            td1.addEventListener("blur", (e) => {
                const node = e.target
                let value = node.innerText.trim()

                if (value === "") {
                    value = "0"
                }

                // update DOM
                node.innerText = value + " " + node.className

                // update data model
                exerciseData[setIndex][0] = parseFloat(value) || 0

                // persist
                saveToLocalStorage("gymAppv1", workoutData)
            })

            td1.addEventListener("input", (e) => {
                console.log("Content changed:", e.target); // or innerHTML
            });
            setContainer.appendChild(td1)


            td2.innerHTML = `${setInfo[1]} reps`
            td2.contentEditable = true
            td2.inputMode = "numeric"
            td2.className = "reps"
            td2.addEventListener("focus", (e) => {
                const node = e.target
                node.innerHTML = node.innerHTML.split(" ")[0]
            })
            td2.addEventListener("blur", (e) => {
                const node = e.target
                let value = node.innerText.trim()

                if (value === "") {
                    value = "0"
                }

                // update DOM
                node.innerText = value + " " + node.className

                // update data model
                exerciseData[setIndex][1] = parseInt(value) || 0

                // persist
                saveToLocalStorage("gymAppv1", workoutData)
            })

            td2.addEventListener("input", (e) => {
                console.log("Content changed:", e.target); // or innerHTML
            });
            setContainer.appendChild(td2)


            td3.appendChild(checkbox)
            setContainer.appendChild(td3)

            dataTable.appendChild(setContainer)
        }

        exerciseContainer.appendChild(dataTable)
        container.appendChild(exerciseContainer)
    })

    document.body.appendChild(container)
}

function displayWorkoutSelectionScreen(workoutData) {
    const names = Object.keys(workoutData)

    let container = document.createElement("div")
    container.id = "WorkoutSelectionScreen"

    names.forEach(workout => {
        let item = document.createElement("button")
        item.className = "button"
        item.innerText = workout
        item.onclick = () => {
            displayWorkout(workoutData, workout)
            document.getElementById("WorkoutSelectionScreen").remove()
        }
        container.appendChild(item)
    });

    let advancedSettings = document.createElement("div")
    advancedSettings.className = "hidden"

    advancedSettings.onclick = () => {
        if (advancedSettings.classList.contains("hidden")) {
            advancedSettings.classList.remove("hidden")
            advancedSettings.classList.add("visible")
        } else {
            advancedSettings.classList.remove("visible")
            advancedSettings.classList.add("hidden")
        }
    }

    advancedSettings.innerHTML = `<button onclick="localStorage.removeItem('gymAppv1')">///</button>`
    container.appendChild(advancedSettings)

    document.body.appendChild(container)
}

window.onload = async () => {
    let workoutData = loadFromLocalStorage("gymAppv1")
    if (workoutData === null) {
        workoutData = await readDocument(docId)
        workoutData = JSON.parse(workoutData)
        saveToLocalStorage("gymAppv1", workoutData)
        debug("Fetched server data")
    }

    debug(workoutData)

    displayWorkoutSelectionScreen(workoutData)
}