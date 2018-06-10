const REFRESH_TIME = 1000*60*60;

let domains = [];

const requestData = () => {
    fetch('http://www.softomate.net/ext/employees/list.json')
        .then(res => res.json())
        .then(data => { 
            domains = data.map(({ domain }) => domain);
        });
    console.log(domains);
    window.setTimeout(requestData, REFRESH_TIME);
}     

requestData();



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            chrome.tabs.sendMessage(tabId, { data: tab.url });
            console.log('sent');
        }
    }
);