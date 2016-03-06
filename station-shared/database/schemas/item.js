(function () {
    'use strict';

    var mongoose,
        Schema;

    mongoose = require('mongoose');
    Schema = mongoose.Schema;

    module.exports = Schema({
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ItemCategory'
        },
        description: String,
        name: String,
        quantity: Number,
        value: Number,
        weight: Number
    });
}());