function initChests() {
    // Make images non-draggable
    $("img").attr("draggable", "false");

    // Disable context menu
    $("*").on("contextmenu", function() {
        return false;
    });

    // Set up click event for chests
    $(".chest").on("click", function() {
        openchest(this);
    });

    // Add image to each chest
    $('.chest').each(function(index, element) {
        let img = document.createElement("img");
        let chestType = element.getAttribute("type");

        img.src = "chests/" + chestType + "chestclosed.svg";
        img.id = "chestImage";

        $(element).append(img);
    });
};

$(document).ready(initChests())

function openchest(parent) {
    let image = parent.children[0];
    image.classList.add("anticipate");
    image.addEventListener("animationend", animationEnd);
    parent.onclick = null; // Prevent further clicks
}

function animationEnd(event) {
    if (event.animationName === "openChestImage") {
        event.target.classList.remove("anticipate");
        event.target.classList.add("release");
        let type = event.target.parentNode.getAttribute("type");
        event.target.src = "chests/" + type + "chestopen.svg";
        getRewards(type);
    }
}

function getRewards(type) {
    console.log(type);
}