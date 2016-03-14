(function () {
    'use strict';

    var DatabaseObject,
        Queue,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');


    function Structure(options) {
        var that;

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        that.ready(function () {
            that.queue('floors', function (floor, i) {
                floor.db.values.name = "Floor " + (parseInt(i) + 1);
                floor.init(that.db.addTo('floors', floor.db.values), that);
            });
            that.queue('entrances', function (entrance) {
                entrance.init(undefined, that);
            });
            return that;
        });
    }


    utils.mixin(Structure, DatabaseObject);
    utils.mixin(Structure, Queue);


    Structure.prototype.floors = function (floors) {
        this.enqueue('floors', floors);
        return this;
    };

    Structure.prototype.entrances = function (entrances) {
        this.enqueue('entrances', entrances);
        return this;
    };


    module.exports = Structure;
}());