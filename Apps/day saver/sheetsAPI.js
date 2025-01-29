const url = "https://script.google.com/macros/s/AKfycbyW8KPc0iYFYl9p-eI6c4aLmADV8vwGFctzBgEChlvd50bDlPTZCrF58BGXGHhPqVz5/exec";

// Modified sendData function to disable data sending
async function sendData(formData, user, row) {
    console.warn("Data submission is disabled. No data is sent to the database.");
    return Promise.resolve("Data submission disabled");
}

// Helper function to encode form data in URL-encoded format
function encodeFormData(data) {
    return Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

async function getData(user) {
    var fullUrl = url + "?user=" + encodeURIComponent(user); // Adjusted URL without 'value' parameter
    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json(); // Return the parsed JSON data
    } catch (error) {
        console.error(error);
        return "No data found"; // Adjusted error message
    }
}

// New function to get all sheet names
async function getSheetNames() {
    var fullUrl = url + "?action=getSheetNames"; // URL with the action parameter
    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch sheet names");
        }
        return await response.json(); // Return the array of sheet names
    } catch (error) {
        console.error(error);
        return []; // Return an empty array on error
    }
}
