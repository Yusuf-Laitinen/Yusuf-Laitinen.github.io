const url = "https://script.google.com/macros/s/AKfycby2uA9u5O2mKn6ar3TF2H5IRj0PAgzzABWZNKwAl7X7ssKkHOhdg5D2CcrozuphJKu_qw/exec";

function sendData(formData, user, row) {
    formData.user = user; // Add the user field to the formData
    formData.row = row; // Add the row field to the formData
    var formDataString = encodeFormData(formData);

    console.log(formDataString);

    // Send a POST request to your Google Apps Script
    fetch(url, {
        method: "POST",
        body: formDataString,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    .then(function (response) {
        // Check if the request was successful
        if (response.ok) {
            return response.text(); // Read the response as text
        } else {
            throw new Error("Failed to submit the form.");
        }
    })
    .then(function (data) {
        console.log("SUCCESS", data); // Log the response data
    })
    .catch(function (error) {
        // Handle errors, you can display an error message here
        console.error(error);
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
        return "eror?"
    }
}
