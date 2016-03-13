(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = Schema({
        description: String,
        isExit: {
            type: Boolean,
            default: false
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        keyId: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        name: {
            type: String,
            default: "Door"
        },
        position: {
            type: String,
            default: 'n'
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        },
    });
}());