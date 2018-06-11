import Handlebars from 'handlebars';

const source = `
    <div id="testExtBlock" style="position:fixed;top:0;width:100%;z-index:10000;background:white;">
        {{message}}
        <img id="testExtClose" src={{image}} style="height:20px;float:right;cursor:pointer;">
    </div>`;
const template = Handlebars.compile(source);
const image = chrome.extension.getURL("images/delete.svg");

chrome.runtime.onMessage.addListener(({ message, domain }) => {
    const context = { message, image };
    const html = template(context);

    document.body.innerHTML += html;
    
    document.getElementById('testExtClose').addEventListener('click', () => {
        chrome.storage.sync.set({ [domain]: true });

        document.getElementById('testExtBlock').style.display = "none";
    });
});
