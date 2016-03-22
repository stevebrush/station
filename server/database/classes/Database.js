(function () {
    'use strict';


    function Database(options) {
        var service,
            uri;

        uri = options.uri;
        service = options.service;

        this.connect = function (callback) {
            service.connect(uri);
            service.connection.once('open', function () {
                if (callback) {
                    callback.call(this);
                }
            });
        };
    }


    Database.prototype.startup = function (callback) {
        require('../startup')(callback);
    };


    Database.models = {};
    Database.models.Location = require('../models/location');
    Database.models.Config = require('../models/config');


    module.exports = Database;
}());
