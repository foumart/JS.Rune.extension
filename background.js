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

// extension browser icon click
chrome.action.onClicked.addListener(async function (tab) {
	//console.log("chrome.tabs.onClicked", pageTitle, tab.url);
	if (isValidUrl(tab.url)) {
		if (pageTitle === targetTitle) {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: generatePopup
			});
		}
	}
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
	iframe.setAttribute('style', `
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		width: 210px;
		height: 120px;
		z-index: 2147483650;
		border: none;
		background-color: transparent;
		position:fixed;`
	);

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
	//console.log(`Expanding DOM to reveal iframe #${iframeIndex}`);

	const iframes = document.querySelectorAll('iframe');
	//console.log(`Total iframes found: ${iframes.length}`);
	
	if (iframes.length >= iframeIndex) {
		const targetIframe = iframes[iframeIndex - 1];

		console.log(targetIframe);

		const expandAll = (node) => {
			if (node.tagName === "IFRAME" && node === targetIframe) {
				//console.log(`Expanded to iframe #${iframeIndex}`);
				return;
			}
			if (node.children) {
				for (let child of node.children) {
					child.open = true;
					expandAll(child);
				}
			}
		};

		expandAll(document.documentElement);
	} else {
		//console.log(`No iframe found with index ${iframeIndex}`);
	}
}
