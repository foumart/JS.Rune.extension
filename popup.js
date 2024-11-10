document.getElementById("expandFirstIframe").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "expandIframe", index: 1 });
});

document.getElementById("expandSecondIframe").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "expandIframe", index: 2 });
});