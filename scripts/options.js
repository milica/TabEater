var Options = {
    init: function () {

        Options.prepareElements();
        Options.getUrls();

    },
    /**
     * Url list populated from the localStorage once the app is initiated
     */
    urls: [],
    /**
     * Reference to the form element
     */
    form: '',
    /**
     * Reference to the status element
     */
    status: '',
    /**
     * Reference to the save button
     */
    save: '',
    /**
     * Reference to the add button
     */
    add: '',

    emptyText: "There are not blacklisted urls. Click ADD URL button to add urls to your list.",

    /**
     * Prepare elements for interaction
     */
    prepareElements: function () {

        Options.form = document.getElementById("url-list");
        Options.status = document.getElementById("status");
        Options.save = document.querySelector("#save");
        Options.add = document.querySelector("#add-new");

        Options.save.addEventListener('click', Options.saveUrls);
        Options.add.addEventListener('click', Options.addUrl);

    },
    /**
     * Get urls form localStorage and generate HTML structure
     * Namespace for the localStorage is TE
     * @returns {*}
     */
    getUrls: function () {

        var urls = localStorage["TE.urls"];

        if (!urls || urls === '[]') {

            Options.status.innerText = Options.emptyText;
            Options.save.setAttribute("disabled", "disabled");

            return;
        }

        urls = JSON.parse(urls);

        for (var i = 0; i < urls.length; i++) {

            var child = Options.createChild(urls[i]);

            Options.form.appendChild(child);
        }

        Options.urls = urls;

        return urls;
    },
    /**
     * Save urls into localStorage
     */
    saveUrls: function () {

        var children = Options.form.children;
        var urls = [];

        for (var i = 0; i < children.length; i++) {

            var url = children[i].children[0].value;

            // check if url is empty string or if it exists
            if (url !== '' && urls.indexOf(url) === -1) {
                urls.push(url);
            }
        }

        if (urls.length > 0) {
            // save to LS
            localStorage["TE.urls"] = JSON.stringify(urls);

            Options.urls = urls;
            Options.status.innerText = "Your changes have been saved.";
            Options.status.className = "saved";
            Options.form.innerHTML = "";
            Options.getUrls();

            setTimeout(function() {
                Options.status.innerText = "";
                Options.status.className = "";
            }, 3000);

        }

    },
    /**
     * Add url input holder
     */
    addUrl: function () {

        var child = Options.createChild();

        Options.form.appendChild(child);

        if (Options.form.children.length === 1) {
            Options.status.innerText = "";
            Options.save.removeAttribute("disabled");
        }

    },
    /**
     * Remove url from the localStorage and from the list
     * @param e
     */
    removeUrl: function (e) {

        var button = e.target;
        var holder = button.parentNode;
        var input = holder.children[0];

        Options.urls.splice(Options.urls.indexOf(input.value), 1);
        localStorage["TE.urls"] = JSON.stringify(Options.urls);

        Options.form.removeChild(holder);

        button.removeEventListener('click', Options.removeUrl, false);

        if (Options.form.children.length === 0) {
            Options.status.innerText = Options.emptyText;
            Options.save.setAttribute("disabled", "disabled");
        }

    },
    /**
     * Create child for the url list
     * @param url
     * @returns {HTMLElement}
     */
    createChild: function (url) {

        url = (url === undefined) ? '' : url;

        var child = document.createElement('div');
        child.className = 'input-container';

        var input = document.createElement('input');
        input.type = 'url';
        input.value = url;
        input.setAttribute('placeholder', 'Type your url here...');

        var remove = document.createElement('button');
        remove.innerHTML = '&times;';
        remove.className = 'remove icon-button';

        remove.addEventListener('click', Options.removeUrl);

        child.appendChild(input);
        child.appendChild(remove);

        return child;

    }
};

document.addEventListener('DOMContentLoaded', Options.init);
