(function () {
    'use strict';

    function mixin(destination, source) {
        var k;

        for (k in source.prototype) {
            if (destination.prototype.hasOwnProperty(k) === false) {
                destination.prototype[k] = source.prototype[k];
            }
        }
    }

    function slugify(str) {
        return str.toLowerCase().replace(/'/g, "").replace(/ /g, "-").trim();
    }

    module.exports = {
        mixin: mixin,
        slugify: slugify
    };
}());