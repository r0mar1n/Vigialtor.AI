// content.js

const currentURL = window.location.href;

// Send the URL to the Flask API for phishing detection
fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: currentURL })
})
.then(response => response.json())
.then(data => {
    if (data.prediction === "phishing") {
        alert("Warning: This URL is a phishing site!");
        // You can also add more actions here, like blocking the URL, showing a notification, etc.
    }
})
.catch(error => console.error('Error:', error));
