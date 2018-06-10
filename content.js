const handleClose = () => {
    console.log('kek');
    alert(123);
}

chrome.runtime.onMessage.addListener((message, callback) => {
    console.log(message);
    document.body.innerHTML += `<div style="position:absolute;top:0;width:100%;z-index:1000;background:white;">Вы посетили сайт ${message.data}<img src=${chrome.extension.getURL("images/delete.svg")} style="height:20px;float:right;cursor:pointer;" onClick=handleClose;></div>`
});