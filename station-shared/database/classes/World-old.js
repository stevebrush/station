(function () {
    'use strict';

    var Item,
        Location,
        merge,
        mongoose,
        Vessel;


    Item = require(__dirname + '/Item');
    merge = require('merge');
    Vessel = require(__dirname + '/Vessel');
    Location = require(__dirname + '/Location');
    mongoose = require('mongoose');


    function World() {

        var onCompleteQueue,
            world;

        onCompleteQueue = [];

        world = this;
        world.locations = [];
        world.keys = [];

        function onComplete(callback, args) {
            onCompleteQueue.push({
                callback: callback,
                args: args
            });
        }

        function triggerOnComplete() {
            onCompleteQueue.forEach(function (action) {
                action.callback.apply(world, action.args);
            });
        };

        world.location = function (name, options) {
            var location,
                that;

            that = this;
            location = new Location(name, options);
            world.locations.push(location);
            that.trail = location.slug;

            return {
                structure: function (name, options) {
                    var structure;

                    structure = location.addStructure(name, options);
                    that.trail += '|' + structure.slug;

                    return {
                        room: function (name, options) {
                            var room;

                            room = structure.addRoom(name, options);
                            that.trail += '|' + room.slug;

                            if (options && options.isEntrance) {
                                structure.db.entrance = {
                                    name: room.db.name,
                                    roomId: room.db._id
                                };
                            }

                            return {
                                lock: function (trail) {
                                    onComplete(function (room, trail) {
                                        room.db.isLocked = true;
                                        room.db.keyId = new mongoose.Types.ObjectId(this.keys[trail]);
                                    }, [
                                        room,
                                        that.trail
                                    ]);
                                    return {
                                        room: function () {
                                            return {
                                                vessel: function () {}
                                            };
                                        }
                                    };
                                },
                                vessel: function (name, options) {
                                    var vessel;

                                    vessel = room.addVessel(name, options);
                                    that.trail += '|' + vessel.slug;

                                    return {
                                        key: function (name) {
                                            var item;

                                            item = vessel.addItem(name, {});
                                            that.trail += '|' + item.slug;
                                            world.keys[that.trail] = item.db._id;

                                            console.log("Trail: ", that.trail);

                                            return {
                                                room: function () {
                                                    return {
                                                        vessel: function () {}
                                                    };
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };
        };

        return {
            Item: Item.static,
            Vessel: Vessel.static,
            build: function () {
                triggerOnComplete();
                world.locations.forEach(function (location) {
                    location.db.save(function (error) {
                        if (error) {
                            console.log("ERROR:", error);
                        }
                        console.log(location.db.name + " created!");
                    });
                });
                // Make sure that each structure has an entrance.
            },
            location: world.location,
            locations: world.locations
        };
    }


    module.exports = new World();
}());
