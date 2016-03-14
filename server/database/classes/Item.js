(function () {
    'use strict';

    var utils;

    utils = require('../utils');


    function Item(options) {
        var callbacks,
            that,
            waiting;

        that = this;
        that.dbObject = undefined;
        that.dbValues = options;
        that.slug = utils.slugify(options.name);
        that.trail = "";

        callbacks = [];
        waiting = {};

        that.init = function (dbObject, parent) {
            that.dbObject = dbObject;
            that.trail = parent.trail + "|" + that.slug;

            callbacks.forEach(function (callback) {
                if (typeof callback.directive === "function") {
                    callback.directive.apply(that, callback.args);
                }
            });

            return that;
        };

        that.ready = function (callback, args) {
            callbacks.push({
                directive: callback,
                args: args
            });
        };

        return that;
    }

    Item.static = {};

    Item.static.getRandomQuantity = function (max) {
        return (max > 1) ? Math.floor((Math.random() * max) + 1) : 1;
    };

    Item.static.template = function (name, options) {
        Item.static.templates[name] = options;
        return Item.static;
    };

    Item.static.templates = {};

    module.exports = Item;
}());