function formatList(list) {
    list.splice(0, 2)


    list.pop()

    list[0] = list[0].substring(5)

    list = list.filter(word => word !== "");


    formattedList = []

    for (let i = 7; i <= 10; i++) {
        let newList = []
        if ( i % 2 == 0) {
            newList.push(list[i].substring(0, 3))
            list[i] = list[i].substring(3)
        } else {
            newList.push(list[i].substring(0, 4))
            list[i] = list[i].substring(4)
        }
        
        newList.push(list[i].substring(0, 5))
        list[i] = list[i].substring(5)
        newList.push(list[i])

        formattedList.push(newList)

    }

    list.splice(4, 7)

    formattedList.forEach(element => {
        element.forEach(item => {
            list.push(item)
        });
    });

    return list
}


function prepareText(text) {
    let lines = text.split("\n");
    let words = [];

    lines.forEach(line => {
        let lineWords = line.split(/\s+/); // Split by one or more spaces
        lineWords.forEach(word => {
            if (word.trim() !== "") { // Remove empty strings
                let tabSeparatedWords = word.split("\t");
                tabSeparatedWords.forEach(tabWord => {
                    if (tabWord.trim() !== "") { // Remove empty strings after splitting by tabs
                        words.push(tabWord.trim());
                    }
                });
            }
        });
    });

    return formatList(words);
}

const d = new Date();
let hour = d.getHours();

let data = []

function update() {
    hour = d.getHours();
    data = prepareText(document.getElementById("tidewidget").innerText);

    console.log(data);

}



function ui() {

    document.getElementById("currentDate").innerText = data[0] + " " + data[1] + " " + data[2]

    let times = [];
    let nextTimes = [];

    let prevIndex = 0

    // Accessing specific indices in the data array
    let indices = [5, 8, 11, 14];
    indices.forEach(index => {
        times.push(data[index]);
    });

    times.forEach(time => {
        let parsedTime = parseInt(time.substring(0, 2));
        if (!isNaN(parsedTime) && parsedTime > hour) {
            nextTimes.push(time);
            if (prevIndex == 0){
                if (times.indexOf(time) > 0) {
                    prevIndex = times.indexOf(time)-1
                }
            }
        }
    });

    console.log(nextTimes)

    nextTimes.forEach(element => {
        let tideType = document.createElement("h3")
        tideType.innerText = "Last tide type: " + data[data.indexOf(element)-1]
        document.getElementById("data").appendChild(tideType)
        tideType.classList.add("type")

        let tideTime = document.createElement("h3")
        tideTime.innerText = "Last tide time : " +  element
        document.getElementById("data").appendChild(tideTime)
        tideTime.classList.add("time")

        let tideDepth = document.createElement("h3")
        tideDepth.innerText = "Last tide depth: " +  data[data.indexOf(element)+1]
        document.getElementById("data").appendChild(tideDepth)
        tideDepth.classList.add("depth")
    });

    document.getElementById("previousTideType").innerText = "Last tide type: " + data[data.indexOf(times[prevIndex])-1]
    document.getElementById("previousTideTime").innerText = "Last tide time : " +  times[prevIndex]
    document.getElementById("previousTideDepth").innerText = "Last tide depth: " +  data[data.indexOf(times[prevIndex])+1]
}

function next() {
    if (document.getElementById("data").style.display == "none") {
        document.getElementById("prevData").style.display = "none"
        document.getElementById("data").style.display = "block"
    } else {
        document.getElementById("prevData").style.display = "block"
        document.getElementById("data").style.display = "none"
    }

}

window.onload = function() {
    update();
    ui()

}
