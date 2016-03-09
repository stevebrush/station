(function () {
    'use strict';

    var DatabaseObject,
        utils;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');

    function Lockable() {}

    Lockable.prototype.lock = function (trail) {
        this.ready(function () {
            var keyId;

            keyId = Lockable.getKey(trail);

            this.db.set('isLocked', true);
            this.db.set('keyId', DatabaseObject.createId(keyId));
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