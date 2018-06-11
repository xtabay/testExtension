chrome.runtime.onMessage.addListener((data, callback) => {
    console.log(data);
    document.body.innerHTML += `<div style="position:fixed;top:0;width:100%;z-index:10000;background:white;">${data.message}<img src=${chrome.extension.getURL("images/delete.svg")} style="height:20px;float:right;cursor:pointer;"></div>`
});