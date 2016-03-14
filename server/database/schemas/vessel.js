(function () {
    'use strict';

    var itemSchema,
        mongoose;

    mongoose = require('mongoose');
    itemSchema = require(__dirname + '/item');

    module.exports = mongoose.Schema({
        description: String,
        items: [itemSchema],
        name: {
            type: String,
            default: "Box"
        }
    });
}());