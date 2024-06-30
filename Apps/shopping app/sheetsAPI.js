const url = "https://script.google.com/macros/s/AKfycby2uA9u5O2mKn6ar3TF2H5IRj0PAgzzABWZNKwAl7X7ssKkHOhdg5D2CcrozuphJKu_qw/exec";

async function sendData(formData, user, row) {
    formData.user = user; // Add the user field to the formData
    formData.row = row; // Add the row field to the formData
    var formDataString = encodeFormData(formData);

    console.log(formDataString);

    // Send a POST request to your Google Apps Script
    return fetch(url, {
        method: "POST",
        body: formDataString,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    .then(function (response) {
        // Check if the request was successful
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Failed to submit the form.");
        }
    })
    .catch(function (error) {
        // Handle errors, you can display an error message here
        console.error(error);
        throw error; // Re-throw the error to be caught by the caller
    });
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
