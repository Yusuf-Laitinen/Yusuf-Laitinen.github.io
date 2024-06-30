let data = {}
let list = null

let dragx = 0

function home() {
	document.getElementById("selectionScreen").classList.remove("swipeAway")
	document.getElementById("listView").classList.remove("swipeIn")

	document.getElementById("selectionScreen").classList.add("swipeBack")
	document.getElementById("listView").classList.add("swipeOut")
}

async function loadList() {

	data = {}
	while (document.getElementById("list").firstChild) {
		document.getElementById("list").removeChild(document.getElementById("list").firstChild);
	}

	data = await getData(list)

	document.getElementById("listName").innerText = list

	if (data == "No data found") {
		console.log("ERROR")
	} else {
		document.getElementById("selectionScreen").classList.add("swipeAway")
		document.getElementById("listView").classList.add("swipeIn")

		document.getElementById("selectionScreen").classList.remove("swipeBack")
		document.getElementById("listView").classList.remove("swipeOut")
	}

	`            <div class="active">

            </div>
`

	for (let i = 0; i < data.length; i++) {
		if (data[i].ITEM != '') {
			let item = document.createElement("div")//☐☑

			item.innerHTML = `<div class="done">☐</div>
		<p class="text">${data[i].ITEM}<b>x${data[i].MULTIPLIER}</b></p>
        <button id=${i} onclick=deleteRow(this)><img src="icons/bin.png"></button>`;

			item.lastChild.style.display = "none"

			if (data[i].DONE) {
				item.classList.add("active")
				item.firstChild.innerText = "☑"
			}

			item.lastChild.addEventListener("blur", () => {
				item.lastChild.style.display = "none"
			})

			item.style.setProperty("--color", data[i].COLOR)

			item.addEventListener("touchstart", (e) => {
				dragx = e.touches[0].clientX
				console.log(dragx);
			});

			item.addEventListener("touchmove", (e) => {
				if (dragx - e.changedTouches[0].clientX > 50) {
					item.lastChild.style.display = "block"
				} else {
					item.lastChild.style.display = "none"
				}
			});


			item.onclick = () => {
				if (item.lastChild.style.display == "none") {
					let checked = item.classList.contains("active")

					if (checked) {
						item.classList.remove("active")
						item.firstChild.innerText = "☐"
					} else {
						item.classList.add("active")
						item.firstChild.innerText = "☑"
					}
	
					updateCheckBox(i, !checked)
				}
			}

			document.getElementById("list").appendChild(item);
		}

	}
}

async function updateCheckBox(row, status) {
	if (document.getElementById(row).style.display == "none") {
		const progressElement = document.getElementById("progress");

		progressElement.classList.remove("finishSave");
		progressElement.classList.add("beginSave");
	
		// Use a small delay to ensure the DOM updates
		await new Promise(resolve => setTimeout(resolve, 0));
	
		let temp = data[row];
		temp.DONE = status;
	
		try {
			const result = await sendData(temp, list, row + 2);
			console.log("done");
			console.log(result); // This will log the response text if successful
		} catch (error) {
			console.error("Error in sendData:", error);
		} finally {
			progressElement.classList.remove("beginSave");
			progressElement.classList.add("finishSave");
		}
	}
}


async function deleteRow(node) {
	const progressElement = document.getElementById("progress");

	progressElement.classList.remove("finishSave");
	progressElement.classList.add("beginSave");

	let id = parseInt(node.id)
	console.log(`index : ${id+2}`)
	document.getElementById(id).parentElement.remove()	

	try {
		const result = await sendData({ ITEM: '', MULTIPLIER: '', DONE: '', COLOR: '' }, list, parseInt(id)+2)
		console.log(result); // This will log the response text if successful
	} catch (error) {
		console.error("Error in sendData:", error);
	} finally {
		progressElement.classList.remove("beginSave");
		progressElement.classList.add("finishSave");
	}
}


function setLocalStorage(variableName, array) {
	// Convert the array to a JSON string
	const jsonString = JSON.stringify(array);
	// Save the JSON string to localStorage with the specified key
	localStorage.setItem(variableName, jsonString);
}


function loadFromStorage(variableName) {
	// Retrieve the JSON string from localStorage with the specified key
	const jsonString = localStorage.getItem(variableName);
	// Convert the JSON string back to an array
	// If jsonString is null (i.e., the key does not exist), return an empty array
	return jsonString ? JSON.parse(jsonString) : [];
}

async function selectList(node) {
	list = node.innerText
	node.classList.add("loading")
	await loadList().then(() => {
		node.classList.remove("loading")
	})
}

window.onload = async function (event) {
	setLocalStorage("ShoppingLists", ["list1", "Water melons", "Toffee"])
	//localStorage.getItem("ShoppingLists")
	//localStorage.setItem("ShoppingLists", )

	let cachedLists = await loadFromStorage("ShoppingLists")

	for (let i = 0; i < cachedLists.length; i++) {
		let p = document.createElement("p");
		p.innerText = cachedLists[i];
		p.onclick = () => selectList(p);
		document.getElementById("cachedLists").appendChild(p);
	}

};
