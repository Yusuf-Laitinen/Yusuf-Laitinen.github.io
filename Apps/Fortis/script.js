var exceriseTable
var workouts
var selectedWorkout

function loader(show) {
    let loader = document.getElementById("loader");
    if (show) {
        loader.style.display = "block";
    } else {
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
}
function displayWorkouts(workouts) {

    let workoutsDiv = document.createElement("div");
    workoutsDiv.id = "workouts";

    let buttons = ''
    workouts.forEach(workout => {
        buttons += `<button onclick="selectWorkout('${workout}')">${workout}</button>`;
    })

    workoutsDiv.innerHTML =`
    <div id="workouts">
    <h1>Workouts</h1>
    ${buttons}
    </div>`;

    document.body.appendChild(workoutsDiv);
}
async function selectWorkout(workout) {
    loader(true);
    selectWorkout = await getData(workout);
    // keys of the workout table correspond to id's in the exercise table.
    // names pictures etc can be retrieved from the exercise table.
}

window.onload = async function() {
    loader(true);
    exceriseTable = await getData("Exercises");
    workouts = await getSheetNames();
    displayWorkouts(workouts);
    loader(false);

}