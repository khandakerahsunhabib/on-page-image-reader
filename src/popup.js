document.addEventListener("DOMContentLoaded", function () {
  const popupContent = document.getElementById("popupContent");

  setTimeout(() => {
    popupContent.classList.add("slide-to-corner");
  }, 3000);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    chrome.runtime.sendMessage({
      action: "runScripts",
      tabId: activeTab.id,
    });
  });

  setTimeout(() => {
    window.close();
  }, 3000);
});
