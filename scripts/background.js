'use strict';

if ('undefined' == typeof(tab)) {
    var tab = {};
}

if ('undefined' == typeof(tab.eater)) {
    tab.eater = function() {
        var $private = {};
        $private.hidden = false;

        $private.toggle = function () {

            if (this.hidden == false) {

            } else {

            }

            this.hidden = !this.hidden;
        };

        var $shared = {
            onClicked: function(info, tab) {

                $private.toggle();
            }
        };

        return $shared;
    }();
}

chrome.browserAction.onClicked.addListener(tab.eater.onClicked);