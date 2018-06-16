const REFRESH_TIME = 1000*60*60;
const refreshKey = 'lastRefresh';
const domainsKey = 'domains';

let counters = {};
let isClosed;
let domains = {};

const getDomain = (url) => {
    const splUrl = url.split('.');
    const maxIndex = splUrl.length - 1;

    return `${splUrl[maxIndex - 1]}.${splUrl[maxIndex]}`;
}

const requestData = () => {
    let lastRefresh;

    chrome.storage.sync.get(refreshKey, (result) => {
        lastRefresh = result[refreshKey] || 0;
    });

    chrome.storage.sync.get(domainsKey, (result) => {
        domains = JSON.parse(result[domainsKey]);
    });

    const dateDiff = lastRefresh - Date.now();

    if ((dateDiff <= REFRESH_TIME) || Object.keys(domains).length === 0) {
        fetch('http://www.softomate.net/ext/employees/list.json')
            .then(res => res.json())
            .then(data => { 
                domains = data.reduce((prev, curr) => {
                    return {
                        ...prev,
                        [curr.domain]: curr.message
                    }
                }, {});

                chrome.storage.sync.set({ [refreshKey]: Date.now() });
                chrome.storage.sync.set({ [domainsKey]: JSON.stringify(domains) });

                window.domains = domains;
            });

        return;
    }

    const nextRefresh = REFRESH_TIME - lastRefresh;
    window.domains = domains;

    window.setTimeout(requestData, nextRefresh );
}     
requestData();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const { hostname } = new URL(tab.url);
    const currentDomain = getDomain(hostname);
    const isContainDomain = Object.keys(domains).includes(currentDomain);
    const currentCounter = counters[currentDomain] || 0;
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
