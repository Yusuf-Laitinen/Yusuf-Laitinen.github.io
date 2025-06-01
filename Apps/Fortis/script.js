let moves;
let suitableContentPerMove;
let checkboxContents;
let todayRecordIndex;
let todayWorkoutSheetIndex;



function loadingBar(finished) {
    let loadingBar = document.getElementById("loadingBar");
    if (finished) {
        loadingBar.className = "end"
    } else {
        loadingBar.className = "start"
    }
}

function getDate() {
    var date = new Date();
    var day = String(date.getDate()).padStart(2, "0");
    var month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    var year = date.getFullYear();
    return [day, month, year];
}
function renderDate() {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();
    if (hours > 12) {
        var end = "pm"
    } else {
        var end = "am"
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12; // Midnight case
    }

    document.getElementById("date").innerHTML = `${day} ${months[month - 1]} ${year} at ${hours}:${minutes}${end}`;
}
function generateSubmittableData(workout, content, moveToReplace, newContent, workoutType) {
    let orderedData = {};

    // Always start with Date and Type first
    orderedData["Date"] = getDate().join("/");
    orderedData["Type"] = workoutType;

    // Add each workout in exact order, replacing the specified one if needed
    workout.forEach(exercise => {
        if (exercise === moveToReplace) {
            orderedData[exercise] = newContent;
        } else {
            orderedData[exercise] = content[exercise];
        }
    });

    return orderedData;
}
async function updateMove(node) {
    var newContent = node.dataset.content;
    if (node.dataset.checked === "false") {
        newContent = "";
    }

    loadingBar(false);
    let object = generateSubmittableData(moves, suitableContentPerMove, node.dataset.name, newContent, window.WorkoutType)
    
    moves.forEach((move, index) => {
        if (window.WorkoutSheet[todayWorkoutSheetIndex][move] == "") {
            // exclude freshly modified item from being tampered with
            if (move != node.dataset.name) {
                object[move] = "";
            }
        }
    })

    //update local data
    window.WorkoutSheet[todayWorkoutSheetIndex] = object;

    //update server to match local data.
    await sendData(object, window.WorkoutName, todayWorkoutSheetIndex+2)


    loadingBar(true);

    setLocallyStoredData(
        getDate().join("/"),
        window.SheetNames,
        window.Record,
        window.WorkoutSheet,
        window.WorkoutType,
        window.WorkoutName // <-- PASS THIS TOO
    );
}
function expandCheckbox(checkbox) {
    const parent = checkbox.parentElement;

    let expandArrow, content;
    for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].classList.contains("expandArrow")) {
            expandArrow = parent.children[i];
        } else if (parent.children[i].classList.contains("content")) {
            content = parent.children[i];
        }
    }

    if (content.dataset.expanded === "true") {
        content.dataset.expanded = "false";
        content.style.display = "none";
        expandArrow.style.transform = "rotate(0deg)";
        parent.style.height = "8vw"
    } else {
        content.dataset.expanded = "true";
        content.style.display = "block";
        expandArrow.style.transform = "rotate(90deg)";
        parent.style.height = "20vw"

    }
}
function toggleCheckbox(checkbox) {
    const parent = checkbox.parentElement;

    console.log(parent)

    


    if (parent.dataset.checked === "true") {
        parent.dataset.checked = "false"
        checkbox.src = "src/ui/checkbox_unchecked.svg";
    } else {
        parent.dataset.checked = "true"
        checkbox.src = "src/ui/checkbox_checked.svg";
    }

    updateMove(parent)
}
function addCheckbox(name, content, checked) {
    //trim name to be 21 chars or less. If longer than 21 chars, cut it off and add "..."
    if (name.length > 21) {
        name = name.substring(0, 20) + "...";
    }

    let div = document.createElement("div");
    div.classList = "checkbox";
    div.style.height = "8vw";

    div.dataset.checked = String(checked);
    div.dataset.name = name
    div.dataset.content = content;

    content = content.split('x').map(Number)
    if (div.dataset.checked === "true") {
        div.innerHTML = `
        <img onclick="toggleCheckbox(this)" src="src/ui/checkbox_checked.svg" class="icon">
        <p onclick="expandCheckbox(this)" class="title">${name.replace(/_/g, " ")}</p>
        <img onclick="expandCheckbox(this)" src="src/ui/expandArrow.svg" class="expandArrow">
        <div class="content" data-expanded="false" style="display: none;">
            <p>${content[0]}kg</p>
            <p style="border-right: 2px solid #dcdcdc; border-left: 2px solid #dcdcdc;">${content[1]} reps</p>
            <p>${content[2]} sets</p>

        </div>
        `
    } else {
        div.innerHTML = `
        <img onclick="toggleCheckbox(this)" src="src/ui/checkbox_unchecked.svg" class="icon">
        <p onclick="expandCheckbox(this)" class="title">${name.replace(/_/g, " ")}</p>
        <img onclick="expandCheckbox(this)" src="src/ui/expandArrow.svg" class="expandArrow">
        <div class="content" data-expanded="false" style="display: none;">
            <p>${content[0]}kg</p>
            <p style="border-right: 2px solid #dcdcdc; border-left: 2px solid #dcdcdc;">${content[1]} reps</p>
            <p>${content[2]} sets</p>

        </div>
        `
    }
    document.body.appendChild(div);
}

function get_suitable_excersize_content(workoutRecord, workout) {
    let historicalData = {};
    // Loop from most recent to oldest
    for (let i = workoutRecord.length - 1; i >= 0; i--) {
        for (let j = 0; j < workout.length; j++) {
            const key = String(workout[j]);
            // Only set if not already found (most recent)
            if (historicalData[key] === undefined) {
                const value = workoutRecord[i][key];
                if (value !== undefined && value !== "") {
                    historicalData[key] = value;
                }
            }
        }
    }
    return historicalData;
}

// Main app processes
function boot() {
    renderDate();

    if (window.Record[window.Record.length - 1].Date !== getDate().join("/")) {
        todayRecordIndex = window.Record.length + 2;
    } else {
        todayRecordIndex = window.Record.length + 1;
    }

    todayWorkoutSheetIndex = window.WorkoutSheet.length -1

    moves = Object.keys(window.WorkoutSheet[0]);
    moves.splice(0, 2);

    suitableContentPerMove = get_suitable_excersize_content(window.WorkoutSheet, moves);
    checkboxContents = {};

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const content = suitableContentPerMove[move];
        checkboxContents[move] = content;
    }

    document.getElementById("workoutTitle").innerHTML = window.WorkoutName;

    for (let i = 0; i < moves.length; i++) {
        const key = moves[i];
        let isChecked = false;

        if (window.WorkoutSheet[todayWorkoutSheetIndex][key] === checkboxContents[key]) {
            isChecked = true;
        }

        addCheckbox(key, checkboxContents[key], isChecked);
    }

    loadingBar(true);
}

