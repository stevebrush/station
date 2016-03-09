(function () {
    'use strict';

    var DatabaseObject,
        Door,
        Item,
        Location,
        Lockable,
        Room,
        Structure,
        Vessel;


    Lockable = require(__dirname + '/Lockable');
    DatabaseObject = require(__dirname + '/DatabaseObject');

    Location = require(__dirname + '/Location');
    Structure = require(__dirname + '/Structure');
    Room = require(__dirname + '/Room');
    Door = require(__dirname + '/Door');
    Vessel = require(__dirname + '/Vessel');
    Item = require(__dirname + '/Item');


    function Factory() {}


    /**
     * Static methods.
     */

    Factory.location = function (name, description) {
        return new Location({
            name: name,
            description: description
        });
    };

    Factory.structure = function (name, description) {
        return new Structure({
            name: name,
            description: description
        });
    };

    Factory.room = function (name, description) {
        return new Room({
            name: name,
            description: description
        });
    };

    Factory.vessel = function (name, description) {
        return new Vessel({
            name: name,
            description: description
        });
    };

    Factory.key = function (name, description) {
        var item;

        item = new Item({
            name: name,
            description: description
        });

        item.ready(function () {
            Lockable.addKey(this);
        });

        return item;
    };

    Factory.entrance = function (name, description) {
        var room;

        room = Factory.room(name, description);

        room.ready(function () {
            var position,
                positions,
                usedPositions;

            positions = ['n', 's', 'e', 'w'];
            usedPositions = [];

            // Add the entrance property to the structure.
            this.parent.db.set('entrance', DatabaseObject.createId(this.db.document()._id));

            // Add an exit to the room.
            this.db.read('doors').forEach(function (door) {
                usedPositions.push(door.position);
            });

            // Get the first unused position.
            for (var i = 0, len = positions.length; i < len; ++i) {
                if (usedPositions.indexOf(positions[i]) === -1) {
                    position = positions[i];
                }
            }

            if (position === undefined) {
                throw new Error("ERROR! This room doesn't have enough walls to accommodate an exit.");
            }

            this.db.create('doors', {
                name: "Exit",
                isExit: true,
                position: position
            });
        });

        return room;
    };

    Factory.door = function (position, slug) {
        return new Door({
            position: position,
            slug: slug
        });
    };

    module.exports = Factory;
}());