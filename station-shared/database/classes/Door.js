(function () {
    'use strict';

    function Door(options) {
        var that;

        that = this;
        that.position = options.position;
        that.slug = options.slug;

        return that;
    }

    module.exports = Door;
}());