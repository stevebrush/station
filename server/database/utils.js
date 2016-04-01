(function () {
    'use strict';

    var merge;

    merge = require('merge');

    function lastItem(arr) {
        return arr[arr.length - 1];
    }

    function mixin(destination, source) {
        var k;

        for (k in source.prototype) {
            if (destination.prototype.hasOwnProperty(k) === false) {
                destination.prototype[k] = source.prototype[k];
            } else {
                console.log("ERROR: Mixin " + k + " already exists!");
            }
        }

        // Add static methods.
        if (source.static) {
            destination.static = destination.static || {};
            for (k in source.static) {
                if (source.static.hasOwnProperty(k)) {
                    destination.static[k] = source.static[k];
                }
            }
        }
    }

    function slugify(str) {
        return (str) ? str.toLowerCase().replace(/'/g, "").replace(/ /g, "-").trim() : "";
    }

    module.exports = {
        lastItem: lastItem,
        merge: merge,
        mixin: mixin,
        slugify: slugify
    };
}());
