(function () {
    'use strict';

    var mongoose,
        structureSchema;

    mongoose = require('mongoose');
    structureSchema = require(__dirname + '/structure');

    module.exports = mongoose.Schema({
        coordX: Number,
        coordY: Number,
        description: String,
        name: String,
        percentExplored: Number,
        structures: [structureSchema]
    }, {
        collection : 'Location'
    });;
}());