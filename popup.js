import Handlebars from 'handlebars';
import './styles.sass';

const { domains } = chrome.extension.getBackgroundPage();
const domainsList = { domainsList: Object.keys(domains) };

const source = `
    <div class="test_popup_wrapper">
        {{#each domainsList}}
            <a class="test_popup_link" class="sex" href=https://{{this}} target="_blank">
                Перейти на сайт {{this}}
            </a>
        {{/each}}
    </div>
`;

const template = Handlebars.compile(source);
const html = template(domainsList);

document.getElementById('app').innerHTML = html;