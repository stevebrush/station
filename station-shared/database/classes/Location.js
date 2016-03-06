(function () {
    "use strict";

    var model,
        utils;

    model = require('../models/location');
    utils = require('../utils');

    function Location(options) {
        var that,
            waiting;

        that = this;
        that.dbObject = undefined;
        that.dbModel = model;
        that.dbValues = options;
        that.slug = utils.slugify(options.name);
        that.trail = "";

        waiting = {};

        that.init = function () {

            // Set the database object.
            that.dbObject = new that.dbModel(that.dbValues);
            that.trail = that.slug;

            if (waiting.hasOwnProperty('structures')) {

                // For each structure object...
                waiting.structures.forEach(function (structure) {

                    // Add it to the location's document.
                    that.dbObject.structures.push(structure.dbValues);

                    // Initialize the structure object.
                    structure.init(that.dbObject.structures[that.dbObject.structures.length - 1], that);
                });
            }

            return that;
        };

        // Add structures to the waiting list...
        that.structures = function (structures) {
            waiting.structures = structures;
            return that;
        };

        return that;
    }

    module.exports = Location;
}());