function init() {
    $(".chest").remove();

    let wood = document.createElement("div");
    let common = document.createElement("div");
    let uncommon = document.createElement("div");
    let rare = document.createElement("div");
    let legend = document.createElement("div");

    wood.setAttribute("class", "chest");
    wood.setAttribute("type", "wood");
    common.setAttribute("class", "chest");
    common.setAttribute("type", "common");
    uncommon.setAttribute("class", "chest");
    uncommon.setAttribute("type", "uncommon");
    rare.setAttribute("class", "chest");
    rare.setAttribute("type", "rare");
    legend.setAttribute("class", "chest");
    legend.setAttribute("type", "legendary");

    document.body.appendChild(wood);
    document.body.appendChild(common);
    document.body.appendChild(uncommon);
    document.body.appendChild(rare);
    document.body.appendChild(legend);

    initChests(); // Assuming initChests() initializes your chest elements
}

window.onload = (event) => {
    for (let i = 0; i < 100; i++) {
        let temp = document.createElement("h1"); // Create a new h1 element each time
        temp.innerText = "Hello";
        document.getElementById("ttt").appendChild(temp);
    }
    
    init();

    window.scroll(0, 47); // Scroll to 47 pixels from the top
};


