(function () {
    'use strict';

    var schema,
        mongoose;

    mongoose = require('mongoose');
    schema = require('../schemas/vessel');

    module.exports = mongoose.model('VesselTemplate', schema);
}());
