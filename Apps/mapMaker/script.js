var width = 0;
var selectedImg = "tile1.png";
var selectedID

function Import(luaTableString) {
    // Remove leading and trailing braces
    luaTableString = luaTableString.trim().slice(1, -1);

    // Convert Lua table to JavaScript array
    function luaToJsTable(str) {
        // Match each row of the Lua table
        const rows = str.match(/\[([0-9]+)\]\s*=\s*{([^}]*)}/g);
        const result = [];

        if (rows) {
            rows.forEach(row => {
                const [rowIndex, rowContent] = row.match(/\[([0-9]+)\]\s*=\s*{([^}]*)}/).slice(1, 3);
                result[rowIndex] = rowContent.split(',').map(cell => cell.trim() === 'nil' ? null : cell.trim().replace(/'/g, ''));
            });
        }

        return result;
    }

    return luaToJsTable(luaTableString);
}


function Download() {
    let table = document.getElementById("table");
    if (!table) {
        console.error("Table element not found.");
        return;
    }

    let object = [];

    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let rowArray = [];
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];
            let img = cell.querySelector('img');
            if (img) {
                rowArray[j] = img.id; // Use column index as the key
            } else {
                rowArray[j] = null; // If no image is found in the cell
            }
        }
        object[i] = rowArray; // Use row index as the key
    }

    // Function to convert JavaScript array to Lua table format
    function toLuaTable(obj) {
        function arrayToLuaTable(arr) {
            return arr.map((item, index) => {
                if (Array.isArray(item)) {
                    return `[${index}] = {` + arrayToLuaTable(item) + `}`;
                } else if (item === null) {
                    return 'nil';
                } else {
                    return item;
                }
            }).join(', ');
        }

        return '{' + obj.map((row, index) => `[${index}] = {` + arrayToLuaTable(row) + `}`).join(', ') + '}';
    }

    let luaTable = toLuaTable(object);
    console.log(luaTable);

    return luaTable; // Optional: return the Lua table string if needed
}

function generateGrid(object = null) {
    let table = document.createElement("table");
    table.id = "table";

    let tableData;

    if (object) {
        // Generate grid based on the provided object
        width = object.length;

        for (let x = 0; x < width; x++) {
            let tableRow = document.createElement("tr");
            for (let y = 0; y < width; y++) {
                let tableData = document.createElement("td");
                let imgSrc = object[x][y] ? `tile${object[x][y]}.png` : 'tile0.png';
                tableData.innerHTML = `<img src='${imgSrc}' id='${object[x][y] || '0'}' />`;
                tableData.onclick = () => {
                    tableData.innerHTML = `<img src='${selectedImg}' id='${selectedID}' />`;
                };
                tableRow.appendChild(tableData);
            }
            table.appendChild(tableRow);
        }
    } else {
        // Generate blank grid
        for (let x = 0; x < width; x++) {
            let tableRow = document.createElement("tr");
            for (let y = 0; y < width; y++) {
                let tableData = document.createElement("td");
                tableData.innerHTML = "<img src='tile0.png' id='0' />";
                tableData.onclick = () => {
                    tableData.innerHTML = `<img src='${selectedImg}' id='${selectedID}' />`;
                };
                tableRow.appendChild(tableData);
            }
            table.appendChild(tableRow);
        }
    }

    // Replace the old table with the new one
    let oldTable = document.getElementById("table");
    if (oldTable) {
        oldTable.remove();
    }
    document.body.appendChild(table);
}


function select(node) {
    let selected = document.querySelector(".selected");
    if (selected) {
        selected.classList.remove("selected");
    }
    node.classList.add("selected");
    selectedImg = node.src;
    selectedID = node.id
}

window.onload = () => {

    let img = document.createElement("img");
    img.src = `tile0.png`;
    img.onclick = () => {
        select(img);
    };
    img.id = 0
    document.getElementById("tileSelector").appendChild(img);

    for (let i = 1; i <= 132; i++) {
        let img = document.createElement("img");
        img.src = `tile${i}.png`;
        img.onclick = () => {
            select(img);
        };
        img.id = i
        document.getElementById("tileSelector").appendChild(img);
    }

    document.getElementById("tileSelector").childNodes[1].classList.add("selected");

    let t = document.createElement("h1");
    t.innerText = "Enter map width";

    let i = document.createElement("input");
    i.id = "width";
    i.placeholder = "#";

    let b = document.createElement("button");
    b.innerText = "start";
    b.onclick = () => {
        width = parseInt(document.getElementById("width").value);
        i.remove();
        b.remove();
        t.remove();
        generateGrid();
    };

    document.body.appendChild(t);
    document.body.appendChild(i);
    document.body.appendChild(b);
};


function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Text copied to clipboard!');
}

function handleExport() {
    const luaTable = Download();
    if (luaTable) {
        copyToClipboard(luaTable);
    }
}