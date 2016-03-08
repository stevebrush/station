(function () {
    'use strict';

    var DatabaseObject,
        Lockable,
        mongoose,
        utils,
        World;

    mongoose = require('mongoose');
    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Lockable = require(__dirname + '/Lockable');

    module.exports = function (world) {

        function Room(options) {
            var that;

            DatabaseObject.call(this, options);
            Lockable.call(this, {}, world);

            that = this;

            this.ready(function () {
                if (this.waiting.hasOwnProperty('vessels')) {

                    // For each room object...
                    this.waiting.vessels.forEach(function (vessel) {

                        // Add it to the structure's document.
                        that.dbObject.vessels.push(vessel.dbValues);

                        // Initialize the vessel object.
                        vessel.init(that.dbObject.vessels[that.dbObject.vessels.length - 1], that);
                    });
                }
                if (this.waiting.hasOwnProperty('doors')) {
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
                        this.waiting.doors,
                        that.parent.elements.rooms
                    ]);
                }
            });

            // Add vessels to the waiting list.
            this.vessels = function (vessels) {
                this.waiting.vessels = vessels;
                return that;
            };

            this.doors = function (doors) {
                this.waiting.doors = doors;
                return that;
            };

            return this;
        }

        Room.prototype = Object.create(DatabaseObject.prototype);
        utils.mixin(Room, Lockable);
        Room.prototype.constructor = Room;

        return Room;
    };
}());