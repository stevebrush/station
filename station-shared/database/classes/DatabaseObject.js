(function () {
    'use strict';

    var utils;

    utils = require('../utils');

    function DatabaseObject(options) {
        console.log("Database!");
        this.callbacks = [];
        this.dbObject = undefined;
        this.dbValues = options;
        this.parent = undefined;
        this.slug = utils.slugify(options.name);
        this.trail = "";
        this.waiting = {};
    }

    DatabaseObject.prototype.ready = function (callback, args) {
        this.callbacks.push({
            directive: callback,
            args: args
        });
    };

    DatabaseObject.prototype.init = function (dbObject, parent) {
        this.dbObject = dbObject;
        this.parent = parent;
        this.trail = parent.trail + "|" + this.slug;

        var that = this;
        if (this.callbacks.length > 0) {
            this.callbacks.forEach(function (callback) {
                if (typeof callback.directive === "function") {
                    callback.directive.apply(that, callback.args);
                }
            });
        }

        return this;
    };

    module.exports = DatabaseObject;
}());