(function () {
    'use strict';

    var DatabaseObject,
        Lockable,
        utils;

    DatabaseObject = require(__dirname + '/DatabaseObject');
    Lockable = require(__dirname + '/Lockable');
    utils = require('../utils');

    function Door(options) {
        var that;

        DatabaseObject.call(this, options);
        Lockable.call(this);

        that = this;
    }

    utils.mixin(Door, DatabaseObject);
    utils.mixin(Door, Lockable);

    module.exports = Door;
}());