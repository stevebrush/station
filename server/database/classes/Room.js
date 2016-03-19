(function () {
    'use strict';

    var DatabaseObject,
        Queue,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');


    function Room(options) {
        var that;

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        that.ready(function () {

            that.queue('vessels', function (vessel) {
                vessel.init(that.db.addTo('vessels', vessel.db.values), that);
            });

            that.queue('doors', function (door) {
                door.init(that.db.addTo('doors', door.db.values), that);
            });

            // Assign each room a floor number.
            that.parent.ready(function () {
                var thisFloor;

                thisFloor = this;

                thisFloor.parent.queue('floors', function (floor, i) {
                    if (floor.slug === thisFloor.slug) {
                        that.db.document().floor = i;
                    }
                });
            });


            // When the structure's ready...
            that.parent.parent.ready(function () {
                /*
                 After all rooms have been created (with IDs),
                 Loop through all the doors and switch out slug with doorId
                */
                that.queue('doors', function (door) {
                    var found;

                    found = false;

                    // Find the appropriate room, if it exists.
                    that.parent.parent.queue('floors', function (floor) {
                        if (!found) {
                            floor.queue('rooms', function (room) {
                                if (room.slug === door.slug) {
                                    found = true;
                                    door.db.set('name', room.db.values.name);
                                    door.db.set('roomId', DatabaseObject.createId(room.db.document()._id));
                                }
                            });
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
