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
        floor: {
            type: Number,
            default: 0
        },
        isEntrance: {
            type: Boolean,
            default: false
        },
        isScanned: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: "Room"
        },
        vessels: [vesselSchema],
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        }
    });
}());
