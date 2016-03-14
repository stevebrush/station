(function () {
    'use strict';

    var mongoose,
        structureSchema;

    mongoose = require('mongoose');
    structureSchema = require(__dirname + '/structure');

    module.exports = mongoose.Schema({
        description: String,
        name: String,
        structures: [structureSchema]
    }, {
        collection : 'Location'
    });;
}());