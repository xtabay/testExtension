import Handlebars from 'handlebars';

const source = `
    <div id="testExtBlock" class="plank_container">
        <div class="plank_text">{{message}}</div>
        <img id="testExtClose" src={{image}} class="plank_image">
    </div>`;
const template = Handlebars.compile(source);
const image = chrome.extension.getURL("images/delete.svg");

chrome.runtime.onMessage.addListener(({ message, domain, type }) => {
    if (type === 'DOMAIN_MESSAGE') {
    const context = { message, image };
    const html = template(context);
        const link = document.createElement("link");
        link.href = chrome.extension.getURL("app.css");
        link.type = "text/css";
        link.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link);
    document.body.innerHTML += html;
    
    document.getElementById('testExtClose').addEventListener('click', () => {
        chrome.storage.sync.set({ [domain]: true });

        document.getElementById('testExtBlock').style.display = "none";
    });
    }
});
