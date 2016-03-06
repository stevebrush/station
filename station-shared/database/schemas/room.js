(function () {
    'use strict';

    var mongoose,
        Schema,
        vesselSchema;

    mongoose = require('mongoose');
    vesselSchema = require(__dirname + '/vessel');
    Schema = mongoose.Schema;

    module.exports = Schema({
        coordX: Number,
        coordY: Number,
        description: String,
        doors: [
            {
                isExit: {
                    type: Boolean,
                    default: false
                },
                name: String,
                position: String,
                roomId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Room'
                }
            }
        ],
        isEmpty: {
            type: Boolean,
            default: true
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        isScanned: {
            type: Boolean,
            default: false
        },
        keyId: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        name: {
            type: String,
            default: "Room"
        },
        numItems: {
            type: Number,
            default: 0
        },
        numItemsFound: {
            type: Number,
            default: 0
        },
        vessels: [vesselSchema]
    });
}());