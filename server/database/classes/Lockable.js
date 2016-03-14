(function () {
    'use strict';

    var DatabaseObject,
        utils;

    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');

    function Lockable() {
        var that;

        that = this;
    }

    Lockable.prototype.lock = function (trail) {
        this.ready(function () {
            var keyId;

            keyId = Lockable.getKey(trail);

            if (!keyId) {
                throw new Error("Key not found! " + trail);
            }

            this.db.set('isLocked', true);
            this.db.set('keyId', DatabaseObject.createId(keyId));
        });
        return this;
    };

    Lockable.addKey = function (item) {
        Lockable.keys[item.trail] = item.db.document()._id;
    };

    Lockable.getKey = function (trail) {
        return Lockable.keys[trail];
    };

    Lockable.keys = {};

    module.exports = Lockable;
}());