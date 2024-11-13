document.getElementById("openDevUI").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openDevUI" });
    window.close();
});

chrome.runtime.sendMessage({ action: "expandIframe", index: 0 });
