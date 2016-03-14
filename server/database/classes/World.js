(function () {
    'use strict';

    var Item,
        Queue,
        utils,
        Vessel;


    Item = require(__dirname + '/Item');
    Vessel = require(__dirname + '/Vessel');
    Queue = require(__dirname + '/Queue');
    utils = require('../utils');


    function World() {

        var locationModel,
            that;

        Queue.call(this);

        that = this;
        locationModel = require('../models/location');

        that.init = function (callback) {
            that.queue('locations', function (location) {
                var loc;

                loc = new locationModel(location.db.values);

                location.init(loc);
                location.db.save();

                console.log("Location:", JSON.stringify(location.db.document()));
            });

            console.log("World building complete!");

            if (typeof callback === "function") {
                callback.call(that);
            }
        };
    }


    utils.mixin(World, Queue);


    World.prototype.locations = function (locations) {
        this.enqueue('locations', locations);
        return this;
    };

    World.Item = Item.static;
    World.Vessel = Vessel.static;


    module.exports = World;
}());