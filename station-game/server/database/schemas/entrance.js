(function () {
    'use strict';

    var mongoose;

    mongoose = require('mongoose');

    module.exports = mongoose.Schema({
        name: {
            type: String,
            default: "Main Entrance"
        },
        description: String,
        isLocked: {
            type: Boolean,
            default: false
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    });
}());