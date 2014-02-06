'use strict';

if ('undefined' == typeof(tab)) {
    var tab = {};
}

if ('undefined' == typeof(tab.eater)) {
    tab.eater = function () {
        var $private = {};
        $private.hidden = false;
        $private.ACTION_IN_PROGRESS = false;
        $private.currentWindow = null;

        $private.hideTabs = function (tabs) {
            var tab;
            console.log(tabs);
            chrome.storage.sync.get('TE.urls', function (obj) {
                var urls = obj["TE.urls"], url, tabsToRemove = [];
                for (url in urls) {
                    for (tab in tabs) {
                        if (tabs[tab].url.indexOf(urls[url]) === -1) {
                            continue;
                        } else {
                            tabsToRemove.push(tabs[tab].id);
                        }
                    }
                }
                chrome.tabs.remove(tabsToRemove);
            });
        };

        $private.toggle = function () {

            if (this.hidden == false) {
                console.log("BOSS, HIDE!");
                chrome.tabs.query({
                    currentWindow: true
                }, $private.hideTabs);

            } else {
                console.log("BOSS GONE, SHOW!");
            }

            this.hidden = !this.hidden;
        };

        var $shared = {
            onClicked: function (info, tab) {
                if (!$private.ACTION_IN_PROGRESS) {
                    $private.ACTION_IN_PROGRESS = true;
                    $private.toggle();
                    $private.ACTION_IN_PROGRESS = false;
                } else {
                    return;
                }
            }
        };

        return $shared;
    }();
}

chrome.browserAction.onClicked.addListener(tab.eater.onClicked);