// Define trusted domains
const trustedDomains = [
  'google.com', 'youtube.com', 'accounts.google.com', 'ogs.google.com',
  'facebook.com', 'microsoft.com', 'github.com', 'wikipedia.org', 'pinterest.com'
];

// Keep track of checked URLs
const checkedUrls = new Set();

// Function to check if a URL is from a trusted domain
function isWhitelisted(url) {
  const domain = new URL(url).hostname.toLowerCase();
  return trustedDomains.some(trustedDomain => domain === trustedDomain || domain.endsWith(`.${trustedDomain}`));
}

// Event listener for when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  const loginPageUrl = "http://localhost:8080/login"; // URL to redirect on click
  chrome.tabs.create({ url: loginPageUrl });
});

// Event listener for URL changes in any tab (main frame only)
chrome.webNavigation.onCompleted.addListener(
  (details) => {
      if (details.frameId !== 0) return; // Process only main frame

      const url = details.url;
      console.log("Attempting to check URL for phishing:", url);

      if (isWhitelisted(url)) {
          console.log("This is a safe URL.");
          return;
      }

      const normalizedUrl = normalizeUrlForChecking(url);
      if (checkedUrls.has(normalizedUrl)) {
          console.log("URL already checked:", normalizedUrl);
          return;
      }
      checkedUrls.add(normalizedUrl);

      try {
          const normalizedUrlObj = new URL(url);
          if (!normalizedUrlObj.protocol.startsWith('http')) {
              console.log("Invalid URL protocol:", url);
              return;
          }
          sendUrlToBackend(normalizedUrlObj.toString());
      } catch (e) {
          console.error("Invalid URL:", url, e);
      }
  },
  { url: [{ schemes: ["http", "https"] }] }
);

// Function to normalize URLs and remove query parameters or fragments
function normalizeUrlForChecking(url) {
  const normalizedUrl = new URL(url);
  normalizedUrl.search = ''; // Remove query parameters
  normalizedUrl.hash = '';   // Remove fragments
  return normalizedUrl.toString();
}

// Function to send URL to Flask backend
function sendUrlToBackend(url) {
  const data = { url: url };

  fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  })
      .then((response) => {
          if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
          return response.json();
      })
      .then((data) => {
          console.log("Prediction result:", data);
          if (data.prediction === 1 && data.probability > 0.9) {
              showPhishingNotification(url, data.probability);
          }
      })
      .catch((error) => {
          console.error("Error:", error);
      });
}

// // Function to display a phishing warning notification instead of a popup
// function showPhishingNotification(url, probability) {
//   const message = `This site has been flagged as a phishing website. Proceed with caution.\n\nProbability: ${probability.toFixed(2)}`;

//   chrome.notifications.create({
//       type: "basic",
//       iconUrl: "icons/logo.png",
//       title: "🚨 Phishing Warning",
//       message: message,
//       priority: 2,
//       buttons: [
//           { title: "Block this site" },
//           { title: "Ignore Warning" }
//       ],
//       requireInteraction: true // Keeps the notification visible until user interacts
//   });

//   // Store the current tab ID so we can close it if "Block this site" is clicked
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs.length > 0) {
//           const tabId = tabs[0].id;
//           chrome.storage.local.set({ phishingTabId: tabId });
//       }
//   });
// }
function showPhishingNotification(url, probability) {
  console.log("🚨 Attempting to show phishing notification for:", url);

  chrome.notifications.create("phishing-alert", {
      type: "basic",
      iconUrl: "icons/logo.png",
      title: "Phishing Warning",
      message: `This site is flagged as a phishing site.\n\nProbability: ${probability.toFixed(2)}`,
      priority: 2,
      buttons: [
          { title: "Block this site" },
          { title: "Ignore Warning" }
      ],
      requireInteraction: true // Keeps it visible
  }, function(notificationId) {
      console.log("✅ Notification created:", notificationId);
  });
}

// chrome.notifications.create({
//   type: "basic",
//   iconUrl: "icons/logo.png",
//   title: "Test Notification",
//   message: "If you see this, notifications are working!",
//   priority: 2,
//   requireInteraction: true // Forces it to stay until closed manually
// });

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  chrome.storage.local.get("phishingTabId", (data) => {
      if (!data.phishingTabId) return;

      if (buttonIndex === 0) {
          // Block Site (Close the tab)
          chrome.tabs.remove(data.phishingTabId);
      } else if (buttonIndex === 1) {
          // Ignore Warning (Dismiss notification)
          chrome.notifications.clear(notificationId);
      }
  });
});
