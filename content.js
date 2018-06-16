import Handlebars from 'handlebars';

const source = `
    <div id="testExtBlock" class="plank_container">
        <div class="plank_text">{{message}}</div>
        <img id="testExtClose" src={{image}} class="plank_image">
    </div>`;
const template = Handlebars.compile(source);
const image = chrome.extension.getURL("images/delete.svg");
const logo = chrome.extension.getURL("images/128.png");

chrome.runtime.onMessage.addListener(({ message, domain, type, domains }) => {
    const link = document.createElement("link");
    link.href = chrome.extension.getURL("app.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    if (type === 'DOMAIN_MESSAGE') {
        const context = { message, image };
        const html = template(context);
        const messageBlock = document.createElement('div');
        messageBlock.innerHTML = html;

        document.body.appendChild(messageBlock);
        document.body.classList.add('extended');
    
        document.getElementById('testExtClose').addEventListener('click', () => {
            chrome.storage.sync.set({ [domain]: true });

            document.getElementById('testExtBlock').remove();
            document.body.classList.remove('extended');
        });
    }

    if (type === 'INJECT_IMG') {
        const allElements = document.querySelectorAll('a');
        const preparedDomains = Object.keys(domains).map((url) => url.replace('.', '\.'));
        const basicRegex = `https?\:\/\/(www)?.?(${preparedDomains.join('|')})`;
        const regexUrl = new RegExp(basicRegex);

        allElements.forEach((el)=> {
            const href = el.getAttribute('href');
            const isResult = (el.getAttribute('target') === '_blank') || (el.parentNode.tagName === 'H2');

            if (isResult && href && href.match(regexUrl)) {
                el.innerHTML += `<img src=${logo} class="logo_injected">`
            };
        });
    }
});
