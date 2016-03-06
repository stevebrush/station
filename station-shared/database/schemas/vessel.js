(function () {
    'use strict';

    var Vessel,
        itemSchema,
        mongoose,
        Schema;

    mongoose = require('mongoose');
    itemSchema = require(__dirname + '/item');
    Schema = mongoose.Schema;

    module.exports = Schema({
        description: String,
        isLocked: {
            type: Boolean,
            default: false
        },
        numItems: {
            type: Number,
            default: 0
        },
        numItemsFound: {
            type: Number,
            default: 0
        },
        items: [itemSchema],
        keyId: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        name: {
            type: String,
            default: "Container"
        }
    });

}());