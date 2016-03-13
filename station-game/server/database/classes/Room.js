(function () {
    'use strict';

    var DatabaseObject,
        merge,
        Queue,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');
    merge = require('merge');


    function Room(options) {
        var that;

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        this.ready(function () {

            this.queue('vessels', function (vessel) {
                vessel.init(that.db.create('vessels', vessel.dbValues), that);
            });

            that.queue('doors', function (door) {
                door.init(that.db.create('doors', door.dbValues), that);
            });

            // When the floor's ready...
            that.parent.ready(function () {
                /*
                 After all rooms have been created (with IDs),
                 Loop through all the doors and switch out slug with doorId
                */
                that.queue('doors', function (door) {
                    var found;

                    found = false;

                    that.parent.queue('rooms', function (room) {
                        if (room.slug === door.slug) {
                            found = true;
                            door.db.set('name', room.dbValues.name);
                            door.db.set('roomId', DatabaseObject.createId(room.db.document()._id));
                        }
                    });

                    if (found === false) {
                        throw new Error("Door does not match any known Room! " + door.slug);
                    }
                });
            });
        });
    }


    // Mixins.
    utils.mixin(Room, DatabaseObject);
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


    module.exports = Room;
}());