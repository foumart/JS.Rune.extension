document.addEventListener('DOMContentLoaded', () => {
	const targetTitle = "Rune DevUI";

	if (document.title === targetTitle) {
		chrome.runtime.sendMessage({ action: "enableExtension", pageTitle: document.title });

		/*const iframes = document.querySelectorAll('iframe');
		iframes.forEach(iframe => {
			iframe.addEventListener('load', () => {
				const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
				const expandAll = (node) => {
					if (node.children) {
						for (let child of node.children) {
							child.open = true;
							expandAll(child);
						}
					}
				};
				expandAll(iframeDocument.documentElement);
			});
		});*/
	} else {
		chrome.runtime.sendMessage({ action: "disableExtension", pageTitle: document.title });
	}
});

chrome.runtime.sendMessage({ action: "initExtension", pageTitle: document.title });
