'use strict';

if ('undefined' == typeof(tab))         {var tab = {};}

if ('undefined' == typeof(tab.eater))  {
    tab.eater = function() {
        var $private = {

        };

        var $shared = {
            onClicked: function(details) {
                console.log("RADI!");
            }
        };

        return $shared;
    }();
}

chrome.browserAction.onClicked.addListener(tab.eater.onClicked);