function getParentFolder(path) {
    // Assuming path is in the format '/Apps/something/apple-touch-icon'
    const iconPath = path.replace("index.html", "");
    return iconPath;
}


function extractMiddlePart(path) {
    return path.replace('/Apps/', '').replace('/index.html', '');
}

window.onload = function() {
    let container = document.getElementById("pages");

    for (let i = 0; i < container.children.length; i++) {
        let child = container.children[i];
        let img = document.createElement("img");
        let label = document.createElement("p");

        // Set the image source, applying the replace function
        let iconPath = getParentFolder(child.id) + "apple-touch-icon.png";
        img.src = iconPath;

        // Check if the image exists and fall back to _src/missing.svg if not
        img.onerror = function() {
            img.src = getParentFolder(window.location.href) + "/src/missing.svg"; // Fallback image
        };

        // Set the label text
        label.innerText = extractMiddlePart(child.id);

        // Append the image and label to the child element
        child.appendChild(img);
        child.appendChild(label);

        // Set click event to navigate to the child id
        child.onclick = function() {
            window.location.href = child.id;
        }
    }
}
