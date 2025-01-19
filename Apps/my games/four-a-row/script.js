function generateGrid(width, height) {
    const table = document.getElementById("table");

    // Calculate the side length for square cells based on the viewport width
    const cellSideLength = 100 / width; // Percentage of width for each cell

    for (let y = 0; y < height; y++) {
        let row = document.createElement('div');
        row.className = 'row';
        row.style.height = `${cellSideLength}vw`; // Square cells (based on viewport width)

        for (let x = 0; x < width; x++) {
            let cell = document.createElement('div'); // Use div for easier styling
            cell.className = 'cell';
            cell.style.width = `${cellSideLength}vw`; // Square cells
            cell.style.height = '100%'; // Take full height of the row
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerText = x + y; // Example content
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}
generateGrid(7, 6);
