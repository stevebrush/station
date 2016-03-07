(function () {
    'use strict';

    var mongoose,
        utils,
        World;

    mongoose = require('mongoose');
    utils = require('../utils');

    module.exports = function (world) {

        function Room(options) {
            var callbacks,
                that,
                waiting;

            that = this;
            that.dbObject = undefined;
            that.dbValues = options;
            that.slug = utils.slugify(options.name);
            that.trail = "";
            that.parent = undefined;

            waiting = {};
            callbacks = [];

            that.init = function (dbObject, parent) {

                // Receive the database object assigned by this structure's location.
                that.dbObject = dbObject;
                that.parent = parent;
                that.trail = parent.trail + "|" + that.slug;

                if (waiting.hasOwnProperty('vessels')) {

                    // For each room object...
                    waiting.vessels.forEach(function (room) {

                        // Add it to the structure's document.
                        that.dbObject.vessels.push(room.dbValues);

                        // Initialize the room object.
                        room.init(that.dbObject.vessels[that.dbObject.vessels.length - 1], that);
                    });
                }

                if (waiting.hasOwnProperty('doors')) {
                    that.parent.ready(function (doors, rooms) {
                        /*
                         After all rooms have been created (with IDs),
                         Loop through all the doors and switch out slug with doorId
                        */
                        doors.forEach(function (door) {
                            rooms.forEach(function (room) {
                                if (room.slug === door.slug) {
                                    that.dbObject.doors.push({
                                        name: room.dbObject.name,
                                        roomId: new mongoose.Types.ObjectId(room.dbObject._id),
                                        position: door.position
                                    });
                                }
                            });
                        });
                    }, [
                        waiting.doors,
                        that.parent.elements.rooms
                    ]);
                }

                callbacks.forEach(function (callback) {
                    if (typeof callback.directive === "function") {
                        callback.directive.apply(that, callback.args);
                    }
                });

                return that;
            };

            // Add vessels to the waiting list.
            that.vessels = function (vessels) {
                waiting.vessels = vessels;
                return that;
            };

            that.doors = function (doors) {
                waiting.doors = doors;
                return that;
            };

            that.lock = function (trail) {
                that.ready(function (mongoose, world, trail) {
                    this.dbObject.isLocked = true;
                    this.dbObject.keyId = new mongoose.Types.ObjectId(world.getKey(trail))
                }, [
                    mongoose,
                    world,
                    trail
                ]);
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

        return Room;
    };
}());