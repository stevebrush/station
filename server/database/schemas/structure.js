(function () {
    'use strict';

    var characterSchema,
        entranceSchema,
        floorSchema,
        mongoose;

    mongoose = require('mongoose');
    floorSchema = require(__dirname + '/floor');
    characterSchema = require(__dirname + '/character');
    entranceSchema = require(__dirname + '/entrance');

    module.exports = mongoose.Schema({
        characters: [characterSchema],
        description: String,
        entrances: [entranceSchema],
        name: {
            type: String,
            default: "Building"
        },
        floors: [floorSchema]
    });
}());
