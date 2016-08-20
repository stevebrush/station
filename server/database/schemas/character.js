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
            },
            strength: {
                type: Number,
                default: 1
            }
        },
        backpack: {
            items: {
                type: Array,
                default: []
            }
        },
        isDead: {
            type: Boolean,
            default: false
        },
        isPlayer: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: "Person"
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        },
        status: {
            health: {
                type: Number,
                default: 1
            }
        }
    }, {
        collection: 'Character'
    });
}());
