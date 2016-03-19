(function () {
    'use strict';

    var mongoose,
        roomSchema;

    mongoose = require('mongoose');
    roomSchema = require(__dirname + '/room');

    module.exports = mongoose.Schema({
        name: {
            type: String,
            default: "Floor"
        },
        rooms: [roomSchema]
    }, {
        _id: false
    });
}());
