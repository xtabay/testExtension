const REFRESH_TIME = 1000*60*60;

let domains = {};
let counters = {};
let isClosed;

const getDomain = (url) => {
    const splUrl = url.split('.');
    const maxIndex = splUrl.length - 1;

    return `${splUrl[maxIndex - 1]}.${splUrl[maxIndex]}`
}

const requestData = () => {
    fetch('http://www.softomate.net/ext/employees/list.json')
        .then(res => res.json())
        .then(data => { 
            domains = data.reduce((prev, curr) => {
                return {
                    ...prev,
                    [curr.domain]: curr.message
                }
            }, {});
        });
    
    window.setTimeout(requestData, REFRESH_TIME);
}     
requestData();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const { hostname } = new URL(tab.url);
    const currentDomain = getDomain(hostname);
    const isContainDomain = Object.keys(domains).includes(currentDomain);
    const currentCounter = counters[currentDomain] || 1;
    const isCompleted = changeInfo.status === 'complete';

    chrome.storage.sync.get(currentDomain, (result) => {
        isClosed = result[currentDomain];
    });

    if (isContainDomain && !isClosed && isCompleted && currentCounter < 3) {
        counters[currentDomain] = currentCounter + 1;

        chrome.tabs.sendMessage(tabId, { type: 'DOMAIN_MESSAGE', message: domains[currentDomain], domain: currentDomain });
    }

    if (isCompleted && currentDomain.match(/google\.(ru|com)|bing\.com/)) {
        chrome.tabs.sendMessage(tabId, { type: 'INJECT_IMG', domains });
    }
});

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
    if (type === 'DOMAINS_LIST') {
        sendResponse({ domains });
    }
});