function openMetaTab(info, tab) {
    chrome.tabs.sendRequest(tab.id, {
        info: info
    });
    var url = chrome.extension.getURL("metadata.html#" + tab.id);
    chrome.tabs.create({
        url: url
    });
}

var showForPages = [ "http://*/prweb*", "https://*/prweb*" ];

chrome.contextMenus.create({
    title: "View Metadata",
    contexts: [ "all" ],
    onclick: openMetaTab,
    documentUrlPatterns: showForPages
});