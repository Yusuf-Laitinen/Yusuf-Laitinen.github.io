// Function to read a cookie or create one if it doesn't exist
function readCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    // If the cookie doesn't exist, create one with the value of 0
    const defaultValue = "0";
    document.cookie = `${cookieName}=${defaultValue};path=/`;
    return defaultValue;
}

// Function to write to a cookie
function writeCookie(cookieName, value, expiryDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + value + ";" + expires + ";path=/";
}

const cookieName = "tallyAppCurrentTally"

var tally = parseInt(readCookie(cookieName))
document.getElementById("tally").innerText = tally

if (tally % 2 == 0) {
    document.body.classList.remove("red")
    document.body.classList.add("green")
} else {
    document.body.classList.add("red")
    document.body.classList.remove("green")
}

function incrament(value) {
    tally += value
    document.getElementById("tally").innerText = tally
    writeCookie(cookieName, tally, 10)

    if (tally % 2 == 0) {
        document.body.classList.remove("red")
        document.body.classList.add("green")
    } else {
        document.body.classList.add("red")
        document.body.classList.remove("green")
    }
}