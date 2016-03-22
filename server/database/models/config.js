(function () {
    'use strict';

    var schema,
        mongoose;

    mongoose = require('mongoose');
    schema = require('../schemas/config');

    module.exports = mongoose.model('Config', schema);
}());
