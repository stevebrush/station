(function () {
    'use strict';

    var Character,
        Item,
        Queue,
        utils,
        Vessel;

    Character = require(__dirname + '/Character');
    Item = require(__dirname + '/Item');
    Vessel = require(__dirname + '/Vessel');
    Queue = require(__dirname + '/Queue');
    utils = require('../utils');

    function World() {

        var ConfigModel,
            LocationModel,
            that;

        Queue.call(this);

        that = this;

        ConfigModel = require('../models/config');
        LocationModel = require('../models/location');

        that.init = function (callback) {
            var config;

            // Build location documents.
            that.queue('locations', function (location) {
                var loc;
                loc = new LocationModel(location.db.values);
                location.init(loc);
                location.db.save();
                console.log("Location:", JSON.stringify(location.db.document()));
            });

            // Build config document.
            config = new ConfigModel(World.Config.get());
            config.save();
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

    // Static methods.
    World.Config = (function () {
        var _configurations,
            that;

        that = this;
        _configurations = {};

        return {
            set: function (key, value) {
                _configurations[key] = value;
                return that;
            },
            get: function () {
                return _configurations;
            }
        };
    }());
    World.Item = Item.static;
    World.Vessel = Vessel.static;
    World.Character = Character.static;


    module.exports = World;
}());
