var current_degrees = getComputedStyle(document.documentElement).getPropertyValue('--degrees').trim().slice(0, -3);
var intervalTime = 2000;

var submittedDegrees = 360

var now = new Date();
var currentHour = now.getHours();



function getDifference(value1, value2) {
    return Math.abs(value1 - value2);
}

function getTimeRemainingUntil(targetHour, specificDate = new Date()) {
    const now = new Date();
    const targetTime = new Date(specificDate);
    targetTime.setHours(targetHour, 0, 0, 0);

    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1); // Move to the next day
    }

    return (targetTime.getTime() - now.getTime())/(60*60*1000);
}


function getTimeRemainingUntilNextSwitch() {
    const now = new Date();
    const switchTime1 = new Date();
    const switchTime2 = new Date();
  
    // Set the first switch time to 12am and the second switch time to 8pm
    switchTime1.setHours(0, 0, 0, 0);
    switchTime2.setHours(20, 0, 0, 0);
  
    // If the current time is before the first switch time, return time until 12am
    if (now.getTime() < switchTime1.getTime()) {
      return getTimeRemainingUntil(0);
    }
  
    // If the current time is before the second switch time, return time until 8pm
    if (now.getTime() < switchTime2.getTime()) {
      return getTimeRemainingUntil(20);
    }
  
    // Otherwise, return time until the next 12am
    switchTime1.setDate(switchTime1.getDate() + 1); // Next day
    return getTimeRemainingUntil(0, switchTime1);
}


function updateRing(degrees) {
    submittedDegrees = degrees
    current_degrees = getComputedStyle(document.documentElement).getPropertyValue('--degrees').trim().slice(0, -3);
    ringAnim(degrees);
    intervalTime = getDifference(current_degrees, degrees) / 4000;
}

function loop() {
    currentHour = now.getHours();

    if ( currentHour > 12 && currentHour < 20 ) {
        console.log("eating")
        updateRing((getTimeRemainingUntil(20)/8)*360)
        document.documentElement.style.setProperty("--ringColor", "#ddfff2")
        document.documentElement.style.setProperty("--backgroundColor", "linear-gradient(45deg, #32a852, #36d68e)")
    } else {
        updateRing((getTimeRemainingUntil(12)/16)*360)
        console.log("fasting")
        document.documentElement.style.setProperty("--ringColor", "#36d68e")
        document.documentElement.style.setProperty("--backgroundColor", "linear-gradient(45deg, #ddfff2, #ebfcf7)")
    }

    setTimeout(loop, 1000)
}

loop()

function ringAnim(targetDegrees) {
    current_degrees = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--degrees').trim().slice(0, -3));

    if (getDifference(targetDegrees, current_degrees) > 1) {
        if (current_degrees > targetDegrees) {
            current_degrees -= 1;
        } else {
            current_degrees += 1;
        }
        document.documentElement.style.setProperty("--degrees", current_degrees + "deg");

        setTimeout(function () {
            ringAnim(targetDegrees);
        }, intervalTime);
    }
}


