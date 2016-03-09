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
            that.queue('rooms', function (room) {
                room.init(that.db.create('rooms', room.dbValues), that);
            });
            return that;
        });
    }


    utils.mixin(Structure, DatabaseObject);
    utils.mixin(Structure, Queue);


    Structure.prototype.rooms = function (rooms) {
        this.enqueue('rooms', rooms);
        return this;
    };


    module.exports = Structure;
}());