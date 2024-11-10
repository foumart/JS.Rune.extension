chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("ONMESS",message.action);
    if (message.action === "expandIframe") {
        const iframeIndex = message.index;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: expandDOMToIframe,
                args: [iframeIndex]
            });
        });
    }
});

function expandDOMToIframe(iframeIndex) {
    console.log(`Expanding DOM to reveal iframe #${iframeIndex}`);

    const iframes = document.querySelectorAll('iframe');
    console.log(`Total iframes found: ${iframes.length}`);
    
    if (iframes.length >= iframeIndex) {
        const targetIframe = iframes[iframeIndex - 1];
        console.log(targetIframe);
        const expandAll = (node) => {
            if (node.tagName === "IFRAME" && node === targetIframe) {
                console.log(`Expanded to iframe #${iframeIndex}`);
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
        console.log(`No iframe found with index ${iframeIndex}`);
    }
}