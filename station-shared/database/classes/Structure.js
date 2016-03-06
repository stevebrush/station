(function () {
    'use strict';

    var utils;

    utils = require('../utils');

    function Structure(options) {
        var callbacks,
            that,
            waiting;

        that = this;
        that.dbObject = undefined;
        that.dbValues = options;
        that.slug = utils.slugify(options.name);
        that.trail = "";
        that.elements = {};

        waiting = {};
        callbacks = [];

        that.init = function (dbObject, parent) {

            // Receive the database object assigned by this structure's location.
            that.dbObject = dbObject;
            that.trail = parent.trail + "|" + that.slug;

            if (waiting.hasOwnProperty('rooms')) {

                // For each room object...
                waiting.rooms.forEach(function (room) {

                    // Add it to the structure's document.
                    that.dbObject.rooms.push(room.dbValues);

                    // Initialize the room object.
                    room.init(that.dbObject.rooms[that.dbObject.rooms.length - 1], that);
                });
            }

            callbacks.forEach(function (callback) {
                if (typeof callback.directive === "function") {
                    callback.directive.apply(that, callback.args);
                }
            });

            return that;
        };

        // Add rooms to the waiting list.
        that.rooms = function (rooms) {
            that.elements.rooms = rooms;
            waiting.rooms = rooms;
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

    module.exports = Structure;
}());