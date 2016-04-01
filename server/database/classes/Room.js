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

            that.queue('characters', function (character) {
                character.init(that.db.addTo('characters', character.db.values), that);
            });

            // Assign each room a floor number.
            that.parent.ready(function () {
                that.db.document().floor = that.parent.parent.getQueue('floors').indexOf(this);
            });

            // When the structure's ready...
            that.parent.parent.ready(function () {
                var addCoordsToRoom,
                    floors,
                    getRoomById,
                    setRoomDefaultCoords;

                floors = this.getQueue('floors');

                addCoordsToRoom = function (room) {
                    room.isChecked = true;
                    room.doors.forEach(function (door) {
                        var nextRoom;
                        nextRoom = getRoomById(door.roomId);

                        if (nextRoom.isChecked === false) {

                            // Update this door's coordinates.
                            switch (door.position) {
                                case "n":
                                nextRoom.y = room.y - 1;
                                break;
                                case "s":
                                nextRoom.y = room.y + 1;
                                break;
                                case "e":
                                nextRoom.x = room.x + 1;
                                break;
                                case "w":
                                nextRoom.x = room.x - 1;
                                break;
                            }

                            // The next room is on another floor.
                            if (door.isRamp) {

                                // Set all rooms default coordinates to the door on the previous side of the ramp.
                                setRoomDefaultCoords(nextRoom, room.x, room.y);
                                // switch (door.position) {
                                //     case "n":
                                //     setRoomDefaultCoords(nextRoom, room.x, room.y - 1);
                                //     break;
                                //     case "s":
                                //     setRoomDefaultCoords(nextRoom, room.x, room.y + 1);
                                //     break;
                                //     case "e":
                                //     setRoomDefaultCoords(nextRoom, room.x + 1, room.y);
                                //     break;
                                //     case "w":
                                //     setRoomDefaultCoords(nextRoom, room.x - 1, room.y);
                                //     break;
                                // }
                                addCoordsToRoom(nextRoom);
                                return;
                            }
                            addCoordsToRoom(nextRoom);
                        }
                    });
                };

                getRoomById = function (id) {
                    var found;
                    found = false;
                    floors.forEach(function (floor) {
                        floor.db.get('rooms').forEach(function (room) {
                            if (room._id === id) {
                                found = room;
                            }
                        });
                    });
                    return found;
                };

                setRoomDefaultCoords = function (room, x, y) {
                    room.defaultsSet = true;
                    room.x = x;
                    room.y = y;
                    room.doors.forEach(function (door) {
                        var nextRoom;
                        nextRoom = getRoomById(door.roomId);
                        if (room.defaultsSet === false) {
                            setRoomDefaultCoords(nextRoom, x, y);
                        }
                    });
                };

                // Set some defaults.
                floors.forEach(function (floor) {
                    floor.db.get('rooms').forEach(function (room) {
                        room.x = 0;
                        room.y = 0;
                        room.isChecked = false;
                    });
                });

                // Determine room coordinates.
                floors.forEach(function (floor) {
                    floor.db.get('rooms').forEach(function (room) {
                        addCoordsToRoom(room);
                    });
                });

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

    Room.prototype.characters = function (characters) {
        this.enqueue('characters', characters);
        return this;
    };


    module.exports = Room;
}());
