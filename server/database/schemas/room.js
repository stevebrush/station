(function () {
    'use strict';

    var doorSchema,
        mongoose,
        Schema,
        vesselSchema;

    mongoose = require('mongoose');
    doorSchema = require(__dirname + '/door');
    vesselSchema = require(__dirname + '/vessel');
    Schema = mongoose.Schema;

    module.exports = Schema({
        coordX: Number,
        coordY: Number,
        description: String,
        doors: [doorSchema],
        isEmpty: {
            type: Boolean,
            default: true
        },
        isScanned: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: "Room"
        },
        numItems: {
            type: Number,
            default: 0
        },
        vessels: [vesselSchema]
    });
}());