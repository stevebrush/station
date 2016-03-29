(function () {
    'use strict';

    var DatabaseObject,
        Door,
        Entrance,
        Floor,
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
    Entrance = require(__dirname + '/Entrance');
    Room = require(__dirname + '/Room');
    Door = require(__dirname + '/Door');
    Vessel = require(__dirname + '/Vessel');
    Item = require(__dirname + '/Item');
    Floor = require(__dirname + '/Floor');


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

    Factory.floor = function () {
        return new Floor();
    };

    Factory.ramp = function (position, roomSlug) {
        return new Door({
            name: roomSlug,
            position: position,
            slug: roomSlug,
            isRamp: true
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
            isDroppable: false,
            name: name,
            description: description
        });

        item.ready(function () {
            Lockable.addKey(this);
        });

        return item;
    };

    Factory.entrance = function (roomSlug, floorSlug) {
        return new Entrance({
            roomSlug: roomSlug,
            floorSlug: floorSlug || "floor-1"
        });
    };

    Factory.door = function (position, slug) {
        return new Door({
            name: slug,
            position: position,
            slug: slug
        });
    };

    module.exports = Factory;
}());
