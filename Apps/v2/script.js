var fallbackWorkoutData = {
    "push": {
        "bench_press": [[95, 7], [95, 7], [95, 7], [false, false, false]],
        "dips": [[0, 10], [0, 10], [0, 10], [false, false, false]],
        "tricep_pushdown": [[30, 10], [30, 10], [30, 10], [false, false, false]],
        "pec_deck": [[70, 10], [70, 10], [70, 10], [false, false, false]],
        "lateral_cable_raise": [[8, 10], [8, 10], [6, 10], [false, false, false]],
        "rear_delt_row": [[6, 10], [6, 10], [3, 10], [false, false, false]]
    },

    "pull": {
        "lat_row": [[132.5, 10], [132.5, 10], [132.5, 10], [false, false, false]],
        "lat_pulldown": [[85, 10], [85, 10], [85, 10], [false, false, false]],
        "cable_bicep_curl": [[22, 10], [22, 10], [22, 10], [false, false, false]],
        "cable_forearm_curl": [[35, 10], [35, 10], [35, 10], [false, false, false]],
        "cable_forearm_finger_pull": [[35, 10], [35, 10], [35, 10], [false, false, false]],
        "bent_over_row_smith": [[70, 10], [70, 10], [70, 10], [false, false, false]]
    }
}

const debugMode = true

function debug(string) {
    if (debugMode) {
        console.log(string)
    }
}

function saveToLocalStorage(key, obj) {
    try {
        localStorage.setItem(key, JSON.stringify(obj))
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

            setContainer.innerHTML = `<td>${setInfo[0]} kg</td>
                                      <td>${setInfo[1]} reps</td>`

            let td = document.createElement("td")
            td.appendChild(checkbox)
            setContainer.appendChild(td)

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
        item.innerText = workout
        item.onclick = () => {
            displayWorkout(workoutData, workout)
            document.getElementById("WorkoutSelectionScreen").remove()
        }
        container.appendChild(item)
    });

    document.body.appendChild(container)
}

window.onload = () => {
    let workoutData = loadFromLocalStorage("gymAppv1")
    if (workoutData === null) {
        workoutData = fallbackWorkoutData
        debug("Fallback")

    }
    displayWorkoutSelectionScreen(workoutData)
}