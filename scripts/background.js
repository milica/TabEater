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
            chrome.browserAction.setIcon({path: '../images/crazy_chicken_full.png'});
            chrome.storage.sync.get('TE.options', function (obj) {
                var options = obj["TE.options"];
                var urls = (options !== undefined && options.urls !== undefined) ? options.urls : null;

                if (urls) {

                    var url, tabsToRemove = [], tab;
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
                    if (tabs.length === tabsToRemove.length && options.fallback !== "") {
                        tab = {
                            url: options.fallback
                        };
                        chrome.tabs.create(tab);
                    }
                    chrome.tabs.remove(tabsToRemove);
                    tabsToRemove = null;
                    urls = null;

                }
            })
        };

        $private.showTabs = function () {
            chrome.browserAction.setIcon({path: '../images/crazy_chicken_hungry_19.png'});
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
