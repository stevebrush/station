(function () {
    'use strict';

    var entranceSchema,
        floorSchema,
        mongoose,
        Schema;

    mongoose = require('mongoose');
    floorSchema = require(__dirname + '/floor');
    entranceSchema = require(__dirname + '/entrance');
    Schema = mongoose.Schema;

    module.exports = Schema({
        description: String,
        entrances: [entranceSchema],
        name: {
            type: String,
            default: "Building"
        },
        numItems: {
            type: Number,
            default: 0
        },
        floors: [floorSchema]
    });
}());