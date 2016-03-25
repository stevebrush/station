(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = new Schema({
        backpack: Object,
        name: {
            type: String,
            default: "Person"
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        }
    }, {
        collection: 'Character'
    });
}());
