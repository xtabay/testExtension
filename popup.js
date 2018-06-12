import Handlebars from 'handlebars';
import './styles.sass';

chrome.runtime.sendMessage({ type: 'DOMAINS_LIST' }, ({ domains }) => {
    const domainsList = { domainsList: Object.keys(domains) };

    let source = `
        <div>
            {{#each domainsList}}
                <a class="sex" href=https://{{this}} target="_blank">Перейти на сайт {{this}}</a>
            {{/each}}
        </div>
    `;

    const template = Handlebars.compile(source);
    const html = template(domainsList);
    
    document.body.innerHTML = html;
});
