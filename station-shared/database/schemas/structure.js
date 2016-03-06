(function () {
    'use strict';

    var mongoose,
        roomSchema,
        Schema;

    mongoose = require('mongoose');
    roomSchema = require(__dirname + '/room');
    Schema = mongoose.Schema;

    module.exports = Schema({
        description: String,
        entrance: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        },
        name: {
            type: String,
            default: "Building"
        },
        numItems: {
            type: Number,
            default: 0
        },
        numItemsFound: {
            type: Number,
            default: 0
        },
        rooms: [roomSchema]
    }, {
        collection : 'Structure'
    });
}());