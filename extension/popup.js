document.getElementById("expandFirstIframe").addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "expandIframe", index: 1 });
});

document.getElementById("expandSecondIframe").addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "expandIframe", index: 2 });
});

document.getElementById("closeExtension").addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "closeIframe" });
});
