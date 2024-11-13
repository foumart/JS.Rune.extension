chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	//console.log("chrome.tabs.onUpdated");
	if (changeInfo.status === 'complete' && tab.active) {
		if (isValidUrl(tab.url)) {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['content.js']
			});
		}
	}
});
	
chrome.tabs.onActivated.addListener((activeInfo) => {
	//console.log("chrome.tabs.onActivated");
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		if (isValidUrl(tab.url)) {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['content.js']
			});
		}
	});
});

// extension popup message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// listen for messages from content.js
	if (message.action === "initExtension") {
		//console.log("initExtension");
		pageTitle = message.pageTitle;
	}
	else if (message.action === "enableExtension") {
		//console.log("enableExtension");
		pageTitle = message.pageTitle;
		chrome.action.enable(sender.tab.id);
	}
	else if (message.action === "disableExtension") {
		//console.log("disableExtension");
		pageTitle = message.pageTitle;
		chrome.action.disable(sender.tab.id);
	}
	// listen from messages from popup.js
	else if (message.action === "expandIframe") {
		//console.log("expandIframe");
		const iframeIndex = message.index;
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			console.log(tabs);
			if (isValidUrl(tabs[0].url)) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: expandDOMToIframe,
					args: [iframeIndex]
				});
			}
		});
	}
	else if (message.action === "closeIframe") {
		//console.log("closeIframe");
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (isValidUrl(tabs[0].url)) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: closePopupIframe
				});
			}
		});
	}
	// listen from messages from initial.js
	else if (message.action === "openDevUI") {
		//console.log("openDevUI");
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (isValidUrl(tabs[0].url)) {
				if (pageTitle === targetTitle) {
					chrome.scripting.executeScript({
						target: { tabId: tabs[0].id },
						func: generatePopup
					});
				}
			}
		});
	}
});

const targetTitle = "Rune DevUI";
let pageTitle = '';

function isValidUrl(url) {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
	} catch (e) {
		return false;
	}
}

function generatePopup() {
	const oldIframe = document.getElementById('cm-frame');

	if (oldIframe) {
		oldIframe.remove();
		return;
	}

	const iframe = document.createElement('iframe');
	iframe.setAttribute('id', 'cm-frame');
	iframe.classList.add('popup');

	iframe.src = chrome.runtime.getURL('popup.html');
	iframe.setAttribute('allow', '');

	document.body.appendChild(iframe);
}

function closePopupIframe() {
	const oldIframe = document.getElementById('cm-frame');
	if (oldIframe) {
		oldIframe.remove();
		return true;
	}
	return false;
}

function expandDOMToIframe(iframeIndex) {
	const iframes = document.querySelectorAll('iframe');
	//console.log(`Total iframes found: ${iframes.length}`);
	if (!iframeIndex) {
		iframes.forEach((iframe, index) => {
			if (index < iframes.length) console.log("Game #1", iframe);
		});
	}
	else if (iframes.length >= iframeIndex) {
		console.log(iframes[iframeIndex - 1]);
	}
	else {
		console.log(`No iframe found with index ${iframeIndex}`);
	}
}
