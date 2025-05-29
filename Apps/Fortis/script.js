var workout = [];
window.onload = async function () {
    renderDate();
    refreshExcersizeTable();

    // Step 1: Try to use cached data first
    const cachedData = getLocallyStoredData();

    if (!cachedData) {
        // No cache, fetch immediately
        const record = await getData("Record");
        const workouts = await getWorkoutNames();
        setLocallyStoredData(record, workouts);

        // Use freshly fetched data
    } else {
        // Cached data exists — use it immediately

        // Update silently in background
        (async () => {
            const record = await getData("Record");
            const workouts = await getWorkoutNames();
            setLocallyStoredData(record, workouts);
        })();
    }


    // Step 2: get the workout scheduled for today.
    console.log(whatsOnToday(cachedData.record, cachedData.workouts))
    var _workoutSheetData = await getData(whatsOnToday(cachedData.record, cachedData.workouts));
    Object.keys(_workoutSheetData[0]).forEach(excersizeID => {
        workout.push(excersizeID)
    });

    //step 3: remove the "Date" and "Type" keys from the workout array
    workout.splice(workout.indexOf("Date"), 1); // Remove the "Date" key from the workout array
    workout.splice(workout.indexOf("Type"), 1); // Remove the "Date" key from the workout array

    let workout_sets_and_reps = getHistoricalData(_workoutSheetData, workout)

    let todayIndex = 1
    for (let i = 0; i < workout.length; i++) {
        const checkBoxContent = _workoutSheetData[todayIndex][workout[i]];
        console.log(checkBoxContent);

        const obj = window.eTable.find(item => String(item.ID) === String(workout[i]));
        console.log(obj);

        if (checkBoxContent.length < 2) {
            addCheckbox(obj.Name, workout_sets_and_reps[workout[i]], false);

        } else {
            addCheckbox(obj.Name, checkBoxContent, true)

        }

    }
};
