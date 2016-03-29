(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = new Schema({
        description: {
            type: String,
            default: "An indescribable object."
        },
        isDroppable: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: "Thing"
        },
        prototypeId: String,
        quantity: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number,
            default: 0
        }
    });
}());
