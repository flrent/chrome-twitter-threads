
// Function to extract username from the Twitter page URL
function extractUsernameFromTwitterUrl(url) {
  const twitterUrlRegex = /^https?:\/\/twitter\.com\/([A-Za-z0-9_]{1,15})(?:\/|\b)/;
  const match = url.match(twitterUrlRegex);
  return match ? match[1] : null;
}

function copyElementWithClassesAndOpenTab(username) {
  const originalElement = document.querySelector('[data-testid=userActions]');

  if (!originalElement) {
    console.log("Element with data-testid 'userActions' not found.");
    return;
  }

  const clonedElement = originalElement.cloneNode(true);
  const classes = Array.from(originalElement.classList);

  classes.forEach(className => {
    clonedElement.classList.add(className);
  });
  clonedElement.classList.add('open-on-threads');
  
  clonedElement.addEventListener("click", function () {
    const url = `https://threads.net/${username}`;
    chrome.runtime.sendMessage({ action: "openUrl", url: url });
  });

  originalElement.parentNode.insertBefore(clonedElement, originalElement);
  
  // Update the HTML of the first child within the cloned element
  const firstChild = clonedElement.firstElementChild;
  if (firstChild) {
    firstChild.innerHTML = "🧵"; // Replace with the desired thread emoji or HTML
  }
}


// Function to handle URL changes and re-run the necessary operations
function handleUrlChange() {
  const currentUrl = window.location.href;
  const username = extractUsernameFromTwitterUrl(currentUrl);

  // Remove the previously added cloned element, if exists
  const clonedElement = document.querySelector(".open-on-threads");
  if (clonedElement) {
    clonedElement.remove();
  }

  if (username) {
    copyElementWithClassesAndOpenTab(username);
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "urlChange") {
    handleUrlChange();
  }
});

setTimeout(function () {
// Call the function initially
  handleUrlChange();
}, 1000);