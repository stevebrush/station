(function () {
    'use strict';

    var entranceSchema,
        floorSchema,
        mongoose;

    mongoose = require('mongoose');
    floorSchema = require(__dirname + '/floor');
    entranceSchema = require(__dirname + '/entrance');

    module.exports = mongoose.Schema({
        description: String,
        entrances: [entranceSchema],
        name: {
            type: String,
            default: "Building"
        },
        floors: [floorSchema]
    });
}());