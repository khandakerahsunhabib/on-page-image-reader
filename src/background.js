chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runScripts") {
    chrome.scripting.insertCSS({
      target: { tabId: request.tabId },
      files: ["css/style.css"],
    });

    chrome.scripting.executeScript({
      target: { tabId: request.tabId},
      files: ["src/content.js"],
    });
  }
});
