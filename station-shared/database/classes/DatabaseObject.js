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

        this.callbacks = [];
        this.dbValues = options;
        this.parent = undefined;
        this.slug = utils.slugify(options.name);
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
            this.trail = (parent === undefined) ? this.slug : parent.trail + "|" + this.slug;

            if (this.callbacks.length > 0) {
                this.callbacks.forEach(function (callback) {
                    if (typeof callback.directive === "function") {
                        callback.directive.apply(that, callback.args);
                    }
                });
            }

            return this;
        };
    }


    DatabaseObject.prototype.ready = function (callback, args) {
        this.callbacks.push({
            directive: callback,
            args: args
        });
    };

    DatabaseObject.createId = function (str) {
        return new mongoose.Types.ObjectId(str);
    };


    module.exports = DatabaseObject;
}());