var tides = [];
var times = [];
var heights = [];

window.onload = function() {
    // retrieve table
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
};
