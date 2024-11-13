document.addEventListener('DOMContentLoaded', () => {
	const targetTitle = "Rune DevUI";

	if (document.title === targetTitle) {
		chrome.runtime.sendMessage({ action: "enableExtension", pageTitle: document.title });
	} else {
		chrome.runtime.sendMessage({ action: "disableExtension", pageTitle: document.title });
	}
});

chrome.runtime.sendMessage({ action: "initExtension", pageTitle: document.title });
