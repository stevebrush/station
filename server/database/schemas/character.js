(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = new Schema({
        attributes: {
            vitality: {
                type: Number,
                default: 1
            }
        },
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
