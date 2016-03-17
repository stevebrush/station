(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = Schema({
        description: {
            type: String,
            default: "An indescribable object."
        },
        name: {
            type: String,
            default: "Thing"
        },
        quantity: {
            type: Number,
            default: 1
        },
        value: Number,
        weight: Number
    });
}());