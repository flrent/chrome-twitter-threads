// Listen for web navigation events
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation);

// Handle web navigation event
function handleNavigation(details) {
  if (details.url.includes("twitter.com")) {
    chrome.tabs.sendMessage(details.tabId, { action: "urlChange" });
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "openUrl") {
    chrome.tabs.create({ url: message.url });
  }
});