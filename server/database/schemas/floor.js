(function () {
    'use strict';

    var mongoose,
        roomSchema,
        Schema;

    mongoose = require('mongoose');
    roomSchema = require(__dirname + '/room');
    Schema = mongoose.Schema;

    module.exports = Schema({
        name: {
            type: String,
            default: "Floor"
        },
        numItems: {
            type: Number,
            default: 0
        },
        rooms: [roomSchema]
    });
}());