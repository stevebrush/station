(function () {
    'use strict';

    function slugify(str) {
        return str.toLowerCase().replace(/'/g, "").replace(/ /g, "-").trim();
    }

    module.exports = {
        slugify: slugify
    };
}());