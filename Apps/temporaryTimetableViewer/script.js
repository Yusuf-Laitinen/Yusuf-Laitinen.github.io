const timetable = {
    "monday" : {
        "subjects" : ["Product design", "Physics", "", "", "Maths", "Further maths"],
        "rooms" : ["G03", "F05", "", "", "S04", "S04", "S02"]
    },
    "tuesday" : {
        "subjects" : ["", "Physics", "Further maths", "Product design", "Product design", "Maths"],
        "rooms" : ["", "F02", "S02", "G03", "G06", "S04"]
    },
    "wednesday" : {
        "subjects": ["", "Further maths", "Further maths", "Product design", "", "Physics", "Physics"],
        "rooms" : ["", "S02", "S02", "G03", "", "F05", "F05"]
    },
    "thursday" : {
        "subjects": ["Further maths", "Maths", "Product design", "Profile teams", "Further maths", "Maths", "Maths"],
        "rooms" : ["S02", "S05", "G06", "F04", "S02", "S04", "S04"]
    },
    "friday" : {
        "subjects": ["Physics", "Physics", "Maths", "Product design", "Professional Studies", ""],
        "rooms" : ["F02", "F02", "S05", "G03", "S08", ""]
    }
}

let timeIntervals = {
    "period-1" : ["8:45", "9:35"],
    "period-2" : ["9:35", "10:25"],
    "period-3" : ["10:45", "11:35"], 
    "period-4" : ["11:35", "12:25"],
    "period-5" : ["12:55", "13:45"],
    "period-6" : ["13:45", "14:35"],
    "period-7" : ["14:35", "15:25"]
};

function isTimeInRange(startTime, endTime, checkTime) {
    // Helper: convert "HH:MM" to minutes since midnight
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const check = timeToMinutes(checkTime);

    // Handles ranges that cross midnight
    if (start <= end) {
        return check >= start && check <= end;
    } else {
        return check >= start || check <= end;
    }
}

function createSlot(subject, room, starttime, endtime) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}`

    let slot = document.createElement("div");

    slot.className = "slot";

    if (isTimeInRange(starttime, endtime, time)) {
        slot.style.backgroundColor = "#2c2c2cff"
    }

    if (subject === null) {
        slot.innerHTML = `
            <div class="time">
                <img src="assets/clock_icon.svg">
                <p>${starttime} - ${endtime}</p>
            </div>
        `;
    } else {
        slot.innerHTML = `
            <h4>${subject}</h4>
            <p>${room}</p>
            <div class="time">
                <img src="assets/clock_icon.svg">
                <p>${starttime} - ${endtime}</p>
            </div>
        `;
    }

    document.body.appendChild(slot);
}

window.onload = async () => {

    const date = new Date();
    //const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const dayIndex = 1 //debug

    const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    if (dayIndex >= 1 && dayIndex <= 5) {
        let todayData = timetable[dayNames[dayIndex - 1]];

        let lessons = todayData["subjects"]
        let rooms = todayData["rooms"]

        for (let i=0; i<lessons.length; i++) {
            if (i === 2 || i === 4) {
                createSlot(null, null, timeIntervals[`period-${i}`][1], timeIntervals[`period-${i+1}`][0])
            }
            createSlot(lessons[i], rooms[i], timeIntervals[`period-${i+1}`][0], timeIntervals[`period-${i+1}`][1])
        }
        
    } else {
        document.writeln("Weekend");
    }
};
