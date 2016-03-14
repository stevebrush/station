(function () {
    'use strict';

    var doorSchema,
        mongoose,
        vesselSchema;

    mongoose = require('mongoose');
    doorSchema = require(__dirname + '/door');
    vesselSchema = require(__dirname + '/vessel');

    module.exports = mongoose.Schema({
        description: String,
        doors: [doorSchema],
        isScanned: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: "Room"
        },
        vessels: [vesselSchema]
    });
}());