(function () {
    'use strict';

    var DatabaseObject,
        Queue,
        utils;


    utils = require('../utils');
    DatabaseObject = require(__dirname + '/DatabaseObject');
    Queue = require(__dirname + '/Queue');


    function Floor(options) {
        var that;

        this.defaults = {
            name: "Floor"
        };

        DatabaseObject.call(this, options);
        Queue.call(this);

        that = this;

        that.ready(function () {
            that.queue('rooms', function (room) {
                room.init(that.db.addTo('rooms', room.db.values), that);
            });
            return that;
        });
    }


    utils.mixin(Floor, DatabaseObject);
    utils.mixin(Floor, Queue);


    Floor.prototype.rooms = function (rooms) {
        this.enqueue('rooms', rooms);
        return this;
    };


    module.exports = Floor;
}());