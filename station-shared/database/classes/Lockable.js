(function () {
    'use strict';

    var utils,
        mongoose;

    utils = require('../utils');
    mongoose = require('mongoose');

    function Lockable(options, world) {
        console.log("Lockable!");
        this.world = world;
    }

    Lockable.prototype.lock = function (trail) {
        this.ready(function (mongoose, world, trail) {
            this.dbObject.isLocked = true;
            this.dbObject.keyId = new mongoose.Types.ObjectId(world.getKey(trail));
        }, [
            mongoose,
            this.world,
            this.trail
        ]);
        return this;
    };

    module.exports = Lockable;
}());