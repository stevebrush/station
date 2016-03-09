(function () {
    'use strict';

    var DatabaseObject,
        utils,
        mongoose;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    mongoose = require('mongoose');

    function Lockable() {}

    Lockable.prototype.lock = function (trail) {
        this.ready(function () {
            this.db.set('isLocked', true);
            this.db.set('keyId', DatabaseObject.createId(Lockable.getKey(trail)));
        });
        return this;
    };

    Lockable.addKey = function (item) {
        Lockable.keys[item.trail] = item.dbObject._id;
    };

    Lockable.getKey = function (trail) {
        return Lockable.keys[trail];
    };

    Lockable.keys = {};

    module.exports = Lockable;
}());