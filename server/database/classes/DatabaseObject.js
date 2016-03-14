(function () {
    'use strict';

    var merge,
        mongoose,
        utils;


    merge = require('merge');
    mongoose = require('mongoose');
    utils = require('../utils');


    function DatabaseObject(options) {
        var _dbObject,
            that;

        _dbObject = undefined;
        that = this;

        this.settings = merge.recursive(true, this.defaults || {}, options);
        this.callbacks = [];
        this.dbValues = this.settings;
        this.parent = undefined;
        this.isReady = false;
        this.slug = utils.slugify(this.settings.name);
        this.trail = "";

        this.db = {
            create: function (documentName, obj) {
                _dbObject[documentName].push(obj);
                return utils.lastItem(_dbObject[documentName]);
            },
            document: function () {
                return _dbObject;
            },
            read: function (documentName) {
                return _dbObject[documentName];
            },
            save: function () {
                _dbObject.save();
            },
            set: function (key, value) {
                _dbObject[key] = value
            }
        };

        this.init = function (dbObject, parent) {
            _dbObject = dbObject;

            this.parent = parent;
            this.slug = utils.slugify(this.settings.name);
            this.trail = (parent === undefined) ? this.slug : parent.trail + "|" + this.slug;

            function doCallbacks() {
                var callbacks;

                callbacks = that.callbacks;
                that.callbacks = [];

                if (callbacks.length > 0) {
                    callbacks.forEach(function (callback) {
                        if (typeof callback.directive === "function") {
                            callback.args.push(dbObject);
                            callback.directive.apply(that, callback.args);
                        }
                    });
                }

                // Callbacks were added to the parent by children objects.
                if (that.callbacks.length > 0) {
                    doCallbacks();
                }
            }

            doCallbacks();
            this.isReady = true;

            return this;
        };
    }


    DatabaseObject.prototype.ready = function (callback, args) {
        if (this.isReady) {
            callback.apply(this, args);
            return;
        }
        this.callbacks.push({
            directive: callback,
            args: args || []
        });
    };

    DatabaseObject.createId = function (str) {
        return new mongoose.Types.ObjectId(str);
    };


    module.exports = DatabaseObject;
}());