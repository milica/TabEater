'use strict';

if ('undefined' == typeof(TabEater)) {
    var TabEater = {};
}

if ('undefined' == typeof(TabEater.options)) {
    TabEater.options = function() {

        var $private = {};

        $private.init = function () {

            $private.prepareElements();
            $private.setUrls();

        };

        /**
         * Url list populated from the chrome storage once the app is initiated
         */
        $private.urls = [];

        /**
         * Reference to the form element
         */
        $private.form = '';

        /**
         * Reference to the status element
         */
        $private.status =  '';

        /**
         * Reference to the save button
         */
        $private.save =  '';

        /**
         * Reference to the add button
         */
        $private.add =  '';

        $private.emptyText =  "There are not blacklisted urls. Click ADD URL button to add urls to your list.";

        /**
         * Prepare elements for interaction
         */
        $private.prepareElements = function () {

            $private.form = document.getElementById("url-list");
            $private.status = document.getElementById("status");
            $private.save = document.querySelector("#save");
            $private.add = document.querySelector("#add-new");

            $private.save.addEventListener('click', $private.saveUrls);
            $private.add.addEventListener('click', $private.addUrl);

        };

        /**
         * Get urls form chrome storage and generate HTML structure
         * Namespace for the storage is is TE
         * @returns {*}
         */
        $private.setUrls = function () {

            chrome.storage.sync.get('TE.urls', function(obj) {

                var urls = obj["TE.urls"];

                if (!urls || urls.length === 0) {

                    $private.status.innerText = $private.emptyText;
                    $private.save.setAttribute("disabled", "disabled");

                    return;
                }

                for (var i = 0; i < urls.length; i++) {

                    var child = $private.createChild(urls[i]);

                    $private.form.appendChild(child);
                }

                $private.urls = urls;

            });

        };

        /**
         * Get urls
         * @returns {*}
         */
        $private.getUrls = function () {

            return $private.urls;

        };

        /**
         * Save urls into chrome storage
         */
        $private.saveUrls = function () {

            var children = $private.form.children;
            var urls = [];

            for (var i = 0; i < children.length; i++) {

                var url = children[i].children[0].value;

                // check if url is empty string or if it exists
                if (url !== '' && urls.indexOf(url) === -1) {
                    urls.push(url);
                }
            }

            if (urls.length > 0) {

                chrome.storage.sync.set({'TE.urls': urls}, function() {

                    $private.urls = urls;
                    $private.status.innerText = "Your changes have been saved.";
                    $private.status.className = "saved";
                    $private.form.innerHTML = "";
                    $private.setUrls();

                    setTimeout(function() {
                        $private.status.innerText = "";
                        $private.status.className = "";
                    }, 3000);

                });

            }

        };

        /**
         * Add url input holder
         */
        $private.addUrl = function () {

            var child = $private.createChild();

            $private.form.appendChild(child);

            if ($private.form.children.length === 1) {
                $private.status.innerText = "";
                $private.save.removeAttribute("disabled");
            }

        };

        /**
         * Remove url from the chrome storage and from the list
         * @param e
         */
        $private.removeUrl = function (e) {

            var button = e.target;
            var holder = button.parentNode;
            var input = holder.children[0];

            $private.urls.splice($private.urls.indexOf(input.value), 1);

            chrome.storage.sync.set({'TE.urls': $private.urls}, function() {

                $private.form.removeChild(holder);

                button.removeEventListener('click', $private.removeUrl, false);

                if ($private.form.children.length === 0) {
                    $private.status.innerText = $private.emptyText;
                    $private.save.setAttribute("disabled", "disabled");
                }

            });

        };

        /**
         * Create child for the url list
         * @param url
         * @returns {HTMLElement}
         */
        $private.createChild = function (url) {

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

            remove.addEventListener('click', $private.removeUrl);

            child.appendChild(input);
            child.appendChild(remove);

            return child;

        };

        var $shared = {
            get init() {
                $private.init();
            },
            set init(value) { return false; }
        };

        return $shared;

    }();
}

document.addEventListener('DOMContentLoaded', TabEater.options.init);
