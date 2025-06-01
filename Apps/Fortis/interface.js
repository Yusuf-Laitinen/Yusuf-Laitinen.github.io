function getLocallyStoredData() {
    const cached = localStorage.getItem('fortisCachedData');
    if (!cached) {
        return null;
    }
    try {
        return JSON.parse(cached);
    } catch (e) {
        console.error("Error parsing cachedData from localStorage:", e);
        return null;
    }
}
function setLocallyStoredData(Date, SheetNames, Record, WorkoutSheet, WorkoutType, WorkoutName) {
    const dataToStore = {
        Date: Date,
        SheetNames: SheetNames,
        Record: Record,
        WorkoutSheet: WorkoutSheet,
        WorkoutType: WorkoutType,
        WorkoutName: WorkoutName // <-- ADD THIS
    };
    localStorage.setItem('fortisCachedData', JSON.stringify(dataToStore));
}

function today_workout_name(record, workouts) {
    let lastDoneWorkout = record[record.length - 1].Workout
    let currentWorkoutIndex = (workouts.indexOf(lastDoneWorkout) + 1) % workouts.length; // Get the index
    return workouts[currentWorkoutIndex]; // Return the workout name    
}


async function serverWizard() {
        window.SheetNames = (await getSheetNames()).filter(
            name => name !== "_Record" && name !== "_Exercises"
        );

        window.Record = await getData("_Record")
        window.WorkoutName = today_workout_name(window.Record, window.SheetNames);

        console.log(window.Record)
        console.log(window.SheetNames)
        console.log(WorkoutName)

        window.WorkoutSheet = await getData(window.WorkoutName);

        //create today's entry if it doesn't exist
        if (window.WorkoutSheet[window.WorkoutSheet.length - 1].Date != getDate().join("/")) {
            let moves = Object.keys(window.WorkoutSheet[0])
            let emptyObject = {};
            moves.forEach(move => {
                emptyObject[move] = "";
            })
            emptyObject["Date"] = getDate().join("/");
            window.WorkoutSheet.push(emptyObject);
            await sendData(emptyObject, window.WorkoutName, window.WorkoutSheet.length + 1);
        }

        //finally get workoutType
        let prevWorkout = window.WorkoutSheet[window.WorkoutSheet.length - 2];
        if (prevWorkout && prevWorkout.Type === "Strength") {
            window.WorkoutType = "Size";
        } else {
            window.WorkoutType = "Strength";
        }

        console.log("Previous workout entry:", prevWorkout);
        console.log("Previous WorkoutType:", prevWorkout?.Type);

}

window.onload = async function () {
    loadingBar(false)

    let cachedData = getLocallyStoredData();
    if (cachedData == null) {
        await serverWizard();
        //cache everything for quicker load next time
        setLocallyStoredData(
            getDate().join("/"),
            window.SheetNames,
            window.Record,
            window.WorkoutSheet,
            window.WorkoutType,
            window.WorkoutName // <-- PASS THIS TOO
        );


    } else {
        if (cachedData.Date != getDate().join("/")) {
            //expired data.
            await serverWizard();
            //update cache
            setLocallyStoredData(
                getDate().join("/"),
                window.SheetNames,
                window.Record,
                window.WorkoutSheet,
                window.WorkoutType,
                window.WorkoutName // <-- PASS THIS TOO
            );

        } else {
            //use cached data
            window.SheetNames = cachedData.SheetNames;
            window.Record = cachedData.Record;
            window.WorkoutSheet = cachedData.WorkoutSheet;
            window.WorkoutType = cachedData.WorkoutType;
            window.WorkoutName = cachedData.WorkoutName; // <-- USE THIS

        }
    }

    
    boot();
}