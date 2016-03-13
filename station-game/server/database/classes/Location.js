(function () {
    "use strict";

    var DatabaseObject,
        model,
        Queue,
        utils;


    model = require('../models/location');
    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');


    function Location(options) {
        var that;

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        that.ready(function () {
            that.queue('structures', function (structure) {
                structure.init(that.db.create('structures', structure.dbValues), that);
            });
            return that;
        });
    }


    utils.mixin(Location, DatabaseObject);
    utils.mixin(Location, Queue);


    Location.prototype.structures = function (structures) {
        this.enqueue('structures', structures);
        return this;
    };


    module.exports = Location;
}());