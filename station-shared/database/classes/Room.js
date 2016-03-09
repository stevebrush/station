(function () {
    'use strict';

    var DatabaseObject,
        Lockable,
        Queue,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Lockable = require(__dirname + '/Lockable');
    Queue = require(__dirname + '/Queue');


    function Room(options) {
        var that;

        DatabaseObject.call(this, options);
        Lockable.call(this);
        Queue.call(this);

        that = this;

        this.ready(function () {

            this.queue('vessels', function (vessel) {
                vessel.init(this.db.create('vessels', vessel.dbValues), this);
            });

            this.parent.ready(function () {
                /*
                 After all rooms have been created (with IDs),
                 Loop through all the doors and switch out slug with doorId
                */
                that.queue('doors', function (door) {
                    that.parent.queue('rooms', function (room) {
                        if (room.slug === door.slug) {
                            that.db('doors', {
                                name: room.dbObject.name,
                                roomId: DatabaseObject.createId(room.dbObject._id),
                                position: door.position
                            });
                        }
                    });
                });
            });
        });
    }


    // Mixins.
    utils.mixin(Room, DatabaseObject);
    utils.mixin(Room, Lockable);
    utils.mixin(Room, Queue);


    /**
     * Custom prototype functions.
     */

    Room.prototype.doors = function (doors) {
        this.enqueue('doors', doors);
        return this;
    };

    Room.prototype.vessels = function (vessels) {
        this.enqueue('vessels', vessels);
        return this;
    };

    module.exports = function () {
        return Room;
    };
}());