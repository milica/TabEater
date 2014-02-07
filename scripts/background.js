'use strict';

if ('undefined' == typeof(TabEater)) {
    var TabEater = {};
}

if ('undefined' == typeof(TabEater.background)) {
    TabEater.background = function () {
        var $private = {
            hidden: false,
            ACTION_IN_PROGRESS: false,
            closedTabs: null
        };

        $private.hideTabs = function (tabs) {
            console.log(tabs);
            chrome.storage.sync.get('TE.urls', function (obj) {
                var urls = obj["TE.urls"], url, tabsToRemove = [], tab;
                $private.closedTabs = [];
//
                for (tab in tabs) {
                    var tabUrl = tabs[tab].url.split("/")[2];

                    if (urls.indexOf(tabUrl) === -1) {
                        continue;
                    } else {
                        tabsToRemove.push(tabs[tab].id);
                        $private.closedTabs.push(tabs[tab]);
                    }

                }
                chrome.tabs.remove(tabsToRemove);
                tabsToRemove = null;
                urls = null;
            })
        };

        $private.showTabs = function () {
            var tabs = $private.closedTabs, tab, index;

            for (index in tabs) {
                tab = {
                    index: tabs[index].index,
                    url: tabs[index].url
                };
                chrome.tabs.create(tab);
            }
            $private.closedTabs = null;
        };


        $private.toggle = function () {

            if (this.hidden == false) {

                console.log("BOSS, HIDE!");
                chrome.tabs.query({
                    currentWindow: true
                }, $private.hideTabs);

            } else {

                console.log("BOSS GONE, SHOW!");
                $private.showTabs();

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
            },
            onShortcut: function (command) {
                if (command === "toggle-action") {
                    $shared.onClicked();
                }
            }
        };

        return $shared;
    }();

}

chrome.browserAction.onClicked.addListener(TabEater.background.onClicked);
chrome.commands.onCommand.addListener(TabEater.background.onShortcut);