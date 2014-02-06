var Options = {
    init: function () {

        Options.attachEvents();
        Options.getUrls();

    },
    url: [],
    attachEvents: function () {

        document.querySelector('#save').addEventListener('click', Options.saveUrls);

    },
    getUrls: function () {
        var urls = localStorage["urls"];

        if (!urls) {
            return;
        }
        urls = JSON.parse(urls);

        var form = document.getElementById("url-list");

        // build list
        for (var i = 0; i < urls.length; i++) {

            var url = urls[i];

            var child = document.createElement('input');
            child.type = 'text';
            child.value = url;

            form.appendChild(child);
        }

        this.urls = urls;

        return urls;
    },
    saveUrls: function () {

        var form = document.getElementById("url-list");

        var children = form.children;
        var length = children.length;

        for (var i = 0; i < length; i++) {

            var url = children[i].value;

            if (url.indexOf(Options.urls) === -1) {
                Options.urls.push(url);
            }
        }
        localStorage["urls"] = JSON.stringify(Options.urls);

        var status = document.getElementById("status");

        status.innerHTML = "Options Saved.";

        setTimeout(function() {
            status.innerHTML = "";
        }, 2000);

    }
};

document.addEventListener('DOMContentLoaded', Options.init);
