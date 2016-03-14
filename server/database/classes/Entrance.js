(function () {
    'use strict';

    var DatabaseObject,
        utils;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');

    function Entrance(options) {
        var that;

        DatabaseObject.call(this, options);

        that = this;

        that.ready(function () {
            var entrances,
                positions,
                positionsLength;

            entrances = [];
            positions = ['n', 's', 'e', 'w'];
            positionsLength = positions.length;

            // Loop through the structure's floors.
            that.parent.queue('floors', function (floor) {
                if (floor.slug === that.settings.floorSlug) {

                    // Floor found, now loop through the floor's rooms.
                    floor.queue('rooms', function (room) {
                        var i,
                            position,
                            usedPositions;

                        usedPositions = [];

                        if (room.slug === that.settings.roomSlug) {

                            // Add the entrance to the structure.
                            that.parent.db.addTo('entrances', utils.merge.recursive(true, that.db.values, {
                                roomId: DatabaseObject.createId(room.db.document()._id)
                            }));

                            // Add an exit to the room.
                            room.db.get('doors').forEach(function (door) {
                                usedPositions.push(door.position);
                            });

                            // Get the first unused position.
                            for (i = 0; i < positionsLength; ++i) {
                                if (usedPositions.indexOf(positions[i]) === -1) {
                                    position = positions[i];
                                }
                            }

                            if (position === undefined) {
                                throw new Error("ERROR! This room doesn't have enough walls to accommodate an exit.");
                            }

                            room.db.addTo('doors', {
                                name: room.parent.parent.parent.db.document().name,
                                isExit: true,
                                position: position
                            });
                        }
                    });
                }
            });

            return that;
        });
    }


    utils.mixin(Entrance, DatabaseObject);


    module.exports = Entrance;
}());