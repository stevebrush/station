(function () {
    'use strict';

    var mongoose,
        utils;


    mongoose = require('mongoose');
    utils = require('../utils');


    function DatabaseObject(options) {
        var _dbObject,
            that;

        _dbObject = undefined;
        that = this;

        that.settings = utils.merge.recursive(true, that.defaults || {}, options);
        that.callbacks = [];
        that.parent = undefined;
        that.isReady = false;
        that.trail = "";

        // Methods to interact with database.
        that.db = {
            addTo: function (documentName, obj) {
                _dbObject[documentName].push(obj);
                return utils.lastItem(_dbObject[documentName]);
            },
            document: function () {
                return _dbObject;
            },
            get: function (key) {
                return _dbObject[key];
            },
            save: function () {
                _dbObject.save();
            },
            set: function (key, value) {
                _dbObject[key] = value
            },
            values: that.settings
        };

        that.init = function (dbObject, parent) {
            _dbObject = dbObject;

            that.parent = parent;
            that.slug = utils.slugify(that.settings.name);
            that.trail = (parent === undefined) ? that.slug : parent.trail + "|" + that.slug;

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
            that.isReady = true;

            return this;
        };
    }

    /**
     * Adds any number of callbacks to this object's queue,
     * to be executed at the end of its initialization.
     */
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

    /**
     * Generates a mongoose-recognized document ID.
     */
    DatabaseObject.createId = function (str) {
        return new mongoose.Types.ObjectId(str);
    };


    module.exports = DatabaseObject;
}());