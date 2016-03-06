(function () {
    'use strict';

    var locationSchema,
        mongoose;

    mongoose = require('mongoose');
    locationSchema = require('../schemas/location');

    module.exports = mongoose.model('Location', locationSchema);
}());