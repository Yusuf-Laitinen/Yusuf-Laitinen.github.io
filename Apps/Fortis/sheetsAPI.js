const url = "https://script.google.com/macros/s/AKfycbxMKryLpN8xp4xZ9pRhym2OvYj9OWDC3mKvYq_Wg3GShapoYTDgB7cUvx8EtQn8qVHoeA/exec"


function sendData(formData) {
    var formDataString = encodeFormData(formData);

    console.log(formDataString);

    // Send a POST request to your Google Apps Script
    fetch(
        url,
        {
            method: "POST",
            body: formDataString,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )
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
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}




function makeGetRequest() {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        console.log('Response:', data);
        // Handle the response data as needed
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors here
      });
  }