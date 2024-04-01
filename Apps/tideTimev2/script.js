var tides = [];
var times = [];
var heights = [];


function addClassToElementsWithinDiv(divId, className) {
    var div = document.getElementById(divId);
    div.classList.add(className)
    var elements = div.querySelectorAll("*"); // Select all elements within the div

    // Loop through each element and add the class
    elements.forEach(function(element) {
        element.classList.add(className);
    });
}

// Function to remove a class from every element within a div
function removeClassFromElementsWithinDiv(divId, className) {
    var div = document.getElementById(divId);
    div.classList.remove(className)
    var elements = div.querySelectorAll("*"); // Select all elements within the div

    // Loop through each element and remove the class
    elements.forEach(function(element) {
        element.classList.remove(className);
    });
}

function getTime() {
    // Get current date/time
    var now = new Date();

    // Get hours and minutes
    var hours = now.getHours();
    var minutes = now.getMinutes();

    // Add leading zeros if necessary
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;

    // Concatenate hours and minutes with a colon separator
    var currentTime = hours + ":" + minutes;

    return currentTime // Output example: "08:45"

}

function switchPage(detail) {
    if (detail) {
        addClassToElementsWithinDiv("HomePage", "swipeAway");
        removeClassFromElementsWithinDiv("HomePage", "swipeBack")

        addClassToElementsWithinDiv("detailPage", "show");
        removeClassFromElementsWithinDiv("detailPage", "hide")
    } else {
        addClassToElementsWithinDiv("HomePage", "swipeBack");
        removeClassFromElementsWithinDiv("HomePage", "swipeAway")

        addClassToElementsWithinDiv("detailPage", "hide");
        removeClassFromElementsWithinDiv("detailPage", "show")
    }
}

function getNextOccurringIndex(currentTime, timeList) {
    // Convert currentTime to minutes for easier comparison
    var currentTimeSplit = currentTime.split(":");
    var currentHour = parseInt(currentTimeSplit[0]);
    var currentMinute = parseInt(currentTimeSplit[1]);
    var currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Iterate through the timeList
    var nextIndex = 0;
    var nextTimeInMinutes = Infinity;
    for (var i = 0; i < timeList.length; i++) {
        var timeSplit = timeList[i].split(":");
        var hour = parseInt(timeSplit[0]);
        var minute = parseInt(timeSplit[1]);
        var timeInMinutes = hour * 60 + minute;

        // Check if the current time is greater than the time in the list
        if (timeInMinutes >= currentTimeInMinutes && timeInMinutes < nextTimeInMinutes) {
            nextTimeInMinutes = timeInMinutes;
            nextIndex = i;
        }
    }

    if (currentTimeInMinutes >= timeInMinutes) {
        nextIndex = 3
    }

    return nextIndex;
}

// Example usage
var currentTime = "12:50";
var timeList = ['01:57', '08:12', '14:20', '20:51'];
var nextIndex = getNextOccurringIndex(currentTime, timeList);
console.log(nextIndex); // Output: 2


function update() {
    for ( let i = 0; i <= 3; i++) {
        console.log("slot" + (i+1) + "Status")
        document.getElementById("slot" + (i+1) + "Status").innerText = tides[i]

        if (tides[i] == "Low") {
            document.getElementById("slot" + (i+1) + "Icon").src = "source/lowTide.png"
        } else {
            document.getElementById("slot" + (i+1) + "Icon").src = "source/highTide.png"
        }

        document.getElementById("slot" + (i+1) + "Time").innerText = times[i]
    }

    let currentTime = getTime()
    //currentTime = "21:48"
    let nextIndex = getNextOccurringIndex(currentTime, times)
    document.getElementById("tag").innerHTML = "<b>⬤</b> " + currentTime;
    document.getElementById("CurrentStatus").innerText = tides[nextIndex]
    document.getElementById("CurrentHeight").innerText = heights[nextIndex]
    document.getElementById("CurrentTime").innerText = times[nextIndex]

    if (tides[nextIndex] == "Low") {
        document.getElementById("HighTide").style.display = "none"
        document.getElementById("LowTide").style.display = "block"
    } else {
        document.getElementById("HighTide").style.display = "block"
        document.getElementById("LowTide").style.display = "none"
    }

    document.getElementById("slot" + (nextIndex+1)).classList.add("active")


}

window.onload = function() {
    // retrieve table

    removeClassFromElementsWithinDiv("HomePage", "swipeAway");
    var table = document.getElementById("tidewidget");

    var tableContent = table.querySelector("table");

    // first loop goes to tr tag 3, 5, and 7 in which each has 3 td tags with the values in the order tide, time, height.
    for (let n = 1; n <= 4; n++) {
        // n*2 = 2, +1 = 3
        // n*2 = 4, +1 = 5
        // n*3 = 6, +1 = 7
        // n*4 = 8, +1 = 9
        var data = tableContent.querySelector('tr:nth-child(' + (n * 2 + 1) + ')');

        tides.push(data.querySelector('td:nth-child(1)').textContent);
        times.push(data.querySelector('td:nth-child(2)').textContent);
        heights.push(data.querySelector('td:nth-child(3)').textContent);
    }

    console.log(tides);
    console.log(times);
    console.log(heights);

    update()
};
