(function () {
    'use strict';

    var schema,
        mongoose;

    mongoose = require('mongoose');
    schema = require('../schemas/character');

    module.exports = mongoose.model('CharacterTemplate', schema);
}());
