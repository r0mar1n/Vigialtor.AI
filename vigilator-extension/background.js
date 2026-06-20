// Event listener for URL visits in any tab (logs every visited URL)
chrome.webNavigation.onCommitted.addListener((details) => {
    const url = details.url;
    if (!url) return;

    console.log("Visited URL:", url); // Log all visited URLs

    // Normalize URL before sending
    try {
        const normalizedUrl = new URL(url).origin + new URL(url).pathname;
        sendUrlToBackend(normalizedUrl);
    } catch (error) {
        console.error("Error normalizing URL:", url, error);
    }
}, { url: [{ schemes: ["http", "https"] }] });

// Function to send URL to central API for phishing detection
function sendUrlToBackend(url) {
    console.log("Checking URL for phishing:", url);

    fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Final Decision:", data);

        // Show notification if URL is classified as phishing
        if (data.decision === "Phishing") {
            showPhishingNotification(url);
        }
    })
    .catch(error => {
        console.error("Error sending URL to backend:", error);
    });
}

// Function to display a phishing warning notification
function showPhishingNotification(url) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/logo.png',
        title: 'Phishing Warning',
        message: `The site ${url} is detected as phishing!`,
        priority: 2
    });
}

// Event listener for when the extension icon is clicked (opens login page)
chrome.action.onClicked.addListener(() => {
    const loginPageUrl = "http://localhost:8080/login";
    chrome.tabs.create({ url: loginPageUrl });
});
