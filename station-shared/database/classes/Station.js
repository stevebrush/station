(function () {
    'use strict';

    var Door,
        Item,
        Location,
        merge,
        mongoose,
        myWorld,
        Room,
        Structure,
        Vessel;


    merge = require('merge');
    mongoose = require('mongoose');

    Door = require(__dirname + '/Door');
    Item = require(__dirname + '/Item');
    Vessel = require(__dirname + '/Vessel');
    Location = require(__dirname + '/Location');
    Structure = require(__dirname + '/Structure');

    myWorld = new World();
    Room = require(__dirname + '/Room')(myWorld);

    function Factory(world) {
        var factory;

        factory = this;

        factory.world = world;

        factory.location = function (name, description) {
            return new Location({
                name: name,
                description: description
            });
        };

        factory.structure = function (name, description) {
            return new Structure({
                name: name,
                description: description
            });
        };

        factory.room = function (name, description) {
            return new Room({
                name: name,
                description: description
            });
        };

        factory.vessel = function (name, description) {
            return new Vessel({
                name: name,
                description: description
            });
        };

        factory.key = function (name, description) {
            var item;

            item = new Item({
                name: name,
                description: description
            });

            item.ready(function () {
                factory.world.key(this);
            });

            return item;
        };

        factory.entrance = function (name, description) {
            var room;

            room = factory.room(name, description);

            room.ready(function () {
                var position,
                    positions,
                    usedPositions;

                positions = ['n', 's', 'e', 'w'];
                usedPositions = [];

                // Add the entrance property to the structure.
                this.parent.dbObject.entrance = new mongoose.Types.ObjectId(this.dbObject._id);

                // Add an exit to the room.
                this.dbObject.doors.forEach(function (door) {
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

                this.dbObject.doors.push({
                    name: "Exit",
                    isExit: true,
                    position: position
                });
            });

            return room;
        };

        factory.door = function (position, slug) {
            return new Door({
                position: position,
                slug: slug
            });
        };

        return factory;
    }


    function World() {

        var waiting,
            world;

        world = this;
        world.Item = Item.static;
        world.Vessel = Vessel.static;
        world.elements = {
            keys: {},
            locations: []
        };

        waiting = {};

        world.init = function () {
            if (waiting.hasOwnProperty('locations')) {
                waiting.locations.forEach(function (location) {
                    world.elements.locations.push(location.init());
                });
                world.elements.locations.forEach(function (location) {
                    location.dbObject.save();
                });
            }
            console.log("World building complete.", JSON.stringify(world.elements));
        };

        world.key = function (item) {
            world.elements.keys[item.trail] = item.dbObject._id;
        };

        world.getKey = function (trail) {
            return world.elements.keys[trail];
        };

        world.locations = function (locations) {
            waiting.locations = locations;
            return world;
        };

        return world;
    }

    module.exports = {
        Factory: new Factory(myWorld),
        World: myWorld
    };
}());
