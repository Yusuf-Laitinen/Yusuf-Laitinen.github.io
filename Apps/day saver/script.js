var food = {};
var log = {};

function _updateNutriSummaryValues(foodItem, weight) {
    document.getElementById("nutriSummaryProtein").innerText = (foodItem.protein * (weight/foodItem.weight)) + "g 🍗";
    document.getElementById("nutriSummaryCalories").innerText = (foodItem.calories * (weight/foodItem.weight)) + "cal";
    document.getElementById("nutriSummaryPrice").innerText = "£" + (foodItem.price * (weight/foodItem.weight)).toFixed(2);
}

async function selectFood(id) {
    document.getElementById("foodLogger").style.display = "block";
    let foodItem = food.find(f => f.id == id);

    document.getElementById("foodName").innerText = foodItem.productFullName;
    document.getElementById("foodIcon").src = foodItem.image;
    document.getElementById("qunatity").value = foodItem.weight + "g";
    document.getElementById("qunatity").addEventListener("input", function() {
        _updateNutriSummaryValues(foodItem, parseInt(document.getElementById("qunatity").value));
    });

    _updateNutriSummaryValues(foodItem, parseInt(document.getElementById("qunatity").value));

}

window.onload = async function() {
    food = await getData("food");
    for (let i = 0; i < food.length; i++) {
        var container = document.createElement("div");
        var image = document.createElement("img");
        var label = document.createElement("h2");
        image.src = food[i].image;
        label.innerText = food[i].productShortName;
        container.appendChild(image);
        container.appendChild(label);

        container.onclick = function() {
            selectFood(food[i].id);
        };

        document.getElementById("foodSelector").appendChild(container);
    }
};
