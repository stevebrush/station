(function () {
    'use strict';

    var itemTemplateSchema,
        mongoose;

    mongoose = require('mongoose');
    itemTemplateSchema = require('../schemas/item');

    module.exports = mongoose.model('ItemTemplate', itemTemplateSchema);
}());
