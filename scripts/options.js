var Options = {
    init: function () {

        Options.setElements();
        Options.getUrls();

    },
    urls: [],
    form: '',
    status: '',
    save: '',
    setElements: function () {

        Options.form = document.getElementById("url-list");
        Options.status = document.getElementById("status");
        Options.save = document.querySelector("#save");
        Options.add = document.querySelector("#add-new");

        Options.save.addEventListener('click', Options.saveUrls);
        Options.add.addEventListener('click', Options.addUrl);

    },
    getUrls: function () {
        var urls = localStorage["TE.urls"];

        if (!urls) {

            Options.status.innerText = "You don't have blacklisted urls.";
            Options.save.setAttribute("disabled", "disabled");

            return;
        }
        urls = JSON.parse(urls);

        for (var i = 0; i < urls.length; i++) {

            var url = urls[i];

            var child = Options.createChild(url);

            Options.form.appendChild(child);
        }

        Options.urls = urls;

        return urls;
    },
    saveUrls: function () {

        var children = Options.form.children;
        var length = children.length;
        var urls = [];

        for (var i = 0; i < length; i++) {

            var url = children[i].children[0].value;

            if (url !== '' && urls.indexOf(url) === -1) {
                urls.push(url);
            }
        }

        if (urls.length > 0) {
            localStorage["TE.urls"] = JSON.stringify(urls);

            Options.urls = urls;

            Options.status.innerText = "Options Saved.";

            setTimeout(function() {
                Options.status.innerText = "";
            }, 2000);

            Options.form.innerHTML = "";
            Options.getUrls();
        }

    },
    addUrl: function () {

        var child = Options.createChild();

        Options.form.appendChild(child);

        if (Options.form.children.length === 1) {
            Options.status.innerText = "";
            Options.save.removeAttribute("disabled");
        }

    },
    createChild: function (url) {

        url = (url === undefined) ? '' : url;

        var child = document.createElement('div');
        child.className = 'input-container';

        var input = document.createElement('input');
        input.type = 'url';
        input.value = url;

        var remove = document.createElement('button');
        remove.innerHTML = '&times;';
        remove.className = 'remove icon-button';

        remove.addEventListener('click', Options.removeUrl);

        child.appendChild(input);
        child.appendChild(remove);

        return child;

    },
    removeUrl: function (e) {

        var button = e.target;
        var holder = button.parentNode;
        var input = holder.children[0];

        Options.urls.splice(Options.urls.indexOf(input.value), 1);
        localStorage["TE.urls"] = JSON.stringify(Options.urls);


        Options.form.removeChild(holder);

        button.removeEventListener('click', Options.removeUrl, false);

        if (Options.form.children.length === 0) {
            Options.status.innerText = "You don't have blacklisted urls.";
            Options.save.setAttribute("disabled", "disabled");
        }

    }
};

document.addEventListener('DOMContentLoaded', Options.init);
