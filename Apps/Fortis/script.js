function getDate() {
    var date = new Date();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();
    return [minutes, hours, day, month, year];
}

function formatTime(minutes, hours) {
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

    return `${hours}:${minutes}`;
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
    } else {
        content.dataset.expanded = "true";
        content.style.display = "block";
        expandArrow.style.transform = "rotate(90deg)";
    }
}

function toggleCheckbox(checkbox) {
    const parent = checkbox.parentElement;
    if (parent.classList.contains("true")) {
        parent.classList.remove("true");
        parent.classList.add("false");
        checkbox.src = "src/ui/checkbox_unchecked.svg";
    } else {
        parent.classList.remove("false");
        parent.classList.add("true");
        checkbox.src = "src/ui/checkbox_checked.svg";
    }
}

window.onload = function() {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    document.getElementById("date").innerHTML = `${getDate()[2]} ${months[getDate()[3]-1]} ${getDate()[4]} at ${formatTime(getDate()[0], getDate()[1])}`;


}