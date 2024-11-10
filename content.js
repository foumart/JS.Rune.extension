document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('iframe');
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
    });
});