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


    var _workoutSheetData = await getData(whatsOnToday(cachedData.record, cachedData.workouts));

    Object.keys(_workoutSheetData[0]).forEach(excersizeID => {
        workout.push(excersizeID)
    });
    workout.splice(workout.indexOf("Date"), 1); // Remove the "Date" key from the workout array
    workout.splice(workout.indexOf("Type"), 1); // Remove the "Date" key from the workout array

};
