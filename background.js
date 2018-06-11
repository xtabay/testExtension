const REFRESH_TIME = 1000*60*60;

let domains = {};

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
        
    if (isContainDomain && changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {message: domains[currentDomain]});
    }
});