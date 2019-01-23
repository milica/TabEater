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
         * Reference to the clear history checkbox
         */
        $private.clearHistory = '';

        /**
         * Reference to the fallback input
         */
        $private.fallback = false;

        /**
         * Reference to the add input element
         */
        $private.addInput = null;

        /**
         * Prepare elements for interaction
         */
        $private.prepareElements = function () {

            $private.form = document.getElementById("url-list");
            $private.clearHistory = document.querySelector('#clear-history');
            $private.fallback = document.querySelector('#fallback');

            $private.fallback.addEventListener('input', $private.saveOtherOptions);
            // TODO  see if we need this
            // $private.clearHistory.addEventListener('change', $private.saveOtherOptions);

        };

        /**
         * Create empty add input
         */
        $private.createAddInput = function () {

            var addInput = $private.createChild();

            $private.form.appendChild(addInput);

        }

        /**
         * Cleare add input to be used for another url
         */
        $private.clearAndFocusAddInput = function () {

            $private.addInput.value = '';
            $private.addInput.focus();

        }

        /**
         * Get urls form chrome storage and generate HTML structure
         * Namespace for the storage is is TE
         * @returns {*}
         */
        $private.setUrls = function () {

            chrome.storage.sync.get('TE.options', function(obj) {

                var options = obj["TE.options"];
                var urls = (options !== undefined && options.urls !== undefined) ? options.urls : [];

                if (urls.length) {
                    for (var i = 0; i < urls.length; i++) {

                        var child = $private.createChild(urls[i]);

                        $private.form.appendChild(child);
                    }
                }

                if (!$private.urls.length) {
                    $private.createAddInput();
                }

                $private.clearAndFocusAddInput();

                /*
                var clearHistory = (options !== undefined && options.clearHistory !== undefined) ? options.clearHistory : false;
                if (clearHistory === true) {
                    $private.clearHistory.setAttribute('checked', 'checked');
                } else {
                    $private.clearHistory.removeAttribute('checked');
                }
                */

                $private.fallback.value = (options !== undefined && options.fallback !== undefined) ? options.fallback : '';

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
         * Save other options when changed (fallback url and clearHistory)
         */
        $private.saveOtherOptions = function () {

            if ($private.disabled) {
                return;
            }

            $private.disabled = true;

            chrome.storage.sync.set({
                'TE.options': {
                    urls: $private.urls,
                    // clearHistory: $private.clearHistory.checked,
                    fallback: $private.fallback.value
                }
            }, function () {
                if ($private.timeoutId) {
                    clearTimeout($private.timeoutId);
                }

                $private.timeoutId = setTimeout(function() {
                    $private.disabled = false;
                }, 100);
            })

        };

        /**
         * Save new url into chrome storage
         */
        $private.saveUrl = function (e) {

            if (e.which !== 1 && e.which !== 13) {
                return;
            }

            var url = $private.addInput && $private.addInput.value ? $private.addInput.value : '';
            var urls = $private.urls.slice();

            if (!url) {
                return;
            }

            // check if url exists in the list already
            if (urls.indexOf(url) === -1) {
                urls.push(url);
            }

            // var clearHistory = $private.clearHistory.checked;
            var fallback = $private.fallback.value;

            chrome.storage.sync.set({
                'TE.options': {
                    urls: urls,
                    // clearHistory: clearHistory,
                    fallback: fallback
                }
            }, function () {

                var child = $private.createChild(url)

                $private.form.insertBefore(child, $private.addInput.parentNode)

                $private.clearAndFocusAddInput()

                $private.urls = urls

            })

        };

        /**
         * Updates particular url on change
         *
         * @param e
         */
        $private.updateUrl = function (e) {

            if ($private.disabled) {
                return;
            }

            $private.disabled = true;

            var input = e.target;
            var newValue = input.value;
            var index = $private.urls.indexOf(input.dataset.prev);

            $private.urls.splice(index, 1, newValue);
            input.dataset.prev = newValue;

            chrome.storage.sync.set({
                'TE.options': {
                    urls: $private.urls,
                    // clearHistory: $private.clearHistory.checked,
                    fallback: $private.fallback.value
                }
            }, function () {
                if ($private.timeoutId) {
                    clearTimeout($private.timeoutId);
                }

                $private.timeoutId = setTimeout(function() {
                    $private.disabled = false;
                }, 100);
            })

        };

        /**
         * Remove url from the chrome storage and from the list
         * @param e
         */
        $private.removeUrl = function (e) {

            var button = e.target;
            var holder = button.parentNode;
            var input = holder.children[0];

            if (!$private.urls.length) {
                return;
            }

            $private.urls.splice($private.urls.indexOf(input.value), 1);

            // var clearHistory = $private.clearHistory.checked;
            var fallback = $private.fallback.value;

            chrome.storage.sync.set({
                'TE.options': {
                    urls: $private.urls,
                    // clearHistory: clearHistory,
                    fallback: fallback
                }
            }, function () {

                $private.form.removeChild(holder)

                button.removeEventListener('click', $private.removeUrl, false)
                input.removeEventListener('keyup', $private.updateUrl, false);
            })

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


            if (url) {
                input.dataset.prev = url;
                input.addEventListener('keyup', $private.updateUrl);
            } else {
                input.addEventListener('keyup', $private.saveUrl);

                $private.addInput = input;
            }

            child.appendChild(input);

            if (url) {
                var remove = document.createElement('button');
                remove.innerHTML = '&times;';
                remove.className = 'remove icon-button';

                remove.addEventListener('click', $private.removeUrl);

                child.appendChild(remove);
            } else {
                var add = document.createElement('button');
                add.innerHTML = '+';
                add.className = 'add icon-button green';

                add.addEventListener('click', $private.saveUrl);

                child.appendChild(add);
            }

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
